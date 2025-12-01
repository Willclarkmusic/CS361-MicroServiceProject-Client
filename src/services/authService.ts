// Authentication Service - UserService API calls

import { API_URLS, apiPost } from './api';

export interface User {
  userId: number;
  username: string;
  phoneNumber: string;
  avatarURL: string;
  userBio: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface CreateUserResponse {
  message: string;
  user: {
    userId: number;
    username: string;
    phoneNumber: string;
    mfaToken: number;
  };
}

export interface MFACheckResponse {
  message: string;
  accessToken: string;
  user: User;
}

// Login with username and password
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  return apiPost<LoginResponse>(`${API_URLS.auth}/login`, {
    username,
    password,
  });
};

// Register a new user (returns MFA token for verification)
export const createUser = async (
  username: string,
  password: string,
  phoneNumber: string
): Promise<CreateUserResponse> => {
  return apiPost<CreateUserResponse>(`${API_URLS.auth}/createUser`, {
    username,
    password,
    phoneNumber,
  });
};

// Verify MFA token to complete registration
export const verifyMFA = async (
  mfaInput: number,
  mfaToken: number
): Promise<MFACheckResponse> => {
  return apiPost<MFACheckResponse>(`${API_URLS.auth}/MFA-check`, {
    mfaInput,
    mfaToken,
  });
};

// Refresh access token using refresh token cookie
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  return apiPost<{ accessToken: string }>(`${API_URLS.auth}/refresh-token`);
};

// Logout - clears refresh token cookie
export const logout = async (): Promise<{ message: string }> => {
  return apiPost<{ message: string }>(`${API_URLS.auth}/logout`);
};
