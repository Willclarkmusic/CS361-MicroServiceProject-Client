import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";
import { FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--header-bg)] border-t-2 border-[var(--border-color)] mt-auto py-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & About Section */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <img
                src="/controller.png"
                alt="Game Review Logo"
                className="h-24 w-24 object-contain"
              />
              <span className="font-bold text-lg text-[var(--text-primary)]">
                THE GAME
                <br />
                REVIEW
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-left">
              Your ultimate destination for game reviews, ratings, and community
              discussions.
            </p>
          </div>

          {/* Site Links */}
          <div className="text-center">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm uppercase">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/?category=trending" className="footer-link">
                  Trending Games
                </Link>
              </li>
              <li>
                <Link to="/?category=top-rated" className="footer-link">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/?category=new-releases" className="footer-link">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div className="text-center">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm uppercase">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          {/* Social & Connect */}
          <div className="my-6 mx-auto w-full md:w-auto md:mx-0 col-span-2 md:col-span-3 flex flex-col items-center">
            <div className="flex gap-3 ">
              <a
                href="https://github.com/WillClarkmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
                aria-label="GitHub"
              >
                <FiGithub size={20} className="text-[var(--text-primary)]" />
              </a>
              <a
                href="https://x.com/theendpoint_xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
                aria-label="Twitter"
              >
                <FiTwitter size={20} className="text-[var(--text-primary)]" />
              </a>
              <a
                href="https://www.linkedin.com/in/will-clark-bab69b48/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} className="text-[var(--text-primary)]" />
              </a>
              <a
                href="mailto:clarkw3@oregonstate.edu"
                className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
                aria-label="Email"
              >
                <FiMail size={20} className="text-[var(--text-primary)]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[var(--text-secondary)] text-center md:text-left">
            <FaRegCopyright className="inline mr-1" />
            {currentYear} The Game Review. All rights reserved.
          </div>

          <div className="text-sm text-[var(--text-secondary)] text-center md:text-right">
            Created by{" "}
            <a
              href="https://WillClark.guru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] font-bold hover:underline"
            >
              Will Clark
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
