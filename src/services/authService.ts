
import { User } from "./userService";
import { toast } from "@/hooks/use-toast";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;  // For client-side validation only
  phoneNumber: string;
  department: string;
  role: string;
  picture?: string;
}

const API_URL = "http://localhost:7070";

export const authService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: "include", // For cookies if your API uses them
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();
      
      // Store user token in localStorage
      if (userData.token) {
        localStorage.setItem("authToken", userData.token);
      }
      
      // Store user data
      localStorage.setItem("currentUser", JSON.stringify(userData.user || userData));
      
      return userData.user || userData;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },

  signup: async (userData: SignupRequest): Promise<any> => {
    try {
      // Remove confirmPassword as it's not needed by the API
      const { confirmPassword, ...signupData } = userData;
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    // You can add an API call if your backend requires logout notification
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing stored user data", e);
      return null;
    }
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  }
};

export default authService;
