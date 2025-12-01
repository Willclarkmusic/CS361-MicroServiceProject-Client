// API response from ReviewService
// Note: Backend SQL doesn't always include reviewId in SELECT
export interface ReviewAPI {
  reviewId?: number;
  userId: number;
  gameId: number;
  reviewScore: number; // 1-10 rating
  review: string;
}

// Enriched review with user info for display
export interface Review {
  reviewId: number;
  gameId: number;
  userId: number;
  username: string;
  userAvatar: string;
  rating: number; // 1-10 rating
  content: string;
  createdAt?: string;
}
