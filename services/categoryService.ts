// services/categoryService.ts
const API_BASE_URL = "https://gamersbd-server.onrender.com/api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  parent: {
    _id: string;
    name: string;
  } | null;
  level: number;
  createdAt: string;
}

export interface CategoryWithSubs extends Category {
  subcategories: CategoryWithSubs[];
}

// Cache management
const CACHE_KEY = "gamersbd_categories";
const CACHE_TIMESTAMP_KEY = "gamersbd_categories_timestamp";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache

// Helper to save to cache
function saveToCache(categories: Category[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(categories));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Failed to save categories to cache:", error);
  }
}

// Helper to load from cache
function loadFromCache(): Category[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < CACHE_DURATION) {
        console.log(`Using cached categories (age: ${Math.round(age / 1000)}s)`);
        return JSON.parse(cached);
      }
    }
    return null;
  } catch (error) {
    console.warn("Failed to load categories from cache:", error);
    return null;
  }
}

// Helper to delay retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with timeout and proper abort handling
async function fetchWithTimeout(
  url: string,
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`Request timeout after ${timeout}ms for ${url}`);
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const categoryService = {
  // Fetch all categories with timeout, retry, and caching
  async getAllCategories(): Promise<Category[]> {
    // Try to load from cache first for immediate response
    const cachedCategories = loadFromCache();
    if (cachedCategories && cachedCategories.length > 0) {
      // Return cached data immediately, but still try to update in background
      this.fetchAndUpdateCacheInBackground();
      return cachedCategories;
    }

    // If no cache, try to fetch with retries
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Fetching categories (attempt ${attempt}/3)...`);

        const response = await fetchWithTimeout(
          `${API_BASE_URL}/categories`,
          30000 // 30 second timeout
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          console.log(`Successfully fetched ${data.data.length} categories`);
          // Save to cache
          saveToCache(data.data);
          return data.data;
        } else {
          console.warn("API response missing success flag or data array");
          if (attempt === 3) {
            return [];
          }
        }
      } catch (error) {
        // Don't log the full error object to avoid console pollution
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
          console.warn(`Attempt ${attempt} failed: Request timeout or aborted`);
        } else if (errorMessage.includes('Failed to fetch')) {
          console.warn(`Attempt ${attempt} failed: Network error - server may be unavailable`);
        } else {
          console.warn(`Attempt ${attempt} failed: ${errorMessage}`);
        }

        if (attempt === 3) {
          console.warn("All fetch attempts failed. Returning empty array.");
          return [];
        }

        // Exponential backoff: 2s, 4s, 8s
        const backoffDelay = 2000 * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
      }
    }

    return [];
  },

  // Background update without blocking UI
  async fetchAndUpdateCacheInBackground(): Promise<void> {
    try {
      console.log("Background fetching categories...");
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/categories`,
        30000
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          saveToCache(data.data);
          console.log("Background update successful");
        }
      }
    } catch (error) {
      // Silently fail in background
      console.warn("Background update failed");
    }
  },

  // Build category tree based on parent field
  buildCategoryTree(categories: Category[]): CategoryWithSubs[] {
    if (!categories || categories.length === 0) {
      return [];
    }

    // First, separate root categories (parent = null) from subcategories
    const rootCategories: CategoryWithSubs[] = [];
    const subCategories: Category[] = [];

    // Separate roots and subs
    categories.forEach((cat) => {
      if (!cat.parent) {
        // This is a root category
        rootCategories.push({
          ...cat,
          subcategories: [],
        });
      } else {
        // This is a subcategory
        subCategories.push(cat);
      }
    });

    // Build the hierarchy by matching subcategories to their parents
    rootCategories.forEach((root) => {
      root.subcategories = subCategories
        .filter((sub) => sub.parent && sub.parent._id === root._id)
        .map((sub) => ({
          ...sub,
          subcategories: [],
        }));

      // Handle level 2 subcategories (subcategories of subcategories)
      if (root.subcategories.length > 0) {
        root.subcategories.forEach((sub) => {
          sub.subcategories = subCategories
            .filter((s) => s.parent && s.parent._id === sub._id)
            .map((s) => ({
              ...s,
              subcategories: [],
            }));
        });
      }
    });

    // Sort alphabetically by name
    rootCategories.sort((a, b) => a.name.localeCompare(b.name));
    rootCategories.forEach((root) => {
      if (root.subcategories.length > 0) {
        root.subcategories.sort((a, b) => a.name.localeCompare(b.name));
        root.subcategories.forEach((sub) => {
          if (sub.subcategories.length > 0) {
            sub.subcategories.sort((a, b) => a.name.localeCompare(b.name));
          }
        });
      }
    });

    return rootCategories;
  },

  // Get root categories (parent = null)
  getRootCategories(categories: Category[]): Category[] {
    return categories.filter((cat) => cat.parent === null);
  },

  // Get subcategories for a specific parent ID
  getSubcategoriesByParentId(
    categories: Category[],
    parentId: string,
  ): Category[] {
    return categories.filter(
      (cat) => cat.parent && cat.parent._id === parentId,
    );
  },

  // Get category by ID
  getCategoryById(categories: Category[], id: string): Category | undefined {
    return categories.find((cat) => cat._id === id);
  },

  // Get category by name
  getCategoryByName(
    categories: Category[],
    name: string,
  ): Category | undefined {
    return categories.find((cat) => cat.name === name);
  },
};