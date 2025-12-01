import { useState, useEffect, useCallback } from "react";
import type { Review, ReviewAPI } from "../../types/Review";
import ReviewCard from "./ReviewCard";
import WriteReviewModal from "./WriteReviewModal";
import LoginRequiredModal from "./LoginRequiredModal";
import { useAuth } from "../../context/AuthContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import * as reviewService from "../../services/reviewService";
import { getUser } from "../../services/userService";

interface ReviewsSectionProps {
  gameId: string;
  gameName: string;
}

const REVIEWS_PER_PAGE = 5;

const ReviewsSection = ({ gameId, gameName }: ReviewsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch reviews and enrich with user info
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const apiReviews = await reviewService.getReviewsByGame(gameId);

      // Enrich reviews with user info
      const enrichedReviews: Review[] = await Promise.all(
        apiReviews.map(async (apiReview: ReviewAPI, index: number) => {
          let username = `User #${apiReview.userId}`;
          let userAvatar =
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";

          try {
            const userInfo = await getUser(apiReview.userId);
            username = userInfo.username;
            userAvatar = userInfo.avatarURL || userAvatar;
          } catch (err) {
            console.error(
              `Failed to fetch user info for user ${apiReview.userId}:`,
              err
            );
          }

          return {
            // Use reviewId if available, otherwise generate a unique key
            reviewId: apiReview.reviewId ?? (apiReview.userId * 1000000 + apiReview.gameId * 1000 + index),
            gameId: apiReview.gameId,
            userId: apiReview.userId,
            username,
            userAvatar,
            rating: apiReview.reviewScore,
            content: apiReview.review,
          };
        })
      );

      setDisplayedReviews(enrichedReviews);
      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
      setDisplayedReviews([]);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Calculate pagination
  const totalPages = Math.ceil(displayedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = displayedReviews.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleWriteReviewClick = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      setIsLoginRequiredOpen(true);
    }
  };

  const handleDeleteClick = async (reviewId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review? This action is permanent and cannot be undone."
    );

    if (confirmDelete) {
      try {
        await reviewService.deleteReview(reviewId);
        // Refresh reviews after deletion
        await fetchReviews();
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!user) return;

    try {
      await reviewService.createReview({
        userId: user.userId,
        gameId: parseInt(gameId, 10),
        reviewScore: rating,
        review: content,
      });

      // Refresh reviews after creation
      await fetchReviews();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating review:", err);
      alert("Failed to create review. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          User Reviews
        </h2>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading reviews...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          User Reviews
        </h2>
        <div className="text-center py-12 neo-card">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchReviews}
            className="px-6 py-3 bg-[var(--accent-primary)] text-black border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      {/* Section Header with Write Review Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            User Reviews
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 ml-4 text-left">
            {displayedReviews.length}{" "}
            {displayedReviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        <button
          onClick={handleWriteReviewClick}
          className="px-6 py-3 bg-[var(--accent-primary)] text-black border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      {displayedReviews.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {currentReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                isOwnReview={user?.userId === review.userId}
                onDelete={() => handleDeleteClick(review.reviewId)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <FiChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    // Show ellipsis
                    const showEllipsisBefore =
                      page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter =
                      page === currentPage + 2 && currentPage < totalPages - 2;

                    if (
                      !showPage &&
                      !showEllipsisBefore &&
                      !showEllipsisAfter
                    ) {
                      return null;
                    }

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="px-4 py-2 text-[var(--text-primary)]"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 border-2 font-semibold transition-all ${
                          currentPage === page
                            ? "bg-[var(--accent-primary)] text-black border-black"
                            : "bg-[var(--button-bg)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:text-black hover:border-black"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 neo-card">
          <p className="text-lg text-[var(--text-secondary)] mb-4">
            No reviews yet. Be the first to review this game!
          </p>
          <button
            onClick={handleWriteReviewClick}
            className="px-6 py-3 bg-[var(--accent-primary)] text-black border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            Write the First Review
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameName={gameName}
        onSubmit={handleReviewSubmit}
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
      />
    </section>
  );
};

export default ReviewsSection;
