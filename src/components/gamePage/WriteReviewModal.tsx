import { useState, FormEvent, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import type { Review } from '../../types/Review';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  onSubmit?: (rating: number, title: string, content: string) => void;
  editingReview?: Review | null;
}

const WriteReviewModal = ({
  isOpen,
  onClose,
  gameName,
  onSubmit,
  editingReview = null,
}: WriteReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Pre-fill form when editing
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setTitle(editingReview.title);
      setContent(editingReview.content);
    } else {
      setRating(5);
      setTitle('');
      setContent('');
    }
    setErrors({});
  }, [editingReview, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (rating < 1 || rating > 10) {
      newErrors.rating = 'Please select a rating between 1 and 10';
    }
    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (content.trim().length < 10) {
      newErrors.content = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Show confirmation dialog
    const confirmMessage = editingReview
      ? "Are you sure you want to update this review?"
      : "Are you sure you want to submit this review?";

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(rating, title.trim(), content.trim());
    }

    // Reset form and close
    setRating(5);
    setTitle('');
    setContent('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setRating(5);
    setTitle('');
    setContent('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[8px_8px_0_0_var(--shadow-color)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[var(--border-color)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {editingReview ? 'Edit Your Review' : `Write a Review for ${gameName}`}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--accent-primary)] transition-colors"
            aria-label="Close"
          >
            <FiX size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
              Your Rating: {rating.toFixed(1)}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full h-2 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-[var(--text-secondary)] mt-2">
              <span>1.0</span>
              <span>5.5</span>
              <span>10.0</span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="review-title"
              className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
            >
              Review Title *
            </label>
            <input
              type="text"
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="w-full"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="review-content"
              className="block text-sm font-bold mb-2 text-[var(--text-primary)]"
            >
              Your Review *
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about the game..."
              className="w-full min-h-[200px] resize-y"
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-2">
              <div>
                {errors.content && (
                  <p className="text-red-500 text-sm">{errors.content}</p>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {content.length}/2000
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--accent-primary)] text-black py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
            >
              {editingReview ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-[var(--button-bg)] text-[var(--text-primary)] py-3 border-2 border-[var(--border-color)] font-bold hover:bg-[var(--bg-secondary)] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
