import { FiStar } from 'react-icons/fi';

interface StarRatingProps {
  rating: number; // 1-5 scale
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

const StarRating = ({
  rating,
  interactive = false,
  onChange,
  size = 20,
}: StarRatingProps) => {
  const handleClick = (starIndex: number) => {
    if (interactive && onChange) {
      onChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => {
        const filled = index < Math.floor(rating);
        const partial = index < rating && index >= Math.floor(rating);
        const partialPercent = partial ? ((rating - Math.floor(rating)) * 100) : 0;

        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={`relative ${
              interactive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
            }`}
            aria-label={`${index + 1} star${index + 1 === 1 ? '' : 's'}`}
            type="button"
          >
            {/* Background star (outline) */}
            <FiStar
              size={size}
              className="text-[var(--text-primary)]"
            />

            {/* Filled star (overlay) */}
            {filled && (
              <FiStar
                size={size}
                fill="var(--accent-primary)"
                className="absolute top-0 left-0 text-[var(--accent-primary)]"
              />
            )}

            {/* Partial fill for decimal ratings */}
            {partial && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${partialPercent}%` }}
              >
                <FiStar
                  size={size}
                  fill="var(--accent-primary)"
                  className="text-[var(--accent-primary)]"
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
