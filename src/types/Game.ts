export interface Game {
  id: string;
  title: string;
  description: string;
  genres: string[];
  rating: number; // 0-10 scale
  releaseYear: number;
  imageUrl: string;
  developer: string;
  publisher: string;
  platform: string[];
  price: number;
  website?: string;
  categories: string[];
  tags: string[];
  screenshots: string[];
  metacriticScore?: number | null;
  isFeatured?: boolean;
  category?: 'trending' | 'action' | 'top-rated' | 'new-release';
}
