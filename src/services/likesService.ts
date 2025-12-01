// Likes Service - Like/Dislike operations

import { API_URLS, apiGet, apiPost } from './api';

export interface ReactionCounts {
  likes: number;
  dislikes: number;
}

export interface ReactionResponse {
  message: string;
}

// Get like/dislike counts for a review
export const getReactionsByReview = async (
  reviewId: number
): Promise<ReactionCounts> => {
  return apiGet<ReactionCounts>(`${API_URLS.likes}/review/${reviewId}`);
};

// Like a review (or remove like if already liked)
export const likeReview = async (
  userId: number,
  reviewId: number,
  authorId: number
): Promise<ReactionResponse> => {
  return apiPost<ReactionResponse>(
    `${API_URLS.likes}/like/${userId}/${reviewId}/${authorId}`
  );
};

// Dislike a review (or remove dislike if already disliked)
export const dislikeReview = async (
  userId: number,
  reviewId: number,
  authorId: number
): Promise<ReactionResponse> => {
  return apiPost<ReactionResponse>(
    `${API_URLS.likes}/dislike/${userId}/${reviewId}/${authorId}`
  );
};
