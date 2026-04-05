// services/cart.service.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class CartService {
  private get headers() {
    return {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  async getCart() {
    const response = await axios.get(`${API_URL}/api/cart`, this.headers);
    return response.data;
  }

  async getCartCount() {
    const response = await axios.get(`${API_URL}/api/cart/count`, this.headers);
    return response.data;
  }

  async validateCart() {
    const response = await axios.get(`${API_URL}/api/cart/validate`, this.headers);
    return response.data;
  }

  async addToCart(productId: string, quantity: number, productData: any) {
    const response = await axios.post(
      `${API_URL}/api/cart/add`,
      { productId, quantity, ...productData },
      this.headers
    );
    return response.data;
  }

  async updateCartItem(itemId: string, quantity: number) {
    const response = await axios.put(
      `${API_URL}/api/cart/update/${itemId}`,
      { quantity },
      this.headers
    );
    return response.data;
  }

  async removeCartItem(itemId: string) {
    const response = await axios.delete(
      `${API_URL}/api/cart/remove/${itemId}`,
      this.headers
    );
    return response.data;
  }

  async clearCart() {
    const response = await axios.delete(`${API_URL}/api/cart/clear`, this.headers);
    return response.data;
  }
}

export default new CartService();