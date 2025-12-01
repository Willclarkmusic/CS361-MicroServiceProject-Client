import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { User, AuthState } from "../types/User";
import * as authService from "../services/authService";
import { clearUserCache } from "../services/userService";

interface MFAState {
  pending: boolean;
  mfaToken: number | null;
  tempUser: { userId: number; username: string; phoneNumber: string } | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    phoneNumber: string
  ) => Promise<{ requiresMFA: boolean; mfaToken?: number }>;
  verifyMFA: (mfaInput: number) => Promise<void>;
  logout: () => Promise<void>;
  mfaState: MFAState;
  cancelMFA: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check localStorage for persisted user (access token is in memory only)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return {
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        accessToken: null, // Will need to refresh token
      };
    }
    return {
      user: null,
      isAuthenticated: false,
      accessToken: null,
    };
  });

  const [mfaState, setMfaState] = useState<MFAState>({
    pending: false,
    mfaToken: null,
    tempUser: null,
  });

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      const response = await authService.login(username, password);

      const user: User = response.user;

      setAuthState({
        user,
        isAuthenticated: true,
        accessToken: response.accessToken,
      });

      localStorage.setItem("user", JSON.stringify(user));
    },
    []
  );

  const register = useCallback(
    async (
      username: string,
      password: string,
      phoneNumber: string
    ): Promise<{ requiresMFA: boolean; mfaToken?: number }> => {
      const response = await authService.createUser(
        username,
        password,
        phoneNumber
      );

      // Store MFA state for verification
      setMfaState({
        pending: true,
        mfaToken: response.user.mfaToken,
        tempUser: {
          userId: response.user.userId,
          username: response.user.username,
          phoneNumber: response.user.phoneNumber,
        },
      });

      return {
        requiresMFA: true,
        mfaToken: response.user.mfaToken,
      };
    },
    []
  );

  const verifyMFA = useCallback(
    async (mfaInput: number): Promise<void> => {
      if (!mfaState.mfaToken) {
        throw new Error("No MFA token available");
      }

      const response = await authService.verifyMFA(mfaInput, mfaState.mfaToken);

      const user: User = response.user;

      setAuthState({
        user,
        isAuthenticated: true,
        accessToken: response.accessToken,
      });

      localStorage.setItem("user", JSON.stringify(user));

      // Clear MFA state
      setMfaState({
        pending: false,
        mfaToken: null,
        tempUser: null,
      });
    },
    [mfaState.mfaToken]
  );

  const cancelMFA = useCallback(() => {
    setMfaState({
      pending: false,
      mfaToken: null,
      tempUser: null,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear state regardless of API success
    setAuthState({
      user: null,
      isAuthenticated: false,
      accessToken: null,
    });
    localStorage.removeItem("user");
    clearUserCache();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        verifyMFA,
        logout,
        mfaState,
        cancelMFA,
      }}
    >
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
