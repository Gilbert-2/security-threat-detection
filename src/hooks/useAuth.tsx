import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/services/userService";
import { authService } from "@/services/authService";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasRole: () => false,
  setUser: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = "https://security-threat-backend.onrender.com";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = authService.getAuthToken();

        if (token) {
          // Always fetch fresh user data from the server
          try {
            const response = await fetch(`${API_URL}/users/profile`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              
              // Ensure role is properly set
              if (!userData.role) {
                throw new Error('User data is incomplete');
              }
              
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } else {
              // Invalid token or other error
              authService.logout();
              toast({
                title: "Session Expired",
                description: "Please log in again.",
              });
            }
          } catch (error) {
            authService.logout();
          }
        }
      } catch (error) {
        console.error("Auth loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [toast]);

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Helper function to check if user has specific role(s)
  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
