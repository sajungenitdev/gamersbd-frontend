// app/contexts/UserAuthContext.tsx
"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  gender?: string; // ✅ ADDED
  createdAt?: string | Date;
  updatedAt?: string | Date;
  emailVerified?: boolean;
  status?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    discord?: string;
  };
  preferences?: {
    newsletter?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    language?: string;
    currency?: string;
    timezone?: string;
    theme?: string;
  };
  stats?: {
    totalOrders?: number;
    totalSpent?: number;
    reviewsWritten?: number;
    wishlistCount?: number;
    compareCount?: number;
    lastLoginAt?: string;
    loginCount?: number;
    accountAge?: number;
  };
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    gender?: string;
    createdAt?: string;
    updatedAt?: string;
    address?: any;
    social?: any;
    preferences?: any;
    stats?: any;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    discord?: string;
  };
  preferences?: {
    newsletter?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    language?: string;
    currency?: string;
    timezone?: string;
    theme?: string;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface UserAuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // API URL from environment or default
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Check for stored token on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
        const storedUser = localStorage.getItem('userData') || sessionStorage.getItem('userData');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log('User auth restored from storage');
          
          // Refresh user data in background
          setTimeout(() => refreshUser(), 1000);
        }
      } catch (error) {
        console.error('Error restoring user auth:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Refresh user data from server
  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = data.data;
        setUser(updatedUser);
        
        // Update storage
        if (localStorage.getItem('userData')) {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('userData')) {
          sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { token: authToken, ...userData } = data.data;

      // Store based on rememberMe preference
      if (rememberMe) {
        localStorage.setItem('userToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('userToken', authToken);
        sessionStorage.setItem('userData', JSON.stringify(userData));
      }

      setToken(authToken);
      setUser(userData as User);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // After successful registration, automatically log in
      await login(userData.email, userData.password, false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      return {
        success: data.success,
        message: data.message,
        resetToken: data.resetToken,
      };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }

      return;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: UpdateProfileData): Promise<void> => {
    if (!token) throw new Error('Not authenticated');

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user state with new data
      const updatedUser = { ...user, ...profileData, ...data.data } as User;
      setUser(updatedUser);

      // Update storage
      if (localStorage.getItem('userData')) {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('userData')) {
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
    if (!token) throw new Error('Not authenticated');

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to change password');
      }

      return;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!token || !user) throw new Error('Not authenticated');

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Log out after deletion
      logout();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all user storage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
    
    setToken(null);
    setUser(null);
    
    // Navigate to home page
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update in storage
      if (localStorage.getItem('userData')) {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('userData')) {
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <UserAuthContext.Provider value={{ 
      user, 
      token, 
      isLoading,
      login, 
      register, 
      logout, 
      updateUser,
      refreshUser,
      forgotPassword,
      resetPassword,
      updateProfile,
      changePassword,
      deleteAccount,
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};