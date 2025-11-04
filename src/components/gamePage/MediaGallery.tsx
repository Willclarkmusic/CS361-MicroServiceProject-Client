import { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface MediaGalleryProps {
  screenshots: string[];
  gameName: string;
}

const MediaGallery = ({ screenshots, gameName }: MediaGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Don't render if no screenshots
  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      const newIndex =
        selectedImageIndex === 0
          ? screenshots.length - 1
          : selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      const newIndex =
        selectedImageIndex === screenshots.length - 1
          ? 0
          : selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
    }
  };

  return (
    <section className="mb-12">
      {/* Horizontal scrollable row */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        {screenshots.map((screenshot, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className="neo-card neo-card-hover overflow-hidden aspect-video min-w-[300px] max-w-[300px] flex-shrink-0 group"
          >
            <img
              src={screenshot}
              alt={`${gameName} screenshot ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400";
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 bg-white text-black border-2 border-black hover:bg-[var(--accent-primary)] transition-all z-10"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>

          {/* Image */}
          <div
            className="max-w-6xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[selectedImageIndex]}
              alt={`${gameName} screenshot ${selectedImageIndex + 1}`}
              className="w-full h-full border-4 border-white object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200";
              }}
            />
          </div>

          {/* Navigation arrows at bottom center */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="p-3 bg-white text-black border-2 border-black hover:bg-[var(--accent-primary)] transition-all"
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>

            {/* Image counter */}
            <div className="text-white font-bold px-4">
              {selectedImageIndex + 1} / {screenshots.length}
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="p-3 bg-white text-black border-2 border-black hover:bg-[var(--accent-primary)] transition-all"
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaGallery;
