// User Service - User profile operations

import { API_URLS, apiGet, apiPut } from './api';

export interface UserProfile {
  username: string;
  avatarURL: string;
  phoneNumber: string;
  userBio: string | null;
}

// Cache for user profiles to avoid repeated fetches
const userCache: Map<number, { data: UserProfile; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get user profile by ID
export const getUser = async (userId: number): Promise<UserProfile> => {
  // Check cache first
  const cached = userCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const user = await apiGet<UserProfile>(`${API_URLS.auth}/user/${userId}`);

  // Cache the result
  userCache.set(userId, { data: user, timestamp: Date.now() });

  return user;
};

// Update user profile
export const updateUser = async (
  userId: number,
  updates: Partial<UserProfile>
): Promise<{ message: string }> => {
  const result = await apiPut<{ message: string }>(
    `${API_URLS.auth}/updateUser/${userId}`,
    updates
  );

  // Invalidate cache for this user
  userCache.delete(userId);

  return result;
};

// Clear user cache (call on logout)
export const clearUserCache = () => {
  userCache.clear();
};
