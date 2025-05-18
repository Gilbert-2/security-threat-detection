
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/services/userService";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          // If user is in localStorage, load from there
          const storedUser = authService.getCurrentUser();
          
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If we have a token but no stored user, try to fetch profile
            try {
              const response = await fetch("http://localhost:7070/auth/profile", {
                headers: {
                  Authorization: `Bearer ${authService.getAuthToken()}`
                }
              });
              
              if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                localStorage.setItem("currentUser", JSON.stringify(userData));
              } else {
                // Invalid token or other error
                authService.logout();
              }
            } catch (error) {
              console.error("Failed to fetch user profile:", error);
              authService.logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
