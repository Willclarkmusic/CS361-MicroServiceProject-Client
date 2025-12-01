// Backend game structure (what the API actually returns)
export interface BackendGame {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  imageUrl: string;
  developer: string;
  publisher: string;
  platform: string[];
  price: number;
  website?: string;
  genres: string[];
  tags: string[];
  screenshots: string[];
  metacriticScore?: number | null;
  steamRating?: number | null;
}

// Frontend game structure (what our components expect)
export interface Game {
  id: number;
  title: string;
  description: string;
  genres: string[];
  rating: number; // 0-10 scale (computed from metacriticScore/10 or steamRating)
  releaseYear: number;
  imageUrl: string;
  developer: string;
  publisher: string;
  platform: string[];
  price: number;
  website?: string;
  tags: string[];
  screenshots: string[];
  metacriticScore?: number | null;
}

// Genre type for genre listings
export interface Genre {
  id: number;
  name: string;
  slug: string;
}

// Transform backend game to frontend format
export const transformGame = (game: BackendGame): Game => ({
  id: game.id,
  title: game.title,
  description: game.description,
  genres: game.genres || [],
  // Convert metacritic (0-100) to rating (0-10), fallback to steamRating or 0
  rating: game.metacriticScore
    ? game.metacriticScore / 10
    : (game.steamRating || 0),
  releaseYear: game.releaseYear,
  imageUrl: game.imageUrl,
  developer: game.developer,
  publisher: game.publisher,
  platform: game.platform || [],
  price: game.price,
  website: game.website,
  tags: game.tags || [],
  screenshots: game.screenshots || [],
  metacriticScore: game.metacriticScore,
});
