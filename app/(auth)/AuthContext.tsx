import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    userData: RegisterFormData
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; message?: string }>;
  confirmResetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
  isLoggedIn: () => Promise<boolean>;
};

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  lifestyleHabits: string;
  medicalHistory: Record<string, any>;
};

// Set API Base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");

        if (userJson && token) {
          const user = JSON.parse(userJson);
          const now = Date.now();

          if (user.expiresAt && now < user.expiresAt) {
            setUser(user);
          } else {
            // Expired — cleanup
            await AsyncStorage.multiRemove(["token", "user"]);
          }
        }
      } catch (error) {
        console.error("Error checking user login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Effect for navigating after the initial load and checking user login
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Navigate to (tabs) if user is authenticated
        router.push("/(tabs)");
      } else {
        // Navigate to (auth) if no user
        router.push("/(auth)/login");
      }
    }
  }, [isLoading, user, router]);

  const isLoggedIn = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("token");
      return !!token;
    } catch (error) {
      console.error("Error checking if user is logged in:", error);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      const data = JSON.parse(text);

      if (response.ok && data.user && data.token) {
        const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 hours
        const userToStore = {
          ...data.user,
          expiresAt,
        };

        await AsyncStorage.setItem("user", JSON.stringify(userToStore));
        await AsyncStorage.setItem("token", data.token); // ⬅️ Store token here

        setUser(data.user);
        return { success: true };
      }

      return {
        success: false,
        message: data.message || "Invalid credentials. Please try again.",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: RegisterFormData
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: "Passwords do not match" };
      }

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      }
      return {
        success: false,
        message: data.message || "Registration failed. Please try again.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  //sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Sign out failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Password reset instructions sent to your email",
        };
      }
      return {
        success: false,
        message:
          data.message || "Failed to request password reset. Please try again.",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmResetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/confirm-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Password has been reset successfully",
        };
      }
      return {
        success: false,
        message: data.message || "Failed to reset password. Please try again.",
      };
    } catch (error) {
      console.error("Confirm reset password error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  //updateHealthProfile
  const updateHealthProfile = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/confirm-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Password has been reset successfully",
        };
      }
      return {
        success: false,
        message: data.message || "Failed to reset password. Please try again.",
      };
    } catch (error) {
      console.error("Confirm reset password error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    resetPassword,
    confirmResetPassword,
    isLoggedIn,
    signOut,
    updateHealthProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Default export required for Expo Router
export default AuthProvider;
