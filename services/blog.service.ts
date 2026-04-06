// services/blog.service.ts
// This is for FRONTEND user view only

const API_URL = "https://gamersbd-server.onrender.com/api/blogs";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    email: string;
  };
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  comments: Comment[];
  commentCount: number;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id?: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
  isPublished?: boolean;
}

const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const blogService = {
  // Get all blogs with filters - for displaying blogs to users
  async getAllBlogs(params?: GetBlogsParams): Promise<Blog[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data.data;
  },

  // Get single blog by ID or slug - for viewing individual blog post
  async getBlogByIdentifier(identifier: string): Promise<Blog> {
    const response = await fetch(`${API_URL}/${identifier}`);
    const data = await handleResponse(response);
    return data.data;
  },

  // Like blog - for user interaction
  async likeBlog(id: string): Promise<{ likes: number }> {
    const response = await fetch(`${API_URL}/${id}/like`, {
      method: "POST",
    });
    const data = await handleResponse(response);
    return data.data;
  },

  // Add comment - for user interaction
  async addComment(id: string, comment: { name: string; email: string; text: string; avatar?: string }): Promise<Comment> {
    const response = await fetch(`${API_URL}/${id}/comments`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  // Get comments for a blog
  async getComments(id: string, page?: number, limit?: number): Promise<{ data: Comment[]; total: number; page: number; pages: number }> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    
    const url = `${API_URL}/${id}/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data;
  },
};