import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../../types/Game";
import { FiStar } from "react-icons/fi";

interface HeroSliderProps {
  games: Game[];
}

const HeroSlider = ({ games }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const navigate = useNavigate();

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [games.length]);

  // Reset description expansion when slide changes
  useEffect(() => {
    setDescriptionExpanded(false);
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentGame = games[currentIndex];

  if (!currentGame) return null;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden mb-6">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentGame.imageUrl}
          alt={currentGame.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full p-4 flex items-center">
        <div className="container">
          <div className="max-w-2xl text-left">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-left text-white">
              {currentGame.title}
            </h1>

            {/* Rating & Info */}
            <div className="flex items-center gap-4 mb-4 text-white">
              <div className="flex items-center gap-1 bg-[var(--accent-primary)] text-black px-3 py-1 border-2 border-black font-bold">
                <FiStar size={18} fill="currentColor" />
                <span>{currentGame.rating.toFixed(1)}</span>
              </div>
              <span className="font-semibold">{currentGame.releaseYear}</span>
              <span className="font-semibold">{currentGame.developer}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentGame.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white/10 border-2 border-white text-white backdrop-blur-sm font-semibold"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6 max-w-md">
              <p
                className={`text-lg text-white/90 text-left ${
                  !descriptionExpanded ? "line-clamp-2" : ""
                }`}
              >
                {currentGame.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-start">
              <button
                onClick={() => navigate(`/game/${currentGame.id}`)}
                className="bg-[var(--accent-primary)] text-black px-8 py-3 border-2 border-black font-bold hover:bg-[var(--accent-primary)] transition-all hover:shadow-none shadow-[4px_4px_0_0_#000]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`selector-button p-[10px] border-1 border-white transition-all ${
              index === currentIndex
                ? "bg-[var(--accent-secondary)]"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
