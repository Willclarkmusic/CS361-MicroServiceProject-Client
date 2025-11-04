export interface Review {
  id: string;
  gameId: string;
  userId: string;
  username: string;
  userAvatar: string;
  rating: number; // 1-10 rating
  title: string;
  content: string;
  helpful: number;
  createdAt: string; // ISO date string
}
