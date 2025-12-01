import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Review } from "../../types/Review";
import { FiTrash2, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import * as likesService from "../../services/likesService";

interface ReviewCardProps {
  review: Review;
  isOwnReview?: boolean;
  onDelete?: () => void;
}

const ReviewCard = ({
  review,
  isOwnReview = false,
  onDelete,
}: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch initial reaction counts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const reactions = await likesService.getReactionsByReview(review.reviewId);
        setLikes(reactions.likes);
        setDislikes(reactions.dislikes);
      } catch (err) {
        console.error("Error fetching reactions:", err);
      }
    };

    fetchReactions();
  }, [review.reviewId]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
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

  const handleLike = async () => {
    if (!isAuthenticated || !user || isLiking) return;

    setIsLiking(true);
    try {
      await likesService.likeReview(user.userId, review.reviewId, review.userId);
      // Refresh reaction counts
      const reactions = await likesService.getReactionsByReview(review.reviewId);
      setLikes(reactions.likes);
      setDislikes(reactions.dislikes);
    } catch (err) {
      console.error("Error liking review:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated || !user || isLiking) return;

    setIsLiking(true);
    try {
      await likesService.dislikeReview(user.userId, review.reviewId, review.userId);
      // Refresh reaction counts
      const reactions = await likesService.getReactionsByReview(review.reviewId);
      setLikes(reactions.likes);
      setDislikes(reactions.dislikes);
    } catch (err) {
      console.error("Error disliking review:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="neo-card p-6">
      {/* User Info & Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* User Avatar - links to profile */}
          <Link to={`/user/${review.userId}`}>
            <img
              src={review.userAvatar}
              alt={`${review.username}'s avatar`}
              className="w-12 h-12 border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all cursor-pointer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
          </Link>

          {/* Username & Date */}
          <div>
            <Link
              to={`/user/${review.userId}`}
              className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all"
            >
              {review.username}
            </Link>
            {review.createdAt && (
              <p className="text-sm text-[var(--text-secondary)]">
                {formatDate(review.createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* Rating Display */}
        <div className="bg-[var(--accent-primary)] text-black px-4 py-2 border-2 border-black font-bold text-lg">
          {review.rating}/10
        </div>
      </div>

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

      {/* Actions Row */}
      <div className="flex items-center justify-between">
        {/* Like/Dislike Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated || isLiking}
            className={`flex items-center gap-2 px-3 py-2 border-2 border-[var(--border-color)] transition-all text-sm font-semibold ${
              isAuthenticated
                ? "hover:bg-green-500 hover:border-black hover:text-white cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            } ${isLiking ? "opacity-50" : ""}`}
            title={isAuthenticated ? "Like this review" : "Login to like"}
          >
            <FiThumbsUp size={16} />
            <span>{likes}</span>
          </button>

          <button
            onClick={handleDislike}
            disabled={!isAuthenticated || isLiking}
            className={`flex items-center gap-2 px-3 py-2 border-2 border-[var(--border-color)] transition-all text-sm font-semibold ${
              isAuthenticated
                ? "hover:bg-red-500 hover:border-black hover:text-white cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            } ${isLiking ? "opacity-50" : ""}`}
            title={isAuthenticated ? "Dislike this review" : "Login to dislike"}
          >
            <FiThumbsDown size={16} />
            <span>{dislikes}</span>
          </button>
        </div>

        {/* Delete Button (only for own reviews) */}
        {isOwnReview && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-red-500 hover:border-black hover:text-white transition-all text-sm font-semibold"
          >
            <FiTrash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
