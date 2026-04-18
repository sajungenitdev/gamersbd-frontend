// services/categoryService.ts
const API_BASE_URL = "https://gamersbd-server.onrender.com/api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  parent: string | null; // Changed from object to string ID
  level: number;
  order?: number;
  slug?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CategoryWithSubs extends Category {
  subcategories: CategoryWithSubs[];
}

// Cache management
const CACHE_KEY = "gamersbd_categories";
const CACHE_TREE_KEY = "gamersbd_categories_tree";
const CACHE_TIMESTAMP_KEY = "gamersbd_categories_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper to save to cache
function saveToCache(categories: Category[], isTree: boolean = false): void {
  try {
    const key = isTree ? CACHE_TREE_KEY : CACHE_KEY;
    localStorage.setItem(key, JSON.stringify(categories));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Failed to save categories to cache:", error);
  }
}

// Helper to load from cache
function loadFromCache(
  isTree: boolean = false,
): Category[] | CategoryWithSubs[] | null {
  try {
    const key = isTree ? CACHE_TREE_KEY : CACHE_KEY;
    const cached = localStorage.getItem(key);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < CACHE_DURATION) {
        console.log(
          `Using cached ${isTree ? "tree" : "flat"} categories (age: ${Math.round(age / 1000)}s)`,
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

// Fetch with timeout
async function fetchWithTimeout(
  url: string,
  timeout: number = 10000,
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
  // Fetch category tree directly from API (RECOMMENDED for dropdown)
  async getCategoryTree(options?: {
    signal?: AbortSignal;
  }): Promise<CategoryWithSubs[]> {
    // Try to load from cache first
    const cachedTree = loadFromCache(true) as CategoryWithSubs[] | null;
    if (cachedTree && cachedTree.length > 0) {
      // Background update
      this.fetchAndUpdateTreeInBackground().catch(console.error);
      return cachedTree;
    }

    // Fetch from API
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Fetching category tree (attempt ${attempt}/2)...`);

        const response = await fetchWithTimeout(
          `${API_BASE_URL}/categories/tree`, // Use tree endpoint
          10000,
          options?.signal,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let treeData: CategoryWithSubs[] = [];

        if (data.success && Array.isArray(data.data)) {
          treeData = data.data;
        } else if (Array.isArray(data)) {
          treeData = data;
        }

        if (treeData.length > 0) {
          console.log(
            `Successfully fetched ${treeData.length} root categories with subcategories`,
          );
          saveToCache(treeData as any, true);
          return treeData;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.warn(`Attempt ${attempt} failed: ${errorMessage}`);

        if (attempt === 2) {
          console.warn("All fetch attempts failed. Returning empty array.");
          return [];
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return [];
  },

  // Background update for tree
  async fetchAndUpdateTreeInBackground(): Promise<void> {
    try {
      console.log("Background fetching category tree...");
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/categories/tree`,
        10000,
      );

      if (response.ok) {
        const data = await response.json();
        let treeData: CategoryWithSubs[] = [];

        if (data.success && Array.isArray(data.data)) {
          treeData = data.data;
        }

        if (treeData.length > 0) {
          saveToCache(treeData as any, true);
          console.log("Background tree update successful");
        }
      }
    } catch (error) {
      console.warn("Background tree update failed");
    }
  },

  // Fetch all categories (flat list)
  async getAllCategories(options?: {
    signal?: AbortSignal;
  }): Promise<Category[]> {
    // Try to load from cache first
    const cachedCategories = loadFromCache(false) as Category[] | null;
    if (cachedCategories && cachedCategories.length > 0) {
      this.fetchAndUpdateCacheInBackground().catch(console.error);
      return cachedCategories;
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Fetching categories (attempt ${attempt}/2)...`);

        const response = await fetchWithTimeout(
          `${API_BASE_URL}/categories`,
          10000,
          options?.signal,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let categoriesData: Category[] = [];

        if (data.success && Array.isArray(data.data)) {
          categoriesData = data.data;
        } else if (Array.isArray(data)) {
          categoriesData = data;
        }

        if (categoriesData.length > 0) {
          console.log(
            `Successfully fetched ${categoriesData.length} categories`,
          );
          saveToCache(categoriesData, false);
          return categoriesData;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.warn(`Attempt ${attempt} failed: ${errorMessage}`);

        if (attempt === 2) {
          return [];
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
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
        10000,
      );

      if (response.ok) {
        const data = await response.json();
        let categoriesData: Category[] = [];

        if (data.success && Array.isArray(data.data)) {
          categoriesData = data.data;
        }

        if (categoriesData.length > 0) {
          saveToCache(categoriesData, false);
          console.log("Background update successful");
        }
      }
    } catch (error) {
      console.warn("Background update failed");
    }
  },

  // Build category tree from flat data (fallback)
  buildCategoryTree(categories: Category[]): CategoryWithSubs[] {
    if (!categories || categories.length === 0) {
      return [];
    }

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

      if (cat.parent) {
        const parent = categoryMap.get(cat.parent);
        if (parent) {
          parent.subcategories.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort all levels
    const sortCategories = (items: CategoryWithSubs[]) => {
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      items.forEach((item) => {
        if (item.subcategories.length > 0) {
          sortCategories(item.subcategories);
        }
      });
    };

    sortCategories(roots);

    return roots;
  },

  // Clear cache
  clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TREE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log("Categories cache cleared");
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  },
};
