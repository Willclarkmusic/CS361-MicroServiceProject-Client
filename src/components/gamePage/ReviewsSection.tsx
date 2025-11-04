import { useState, useEffect } from "react";
import type { Review } from "../../types/Review";
import ReviewCard from "./ReviewCard";
import WriteReviewModal from "./WriteReviewModal";
import LoginRequiredModal from "./LoginRequiredModal";
import { useAuth } from "../../context/AuthContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ReviewsSectionProps {
  reviews: Review[];
  gameName: string;
}

const REVIEWS_PER_PAGE = 5;

const ReviewsSection = ({ reviews, gameName }: ReviewsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>(reviews);
  const { isAuthenticated, user } = useAuth();

  // Update displayed reviews when reviews prop changes
  useEffect(() => {
    setDisplayedReviews(reviews);
  }, [reviews]);

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
      setEditingReview(null);
      setIsModalOpen(true);
    } else {
      setIsLoginRequiredOpen(true);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (reviewId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review? This action is permanent and cannot be undone."
    );

    if (confirmDelete) {
      // Remove the review from displayed reviews (persists until page refresh)
      setDisplayedReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  const handleReviewSubmit = (
    rating: number,
    title: string,
    content: string
  ) => {
    if (editingReview) {
      // Update existing review
      setDisplayedReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id ? { ...r, rating, title, content } : r
        )
      );
    } else {
      // Add new review (for demo purposes)
      console.log("New review:", { rating, title, content });
    }
    setEditingReview(null);
  };

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
                key={review.id}
                review={review}
                isOwnReview={user?.id === review.userId}
                onEdit={() => handleEditClick(review)}
                onDelete={() => handleDeleteClick(review.id)}
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingReview(null);
        }}
        gameName={gameName}
        onSubmit={handleReviewSubmit}
        editingReview={editingReview}
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
