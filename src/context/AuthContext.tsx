import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, AuthState } from "../types/User";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check localStorage for persisted auth
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return {
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      };
    }
    return {
      user: null,
      isAuthenticated: false,
    };
  });

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call with demo credentials validation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check demo credentials
        if (email === "demo" && password === "1234") {
          const mockUser: User = {
            id: "demo-user",
            username: "demo",
            email: "demo@example.com",
          };

          setAuthState({
            user: mockUser,
            isAuthenticated: true,
          });

          localStorage.setItem("user", JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    // Simulate API call - for demo, accept any registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!username || !email || !password) {
          reject(new Error("All fields are required"));
          return;
        }

        const mockUser: User = {
          id: String(Date.now()),
          username: username,
          email: email,
        };

        setAuthState({
          user: mockUser,
          isAuthenticated: true,
        });

        localStorage.setItem("user", JSON.stringify(mockUser));
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
