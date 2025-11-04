import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    navigate('/login');
    onClose();
  };

  const handleRegisterClick = () => {
    navigate('/login?mode=register');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[8px_8px_0_0_var(--shadow-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[var(--border-color)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Login Required
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--accent-primary)] transition-colors"
            aria-label="Close"
          >
            <FiX size={24} className="text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            You must be logged in to write a review.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleLoginClick}
              className="w-full bg-[var(--accent-primary)] text-black py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className="w-full bg-[var(--button-bg)] text-[var(--text-primary)] py-3 border-2 border-[var(--border-color)] font-bold hover:bg-[var(--bg-secondary)] transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
