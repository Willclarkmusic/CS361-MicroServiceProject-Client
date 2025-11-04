import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../../types/Game";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

interface HeroSliderProps {
  games: Game[];
}

const HeroSlider = ({ games }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [games.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
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
      <div className="relative h-full flex items-center">
        <div className="container px-8">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
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
            <p className="text-lg text-white/90 mb-6 line-clamp-3">
              {currentGame.description}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate(`/game/${currentGame.id}`)}
              className="bg-[var(--accent-primary)] text-black px-8 py-3 border-2 border-black font-bold hover:bg-[var(--accent-primary)] transition-all hover:shadow-none shadow-[4px_4px_0_0_#000]"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`p-[10px] border-2 border-white transition-all ${
              index === currentIndex
                ? "bg-[var(--accent-primary)]"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
