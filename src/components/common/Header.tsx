import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import MenuDropdown from './MenuDropdown';
import { FiSearch, FiSun, FiMoon, FiUser } from 'react-icons/fi';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--header-bg)] border-b-2 border-[var(--border-color)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/controller.png"
              alt="Game Review Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="hidden sm:block font-bold text-lg">THE GAME REVIEW</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                className="w-full px-4 py-2 pl-10 bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                disabled
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            </div>
          </div>

          {/* Menu, Theme Toggle, Auth */}
          <div className="flex items-center gap-4">
            {/* Menu Dropdown */}
            <MenuDropdown />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun size={20} className="text-[var(--text-primary)]" />
              ) : (
                <FiMoon size={20} className="text-[var(--text-primary)]" />
              )}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
                  aria-label="User menu"
                >
                  <FiUser size={20} className="text-[var(--text-primary)]" />
                </button>
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b-2 border-[var(--border-color)]">
                    <p className="font-bold text-[var(--text-primary)]">{user?.username}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--accent-primary)] hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <button className="px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:text-black hover:border-black transition-all font-semibold text-sm">
                    Login
                  </button>
                </Link>
                <Link to="/login?mode=register" className="hidden sm:block">
                  <button className="px-4 py-2 bg-[var(--accent-primary)] text-black border-2 border-black hover:bg-[var(--accent-secondary)] transition-all font-semibold text-sm">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
