import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameById } from "../services/gameService";
import type { Game } from "../types/Game";
import MediaGallery from "../components/gamePage/MediaGallery";
import ReviewsSection from "../components/gamePage/ReviewsSection";
import { FiStar, FiArrowLeft, FiCalendar } from "react-icons/fi";

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        setError("No game ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const gameData = await getGameById(id);
        setGame(gameData);
        setError(null);
      } catch (err) {
        console.error("Error fetching game:", err);
        setError("Failed to load game");
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            Loading game...
          </p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
            Game Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[var(--accent-primary)] text-black px-6 py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 my-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-secondary)] hover:border-black transition-all font-semibold"
        >
          <FiArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
          {/* Game Image */}
          <div className="border-2 lg:col-span-2 border-[var(--border-color)] overflow-hidden">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200";
              }}
            />
          </div>

          {/* Game Info */}
          <div className="flex flex-col">
            <h1 className="text-5xl text-left font-bold mb-4 text-[var(--text-primary)]">
              {game.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1 bg-[var(--accent-primary)] text-black px-4 py-2 border-2 border-black font-bold text-xl">
                <FiStar size={24} fill="currentColor" />
                <span>{game.rating?.toFixed(1) || "N/A"}/10</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                  <FiCalendar size={18} />
                  <span className="text-sm font-semibold">Release Year</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">
                  {game.releaseYear}
                </p>
              </div>
            </div>

            {/* Developer */}
            <div className="mb-6">
              <h3 className="text-sm text-left font-semibold text-[var(--text-secondary)] mb-2">
                DEVELOPER
              </h3>
              <p className="text-xl text-left font-bold text-[var(--text-primary)]">
                {game.developer}
              </p>
            </div>

            {/* Genres */}
            {Array.isArray(game.genres) && game.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-left font-semibold text-[var(--text-secondary)] mb-3">
                  GENRES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-4 py-2 bg-[var(--card-bg)] border-2 border-[var(--border-color)] font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-black transition-all cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms */}
            {Array.isArray(game.platform) && game.platform.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-left font-semibold text-[var(--text-secondary)] mb-3">
                  AVAILABLE ON
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.platform.map((platform) => (
                    <span
                      key={platform}
                      className="px-4 py-2 bg-[var(--card-bg)] border-2 border-[var(--border-color)] font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-black transition-all cursor-pointer"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="w-full mb-8">
          <div className="px-8 py-4 bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)]">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)] text-left">
              About This Game
            </h2>
            <p
              className={`text-lg leading-relaxed text-[var(--text-secondary)] text-left ${
                !descriptionExpanded ? "line-clamp-2" : ""
              }`}
            >
              {game.description}
            </p>
            {game.description && game.description.length > 300 && (
              <button
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                className="text-[var(--accent-primary)] font-bold hover:underline mt-3 text-sm"
              >
                {descriptionExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>

        {/* Media Gallery Section */}
        {Array.isArray(game.screenshots) && game.screenshots.length > 0 && (
          <MediaGallery screenshots={game.screenshots} gameName={game.title} />
        )}

        {/* Reviews Section */}
        <ReviewsSection gameId={id!} gameName={game.title} />
      </div>
    </div>
  );
};

export default GamePage;
