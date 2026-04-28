import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Play } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <style>{`
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-default {
          background: linear-gradient(135deg, #1a1a3e, #4c1d95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .header-scrolled {
          background: linear-gradient(135deg, rgba(26, 26, 62, 0.95), rgba(76, 29, 149, 0.95));
          backdrop-filter: blur(20px);
          padding: 0.75rem 1rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 5rem;
        }

        @media (min-width: 1024px) {
          .nav-content {
            padding: 1rem 2rem;
            height: 4.5rem;
          }
        }

        .header-scrolled .nav-content {
          height: 4rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .logo-section:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          padding: 0.5rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-icon svg {
          width: 1.75rem;
          height: 1.75rem;
          color: #ffffff;
        }

        .logo-text {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 480px) {
          .logo-text {
            font-size: 1.5rem;
          }
          .logo-icon svg {
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .search-section {
          flex: 1;
          max-width: 500px;
          margin: 0 1.5rem;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
          color: #1f2937;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .search-input::placeholder {
          color: #6b7280;
        }

        .search-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
          transform: translateY(-1px);
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          transition: color 0.3s ease;
        }

        .search-section:focus-within .search-icon {
          color: #8b5cf6;
        }

        .desktop-nav {
          display: none;
          gap: 0.75rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 0.75rem;
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .nav-button:hover {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }

        .nav-button svg {
          width: 1rem;
          height: 1rem;
        }

        .mobile-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .mobile-menu-button {
            display: none;
          }
        }

        .mobile-menu-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, rgba(26, 26, 62, 0.95), rgba(76, 29, 149, 0.95));
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(-20px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 0.75rem;
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-nav-button:hover {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          transform: translateY(-1px);
        }

        .mobile-nav-button svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        @media (max-width: 640px) {
          .search-section {
            display: none;
          }
          .nav-content {
            padding: 0.75rem 1rem;
            height: 4rem;
          }
          .header-scrolled .nav-content {
            height: 3.5rem;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-container {
          animation: fadeInDown 0.5s ease forwards;
        }
      `}</style>

      <header className={`header-container ${isScrolled ? 'header-scrolled' : 'header-default'}`}>
        <nav className="nav-content">
          <Link to="/" className="logo-section">
            <div className="logo-icon">
              <Play />
            </div>
            <h1 className="logo-text">PagePulse</h1>
          </Link>

          <div className="search-section">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search movies, directors, genres..."
                className="search-input"
                aria-label="Search movies"
              />
            </div>
          </div>

          <div className="desktop-nav">
            <Link to="/login" className="nav-button">
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-button">
              <span>Register</span>
            </Link>
            <Link to="/add-movie" className="nav-button">
              <span>Add Movie</span>
            </Link>
          </div>

          <button
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link to="/login" className="mobile-nav-button" onClick={toggleMenu}>
              <span>Login</span>
            </Link>
            <Link to="/register" className="mobile-nav-button" onClick={toggleMenu}>
              <span>Register</span>
            </Link>
            <Link to="/add-movie" className="mobile-nav-button" onClick={toggleMenu}>
              <span>Add Movie</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;