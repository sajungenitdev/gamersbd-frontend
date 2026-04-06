// services/faq.service.ts
const API_URL = "https://gamersbd-server.onrender.com/api/faqs";

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
  related: FAQ[];
  order: number;
  views: number;
  helpful: {
    yes: number;
    no: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  count: number;
}

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const faqService = {
  async getAllFAQs(
    params?: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      popular?: boolean;
    },
    signal?: AbortSignal
  ): Promise<{ data: FAQ[]; categories: Category[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = `${API_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, { signal });
    const data = await handleResponse(response);
    return {
      data: data.data,
      categories: data.categories || [],
      total: data.total || 0,
    };
  },

  async getFAQById(id: string, signal?: AbortSignal): Promise<FAQ> {
    const response = await fetch(`${API_URL}/${id}`, { signal });
    const data = await handleResponse(response);
    return data.data;
  },

  async markHelpful(id: string, helpful: boolean, signal?: AbortSignal): Promise<void> {
    const response = await fetch(`${API_URL}/${id}/helpful`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helpful }),
      signal,
    });
    await handleResponse(response);
  },
};