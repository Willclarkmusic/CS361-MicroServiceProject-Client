// Review Service - Review CRUD operations

import { API_URLS, apiGet, apiPost, apiDelete } from './api';

// Backend review structure (what API returns - note: reviewId might be missing)
export interface Review {
  reviewId?: number;
  userId: number;
  gameId: number;
  reviewScore: number;
  review: string;
  createdAt?: string;
}

export interface CreateReviewData {
  userId: number;
  gameId: number;
  reviewScore: number;
  review: string;
}

// Get all reviews for a game
// Backend returns array directly, not wrapped in { reviews: [...] }
export const getReviewsByGame = async (gameId: number | string): Promise<Review[]> => {
  const response = await apiGet<Review[]>(`${API_URLS.reviews}/game/${gameId}`);
  // Handle both array response and wrapped response
  if (Array.isArray(response)) {
    return response;
  }
  // If it's wrapped in { reviews: [...] }
  if (response && typeof response === 'object' && 'reviews' in response) {
    return (response as { reviews: Review[] }).reviews || [];
  }
  return [];
};

// Get all reviews by a specific user
export const getReviewsByUser = async (userId: number): Promise<Review[]> => {
  const response = await apiGet<Review[]>(`${API_URLS.reviews}/user/${userId}`);
  // Handle both array response and wrapped response
  if (Array.isArray(response)) {
    return response;
  }
  if (response && typeof response === 'object' && 'reviews' in response) {
    return (response as { reviews: Review[] }).reviews || [];
  }
  return [];
};

// Create a new review
export const createReview = async (
  data: CreateReviewData
): Promise<{ message: string; reviewId: number }> => {
  return apiPost<{ message: string; reviewId: number }>(
    `${API_URLS.reviews}/create`,
    data
  );
};

// Delete a review
export const deleteReview = async (
  reviewId: number
): Promise<{ message: string }> => {
  return apiDelete<{ message: string }>(`${API_URLS.reviews}/delete/${reviewId}`);
};
