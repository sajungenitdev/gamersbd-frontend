import axios from "axios";
import {
  ApiResponse,
  HomeSettings,
  SliderSlide,
  HeroOffer,
  PromoCard,
} from "../types/homeSettings.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/home-settings";

export const homeSettingsService = {
  // Get settings
  getSettings: async (): Promise<HomeSettings> => {
    try {
      const response = await axios.get<ApiResponse<HomeSettings>>(API_BASE_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching home settings:", error);
      throw error;
    }
  },

  // Update entire settings
  updateSettings: async (data: HomeSettings): Promise<HomeSettings> => {
    const response = await axios.put<ApiResponse<HomeSettings>>(
      API_BASE_URL,
      data,
    );
    return response.data.data;
  },

  // Partial update
  partialUpdate: async (
    updates: Partial<HomeSettings>,
  ): Promise<HomeSettings> => {
    const response = await axios.patch<ApiResponse<HomeSettings>>(
      API_BASE_URL,
      updates,
    );
    return response.data.data;
  },

  // Reset settings
  resetSettings: async (): Promise<HomeSettings> => {
    const response = await axios.delete<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/reset`,
    );
    return response.data.data;
  },

  // Slider Management
  addSliderSlide: async (slideData: SliderSlide): Promise<HomeSettings> => {
    const response = await axios.post<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/slider/slides`,
      slideData,
    );
    return response.data.data;
  },

  updateSliderSlide: async (
    index: number,
    slideData: SliderSlide,
  ): Promise<HomeSettings> => {
    const response = await axios.put<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/slider/slides/${index}`,
      slideData,
    );
    return response.data.data;
  },

  deleteSliderSlide: async (index: number): Promise<HomeSettings> => {
    const response = await axios.delete<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/slider/slides/${index}`,
    );
    return response.data.data;
  },

  // Hero Offers Management
  addHeroOffer: async (offerData: HeroOffer): Promise<HomeSettings> => {
    const response = await axios.post<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/hero/offers`,
      offerData,
    );
    return response.data.data;
  },

  updateHeroOffer: async (
    index: number,
    offerData: HeroOffer,
  ): Promise<HomeSettings> => {
    const response = await axios.put<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/hero/offers/${index}`,
      offerData,
    );
    return response.data.data;
  },

  deleteHeroOffer: async (index: number): Promise<HomeSettings> => {
    const response = await axios.delete<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/hero/offers/${index}`,
    );
    return response.data.data;
  },

  // Partner Logos
  addPartnerLogo: async (logoUrl: string): Promise<HomeSettings> => {
    const response = await axios.post<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/partner-logos`,
      { logoUrl },
    );
    return response.data.data;
  },

  removePartnerLogo: async (logoUrl: string): Promise<HomeSettings> => {
    const response = await axios.delete<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/partner-logos`,
      {
        data: { logoUrl },
      },
    );
    return response.data.data;
  },

  // Promotional Cards
  addPromoCard: async (cardData: PromoCard): Promise<HomeSettings> => {
    const response = await axios.post<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/promotional-section/cards`,
      cardData,
    );
    return response.data.data;
  },

  addPromoCardTwo: async (cardData: PromoCard): Promise<HomeSettings> => {
    const response = await axios.post<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/promotional-section-two/cards`,
      cardData,
    );
    return response.data.data;
  },

  updatePromoCard: async (
    index: number,
    cardData: PromoCard,
  ): Promise<HomeSettings> => {
    const response = await axios.put<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/promotional-section/cards/${index}`,
      cardData,
    );
    return response.data.data;
  },

  updatePromoCardTwo: async (
    index: number,
    cardData: PromoCard,
  ): Promise<HomeSettings> => {
    const response = await axios.put<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/promotional-section-two/cards/${index}`,
      cardData,
    );
    return response.data.data;
  },

  deletePromoCard: async (index: number): Promise<HomeSettings> => {
    const response = await axios.delete<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/promotional-section/cards/${index}`,
    );
    return response.data.data;
  },

  deletePromoCardTwo: async (index: number): Promise<HomeSettings> => {
    const response = await axios.delete<ApiResponse<HomeSettings>>(
      `${API_BASE_URL}/promotional-section-two/cards/${index}`,
    );
    return response.data.data;
  },

  // Game Covers
  addGameCover: async (coverUrl: string): Promise<HomeSettings> => {
    const currentSettings = await homeSettingsService.getSettings();
    return homeSettingsService.updateSettings({
      ...currentSettings,
      ctaBanner: {
        ...currentSettings.ctaBanner,
        featuredGameCovers: [
          ...currentSettings.ctaBanner.featuredGameCovers,
          coverUrl,
        ],
      },
    });
  },

  removeGameCover: async (index: number): Promise<HomeSettings> => {
    const currentSettings = await homeSettingsService.getSettings();
    const updatedCovers = currentSettings.ctaBanner.featuredGameCovers.filter(
      (_, i) => i !== index,
    );
    return homeSettingsService.updateSettings({
      ...currentSettings,
      ctaBanner: {
        ...currentSettings.ctaBanner,
        featuredGameCovers: updatedCovers,
      },
    });
  },
};
