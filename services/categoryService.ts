// services/categoryService.ts
const API_BASE_URL = "https://gamersbd-server.onrender.com";

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
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

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
        console.log(
          `Using cached categories (age: ${Math.round(age / 1000)}s)`,
        );
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
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch with timeout and proper abort handling
async function fetchWithTimeout(
  url: string,
  timeout: number = 10000, // Reduced to 10 seconds
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`Request timeout after ${timeout}ms for ${url}`);
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      signal: signal || controller.signal,
      headers: {
        Accept: "application/json",
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
  async getAllCategories(options?: {
    signal?: AbortSignal;
  }): Promise<Category[]> {
    // Try to load from cache first for immediate response
    const cachedCategories = loadFromCache();
    if (cachedCategories && cachedCategories.length > 0) {
      // Return cached data immediately, but still try to update in background
      this.fetchAndUpdateCacheInBackground().catch(console.error);
      return cachedCategories;
    }

    // If no cache, try to fetch with retries
    for (let attempt = 1; attempt <= 2; attempt++) {
      // Reduced retries to 2
      try {
        console.log(`Fetching categories (attempt ${attempt}/2)...`);

        const response = await fetchWithTimeout(
          `${API_BASE_URL}/api/categories`,
          10000, // 10 second timeout
          options?.signal,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle different API response structures
        let categoriesData: Category[] = [];

        if (data.success && Array.isArray(data.data)) {
          // Standard format: { success: true, data: [...] }
          categoriesData = data.data;
        } else if (Array.isArray(data)) {
          // Direct array format
          categoriesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          // Nested data format
          categoriesData = data.data;
        } else {
          console.warn("Unknown API response format:", Object.keys(data));
          if (attempt === 2) {
            return [];
          }
          continue;
        }

        if (categoriesData.length > 0) {
          console.log(
            `Successfully fetched ${categoriesData.length} categories`,
          );
          // Save to cache
          saveToCache(categoriesData);
          return categoriesData;
        } else {
          console.warn("API returned empty categories array");
          if (attempt === 2) {
            return [];
          }
        }
      } catch (error) {
        // Don't log the full error object to avoid console pollution
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (
          errorMessage.includes("aborted") ||
          errorMessage.includes("timeout")
        ) {
          console.warn(`Attempt ${attempt} failed: Request timeout or aborted`);
        } else if (errorMessage.includes("Failed to fetch")) {
          console.warn(
            `Attempt ${attempt} failed: Network error - server may be unavailable`,
          );
        } else {
          console.warn(`Attempt ${attempt} failed: ${errorMessage}`);
        }

        if (attempt === 2) {
          console.warn("All fetch attempts failed. Returning empty array.");
          return [];
        }

        // Exponential backoff: 1s, 2s
        const backoffDelay = 1000 * Math.pow(2, attempt - 1);
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
        `${API_BASE_URL}/api/categories`,
        10000, // 10 second timeout
      );

      if (response.ok) {
        const data = await response.json();

        let categoriesData: Category[] = [];
        if (data.success && Array.isArray(data.data)) {
          categoriesData = data.data;
        } else if (Array.isArray(data)) {
          categoriesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          categoriesData = data.data;
        }

        if (categoriesData.length > 0) {
          saveToCache(categoriesData);
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

    // Create a map for quick lookup
    const categoryMap = new Map<string, CategoryWithSubs>();

    // First, create all categories in the map
    categories.forEach((cat) => {
      categoryMap.set(cat._id, {
        ...cat,
        subcategories: [],
      });
    });

    // Build the tree
    const roots: CategoryWithSubs[] = [];

    categories.forEach((cat) => {
      const node = categoryMap.get(cat._id);
      if (!node) return;

      if (cat.parent && cat.parent._id) {
        const parent = categoryMap.get(cat.parent._id);
        if (parent) {
          parent.subcategories.push(node);
        } else {
          // Parent not found, treat as root
          roots.push(node);
        }
      } else {
        // No parent, this is a root category
        roots.push(node);
      }
    });

    // Sort all levels alphabetically
    const sortCategories = (items: CategoryWithSubs[]) => {
      items.sort((a, b) => a.name.localeCompare(b.name));
      items.forEach((item) => {
        if (item.subcategories.length > 0) {
          sortCategories(item.subcategories);
        }
      });
    };

    sortCategories(roots);

    return roots;
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

  // Clear cache manually if needed
  clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log("Categories cache cleared");
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  },
};
