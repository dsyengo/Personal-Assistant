// AuthContext.tsx - For managing authentication state
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const API_BASE_URL = "YOUR_API_URL"; // Consider moving to an environment variable

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in on app startup
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (userJson && token) {
        // Optionally validate token here by making an API call
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error("Error checking user login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save authentication data
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
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
        message: "Network error. Please check your connection and try again.",
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
      // Validate passwords match before sending to server
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: "Passwords do not match" };
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Optionally make an API call to invalidate the token on the server
      // Clear all auth-related storage
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
    logout,
    resetPassword,
    confirmResetPassword,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
