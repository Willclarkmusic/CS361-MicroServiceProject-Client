export interface Game {
  id: string;
  title: string;
  description: string;
  genres: string[];
  rating: number; // 0-10 scale
  releaseYear: number;
  imageUrl: string;
  developer: string;
  platform: string[];
  isFeatured?: boolean;
  category?: 'trending' | 'action' | 'top-rated' | 'new-release';
}
