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
    console.log('authService.login called with credentials:', { email: credentials.email }); // Debug log
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status); // Debug log
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Login error response:', error); // Debug log
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      console.log('Login response data:', { 
        token: data.access_token ? 'present' : 'missing',
        user: data.user 
      }); // Debug log

      if (!data.access_token) {
        console.error('No token received in login response'); // Debug log
        throw new Error("Authentication failed - no token received");
      }

      // Store JWT token
      localStorage.setItem("authToken", data.access_token);
      console.log('Auth token stored in localStorage'); // Debug log
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log('User data stored in localStorage:', data.user); // Debug log

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
    console.log('Logging out user...'); // Debug log
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    console.log('Auth token and user data removed from localStorage'); // Debug log
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
    const token = localStorage.getItem('authToken');
    console.log('Getting auth token:', token ? 'present' : 'missing'); // Debug log
    return token;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  }
};

export default authService;
