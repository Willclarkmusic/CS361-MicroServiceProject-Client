import { useState } from "react";
import type { Review } from "../../types/Review";
import { FiThumbsUp, FiEdit2, FiTrash2 } from "react-icons/fi";

interface ReviewCardProps {
  review: Review;
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ReviewCard = ({
  review,
  isOwnReview = false,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if content is long enough to need expansion
  const needsExpansion =
    review.content.split("\n").length > 8 || review.content.length > 400;

  return (
    <div className="neo-card p-6">
      {/* User Info & Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <img
            src={review.userAvatar}
            alt={`${review.username}'s avatar`}
            className="w-12 h-12 border-2 border-[var(--border-color)]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://i.pravatar.cc/150?img=1";
            }}
          />

          {/* Username & Date */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)]">
              {review.username}
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Rating Display */}
        <div className="bg-[var(--accent-primary)] text-black px-4 py-2 border-2 border-black font-bold text-lg">
          {review.rating.toFixed(1)}/10
        </div>
      </div>

      {/* Review Title */}
      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] text-left">
        {review.title}
      </h3>

      {/* Review Content */}
      <div
        className={`text-[var(--text-secondary)] leading-relaxed mb-4 text-left ${
          !expanded && needsExpansion ? "line-clamp-8" : ""
        }`}
      >
        {review.content}
      </div>

      {/* Show More Button */}
      {needsExpansion && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[var(--accent-primary)] font-semibold hover:underline text-sm mb-4"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Edit and Delete Buttons (only for own reviews) */}
      {isOwnReview && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all text-sm font-semibold"
          >
            <FiEdit2 size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-red-500 hover:border-black hover:text-white transition-all text-sm font-semibold"
          >
            <FiTrash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
