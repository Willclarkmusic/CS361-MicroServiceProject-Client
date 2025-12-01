import { useNavigate } from "react-router-dom";
import type { Game } from "../../types/Game";
import { FiStar } from "react-icons/fi";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  // Defensive: ensure genres is an array
  const genres = Array.isArray(game.genres) ? game.genres : [];
  const platforms = Array.isArray(game.platform) ? game.platform : [];
  const rating = typeof game.rating === "number" ? game.rating : 0;

  return (
    <div
      onClick={handleClick}
      className="neo-card neo-card-hover min-w-[230px] max-w-[280px] cursor-pointer overflow-hidden flex-shrink-0"
    >
      {/* Game Image */}
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={
            game.imageUrl ||
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800"
          }
          alt={game.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800";
          }}
        />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-[var(--accent-primary)] text-black px-2 py-1 border-2 border-black flex items-center gap-1 font-bold">
          <FiStar size={14} fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 bg-[var(--card-bg)]">
        <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)] line-clamp-1">
          {game.title}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-xs px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Release Year & Platform */}
        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>{game.releaseYear}</span>
          <span className="line-clamp-1">{platforms[0] || "PC"}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
