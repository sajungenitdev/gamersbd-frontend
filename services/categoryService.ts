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

export const categoryService = {
  // Fetch all categories with timeout and retry
  async getAllCategories(): Promise<Category[]> {
    // Try up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempting to fetch categories (attempt ${attempt}/3)...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE_URL}/categories`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          return data.data; // Return exactly what API provides
        } else {
          return [];
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt === 3) {
          console.warn("All fetch attempts failed. Returning empty array.");
          return [];
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return [];
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
          subcategories: [], // Subcategories can have their own subs (level 2)
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
