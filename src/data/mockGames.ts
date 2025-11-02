import type { Game } from "../types/Game";

export const mockGames: Game[] = [
  // Featured Games for Hero Slider
  {
    id: "1",
    title: "Cyber Nexus 2077",
    description:
      "An immersive open-world RPG set in a dystopian future where technology and humanity collide. Make choices that shape the fate of Night City.",
    genres: ["RPG", "Action", "Open World"],
    rating: 9.2,
    releaseYear: 2023,
    imageUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
    developer: "Neon Studios",
    platform: ["PC", "PS5", "Xbox Series X"],
    isFeatured: true,
    category: "trending",
  },
  {
    id: "2",
    title: "Stellar Odyssey",
    description:
      "Explore the vast cosmos in this space exploration game. Build your ship, discover new planets, and uncover ancient alien mysteries.",
    genres: ["Adventure", "Simulation", "Sci-Fi"],
    rating: 8.8,
    releaseYear: 2024,
    imageUrl:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
    developer: "Cosmos Interactive",
    platform: ["PC", "PS5"],
    isFeatured: true,
    category: "trending",
  },
  {
    id: "3",
    title: "Shadow Realm Warriors",
    description:
      "Master the art of combat in this dark fantasy action game. Battle horrifying creatures and uncover the secrets of the Shadow Realm.",
    genres: ["Action", "Fantasy", "Souls-like"],
    rating: 9.5,
    releaseYear: 2023,
    imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800",
    developer: "Dark Moon Games",
    platform: ["PC", "PS5", "Xbox Series X"],
    isFeatured: true,
    category: "top-rated",
  },
  {
    id: "4",
    title: "Racing Legends Ultimate",
    description:
      "The ultimate racing experience with hyper-realistic graphics and physics. Compete in street races across stunning global locations.",
    genres: ["Racing", "Sports", "Simulation"],
    rating: 8.5,
    releaseYear: 2024,
    imageUrl:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800",
    developer: "Velocity Games",
    platform: ["PC", "PS5", "Xbox Series X"],
    isFeatured: true,
    category: "trending",
  },
  {
    id: "5",
    title: "Mystic Lands",
    description:
      "A magical adventure through enchanted forests and ancient ruins. Solve puzzles and befriend mystical creatures in this family-friendly RPG.",
    genres: ["Adventure", "Fantasy", "Puzzle"],
    rating: 8.9,
    releaseYear: 2023,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    developer: "Dreamscape Studios",
    platform: ["PC", "Nintendo Switch"],
    isFeatured: true,
    category: "top-rated",
  },

  // Trending Now Category
  {
    id: "6",
    title: "Battle Royale X",
    description:
      "Drop into intense 100-player battles. Survive, loot, and be the last one standing in this fast-paced shooter.",
    genres: ["Shooter", "Battle Royale", "Multiplayer"],
    rating: 8.3,
    releaseYear: 2024,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    developer: "Storm Games",
    platform: ["PC", "PS5", "Xbox Series X"],
    category: "trending",
  },
  {
    id: "7",
    title: "Pixel Dungeon Delve",
    description:
      "A retro-styled roguelike with modern mechanics. Every run is different in this challenging pixel art adventure.",
    genres: ["Roguelike", "Indie", "Pixel Art"],
    rating: 8.7,
    releaseYear: 2024,
    imageUrl: "https://images.unsplash.com/photo-1556438758-8d49568ce18e?w=800",
    developer: "Pixel Forge",
    platform: ["PC", "Nintendo Switch"],
    category: "trending",
  },
  {
    id: "8",
    title: "Titan Clash",
    description:
      "Command massive mechs in strategic warfare. Build your perfect mech and dominate the battlefield.",
    genres: ["Strategy", "Mech", "Sci-Fi"],
    rating: 8.4,
    releaseYear: 2024,
    imageUrl:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
    developer: "Iron Giant Studios",
    platform: ["PC", "PS5", "Xbox Series X"],
    category: "trending",
  },

  // Action Games Category
  {
    id: "9",
    title: "Assassin Protocol",
    description:
      "Stealth and precision define this tactical espionage thriller. Every mission requires perfect execution.",
    genres: ["Action", "Stealth", "Tactical"],
    rating: 9.0,
    releaseYear: 2023,
    imageUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    developer: "Shadow Ops",
    platform: ["PC", "PS5", "Xbox Series X"],
    category: "action",
  },
  {
    id: "10",
    title: "Inferno Squad",
    description:
      "Team-based tactical shooter with destructible environments. Coordinate with your squad to complete high-stakes missions.",
    genres: ["Shooter", "Action", "Tactical"],
    rating: 8.6,
    releaseYear: 2023,
    imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800",
    developer: "Blaze Entertainment",
    platform: ["PC", "PS5", "Xbox Series X"],
    category: "action",
  },
  {
    id: "11",
    title: "Neon Striker",
    description:
      "Fast-paced cyberpunk action with stylish combat. Chain combos and parkour through a vibrant neon city.",
    genres: ["Action", "Platformer", "Cyberpunk"],
    rating: 8.8,
    releaseYear: 2024,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    developer: "Pulse Games",
    platform: ["PC", "PS5"],
    category: "action",
  },
  {
    id: "12",
    title: "Warrior's Path",
    description:
      "Master ancient martial arts in this intense action game. Face legendary opponents in epic duels.",
    genres: ["Action", "Fighting", "Martial Arts"],
    rating: 8.5,
    releaseYear: 2023,
    imageUrl:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
    developer: "Dragon Fist Studios",
    platform: ["PC", "PS5", "Xbox Series X", "Nintendo Switch"],
    category: "action",
  },
  {
    id: "13",
    title: "Apocalypse Now",
    description:
      "Survive the zombie apocalypse in this intense action shooter. Scavenge resources and build your safe haven.",
    genres: ["Action", "Horror", "Survival"],
    rating: 8.2,
    releaseYear: 2024,
    imageUrl:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800",
    developer: "Dead End Games",
    platform: ["PC", "PS5", "Xbox Series X"],
    category: "action",
  },

  // Top Rated Category
  {
    id: "14",
    title: "Chronicles of Eternity",
    description:
      "An epic JRPG with a compelling story spanning multiple generations. Experience turn-based combat perfected.",
    genres: ["JRPG", "Fantasy", "Turn-Based"],
    rating: 9.7,
    releaseYear: 2023,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    developer: "Eternal Games",
    platform: ["PC", "PS5", "Nintendo Switch"],
    category: "top-rated",
  },
  {
    id: "15",
    title: "The Last Guardian",
    description:
      "A heartfelt adventure about the bond between a boy and a mythical creature. Puzzle-solving meets emotional storytelling.",
    genres: ["Adventure", "Puzzle", "Story-Rich"],
    rating: 9.4,
    releaseYear: 2022,
    imageUrl:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
    developer: "Guardian Studios",
    platform: ["PS5", "PC"],
    category: "top-rated",
  },
  {
    id: "16",
    title: "Starbound Legends",
    description:
      "The definitive space MMO. Build colonies, trade with alien races, and forge your own path among the stars.",
    genres: ["MMO", "Space", "Sandbox"],
    rating: 9.3,
    releaseYear: 2023,
    imageUrl:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
    developer: "Galaxy Interactive",
    platform: ["PC"],
    category: "top-rated",
  },
  {
    id: "17",
    title: "Forgotten Realms",
    description:
      "A masterclass in world-building and narrative design. Explore a dying world and uncover its forgotten history.",
    genres: ["RPG", "Adventure", "Story-Rich"],
    rating: 9.6,
    releaseYear: 2023,
    imageUrl: "https://images.unsplash.com/photo-1556438758-8d49568ce18e?w=800",
    developer: "Mythos Games",
    platform: ["PC", "PS5", "Xbox Series X"],
    category: "top-rated",
  },
  {
    id: "18",
    title: "Architect's Dream",
    description:
      "The ultimate city-building simulation. Design, build, and manage the metropolis of your dreams with unparalleled depth.",
    genres: ["Simulation", "Strategy", "City Builder"],
    rating: 9.1,
    releaseYear: 2024,
    imageUrl:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800",
    developer: "Blueprint Games",
    platform: ["PC"],
    category: "top-rated",
  },

  // Additional Games
  {
    id: "19",
    title: "Indie Legends Collection",
    description:
      "A curated collection of the best indie games from the past year. Support independent developers.",
    genres: ["Indie", "Compilation", "Various"],
    rating: 8.9,
    releaseYear: 2024,
    imageUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    developer: "Indie Alliance",
    platform: ["PC", "Nintendo Switch"],
    category: "trending",
  },
  {
    id: "20",
    title: "Rhythm Revolution",
    description:
      "The next evolution of rhythm games. Feel the beat and master increasingly complex patterns.",
    genres: ["Rhythm", "Music", "Arcade"],
    rating: 8.7,
    releaseYear: 2024,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    developer: "Beat Studios",
    platform: ["PC", "PS5", "Nintendo Switch"],
    category: "trending",
  },
];

// Helper functions to filter games by category
export const getFeaturedGames = (): Game[] => {
  return mockGames.filter((game) => game.isFeatured === true).slice(0, 5);
};

export const getTrendingGames = (): Game[] => {
  return mockGames.filter((game) => game.category === "trending").slice(0, 8);
};

export const getActionGames = (): Game[] => {
  return mockGames.filter((game) => game.category === "action").slice(0, 8);
};

export const getTopRatedGames = (): Game[] => {
  return mockGames.filter((game) => game.category === "top-rated").slice(0, 8);
};

export const getGameById = (id: string): Game | undefined => {
  return mockGames.find((game) => game.id === id);
};

export const getAllGenres = (): string[] => {
  const genresSet = new Set<string>();
  mockGames.forEach((game) => {
    game.genres.forEach((genre) => genresSet.add(genre));
  });
  return Array.from(genresSet).sort();
};
