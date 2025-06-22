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
  confirmPassword?: string;  
  phoneNumber: string;
  department: string;
  role: string;
  picture?: any; // Use any type for picture as it could be File or string
}

const API_URL = "https://security-threat-backend.onrender.com";

export const authService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error("Authentication failed - no token received");
      }

      // Store JWT token
      localStorage.setItem("authToken", data.access_token);
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return data.user;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },

  signup: async (userData: SignupRequest): Promise<User> => {
    try {
      // Remove confirmPassword as it's not needed by the API
      const { confirmPassword, picture, ...signupData } = userData;
      // Only send the picture as a string (filename) or empty string
      const payload = {
        ...signupData,
        picture: picture && typeof picture === 'object' && picture.name ? picture.name : (typeof picture === 'string' ? picture : ''),
      };
      // Ensure all fields are strings
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === null) {
          payload[key] = '';
        } else {
          payload[key] = String(payload[key]);
        }
      });
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing stored user data", e);
      return null;
    }
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  }
};

export default authService;
