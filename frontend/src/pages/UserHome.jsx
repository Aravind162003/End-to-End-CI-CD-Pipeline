import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Play, ArrowRight, Sparkles, Zap, Heart, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const UserHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    numberOfTickets: 1,
    showDate: '',
    showTime: '',
    theater: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/movies', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setMovies(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies');
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openBookingModal = (movie) => {
    setSelectedMovie(movie);
    setIsBookingModalOpen(true);
    setBookingForm({
      customerName: '',
      email: '',
      phone: '',
      numberOfTickets: 1,
      showDate: '',
      showTime: '',
      theater: '',
    });
    setBookingError('');
    setBookingSuccess('');
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedMovie(null);
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    // Validate inputs
    if (
      !bookingForm.customerName ||
      !bookingForm.email ||
      !bookingForm.phone ||
      bookingForm.numberOfTickets < 1 ||
      bookingForm.numberOfTickets > 10 ||
      !bookingForm.showDate ||
      !bookingForm.showTime ||
      !bookingForm.theater
    ) {
      setBookingError('Please fill in all fields correctly. Tickets must be between 1 and 10.');
      return;
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(bookingForm.email)) {
      setBookingError('Please enter a valid email address.');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          movieId: selectedMovie._id,
          customerName: bookingForm.customerName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          numberOfTickets: parseInt(bookingForm.numberOfTickets),
          showDate: bookingForm.showDate,
          showTime: bookingForm.showTime,
          theater: bookingForm.theater,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
        }
      );
      setBookingSuccess(
        `Successfully booked ${bookingForm.numberOfTickets} ticket(s) for "${selectedMovie.name}"! Booking Reference: ${response.data.data.bookingReference}`
      );
      setTimeout(() => {
        closeBookingModal();
      }, 2000);
    } catch (error) {
      console.error('Error booking ticket:', error);
      setBookingError(error.response?.data?.message || 'Failed to book ticket. Please try again.');
    }
  };

  return (
    <div className="user-home-page">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
          }

          body {
            font-family: 'Inter', sans-serif;
            background: #0b132b;
            color: #e8e8e8;
            line-height: 1.6;
          }

          .user-home-page {
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            background: #0b132b;
          }

          .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 1rem 0;
            background: transparent;
            transition: all 0.3s ease;
          }

          .header.scrolled {
            background: rgba(11, 19, 43, 0.95);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid #ffd700;
          }

          .nav-container {
            max-width: 1440px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
          }

          .logo-icon {
            background: #ffd700;
            padding: 0.5rem;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          }

          .logo-text {
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffd700;
            letter-spacing: 1px;
          }

          .nav-links {
            display: none;
            gap: 1.5rem;
          }

          @media (min-width: 768px) {
            .nav-links {
              display: flex;
            }
          }

          .nav-link {
            padding: 0.5rem 1rem;
            color: #e8e8e8;
            font-weight: 500;
            font-size: 0.9rem;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .nav-link:hover {
            background: rgba(255, 215, 0, 0.1);
            color: #ffd700;
            transform: translateY(-1px);
          }

          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            background: #1c2541;
            border: 1px solid #ffd700;
            border-radius: 6px;
            color: #ffd700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .mobile-menu-btn:hover {
            background: #ffd700;
            color: #0b132b;
          }

          @media (min-width: 768px) {
            .mobile-menu-btn {
              display: none;
            }
          }

          .mobile-menu {
            position: fixed;
            top: 0;
            right: 0;
            width: 250px;
            height: 100%;
            background: #1c2541;
            padding: 2rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 999;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.4);
          }

          .mobile-menu.open {
            transform: translateX(0);
          }

          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
          }

          .mobile-nav-link {
            padding: 0.75rem;
            color: #e8e8e8;
            font-weight: 500;
            text-align: left;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .mobile-nav-link:hover {
            background: rgba(255, 215, 0, 0.1);
            color: #ffd700;
          }

          .hero {
            position: relative;
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            overflow: hidden;
          }

          .hero-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
            z-index: -1;
          }

          .hero-content {
            text-align: center;
            max-width: 800px;
            color: #ffffff;
          }

          .hero-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 1rem;
            letter-spacing: 1px;
            animation: fadeIn 1s ease forwards;
          }

          @media (min-width: 768px) {
            .hero-title {
              font-size: 3.5rem;
            }
          }

          .hero-subtitle {
            font-size: 1.1rem;
            color: #e8e8e8;
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeIn 1s ease 0.3s forwards;
          }

          .hero-search {
            max-width: 500px;
            margin: 0 auto;
            position: relative;
            opacity: 0;
            animation: fadeIn 1s ease 0.6s forwards;
          }

          .hero-search-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid #ffd700;
            border-radius: 6px;
            color: #e8e8e8;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s ease;
          }

          .hero-search-input::placeholder {
            color: #a8a8a8;
          }

          .hero-search-input:focus {
            border-color: #ffffff;
            box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
          }

          .hero-search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #ffd700;
          }

          .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            opacity: 0;
            animation: fadeIn 1s ease 0.9s forwards;
          }

          .hero-btn {
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .hero-btn-primary {
            background: #ffd700;
            color: #0b132b;
          }

          .hero-btn-primary:hover {
            background: #e8c200;
            transform: translateY(-2px);
          }

          .movies-section {
            padding: 4rem 2rem;
            background: #1c2541;
          }

          .movies-container {
            max-width: 1440px;
            margin: 0 auto;
          }

          .section-header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 0.5rem;
          }

          .section-subtitle {
            font-size: 1rem;
            color: #a8a8a8;
            max-width: 600px;
            margin: 0 auto;
          }

          .form-error, .form-success {
            padding: 12px 16px;
            border-radius: 6px;
            margin: 0 auto 2rem;
            font-size: 0.9rem;
            text-align: center;
            max-width: 600px;
          }

          .form-error {
            background: rgba(255, 99, 71, 0.1);
            border: 1px solid #ff6347;
            color: #ff6347;
          }

          .form-success {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid #ffd700;
            color: #ffd700;
          }

          .movie-carousel {
            position: relative;
            overflow: hidden;
            padding: 0 2rem;
          }

          .movie-grid {
            display: flex;
            gap: 1.5rem;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 1rem;
            scroll-behavior: smooth;
          }

          .movie-grid::-webkit-scrollbar {
            height: 8px;
          }

          .movie-grid::-webkit-scrollbar-track {
            background: #0b132b;
          }

          .movie-grid::-webkit-scrollbar-thumb {
            background: #ffd700;
            border-radius: 4px;
          }

          .movie-card {
            flex: 0 0 280px;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
            scroll-snap-align: start;
          }

          .movie-card:hover {
            transform: translateY(-8px);
          }

          .movie-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .movie-content {
            padding: 1rem;
          }

          .movie-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #0b132b;
            margin-bottom: 0.5rem;
          }

          .movie-director, .movie-desc {
            font-size: 0.85rem;
            color: #4a5568;
            margin-bottom: 0.5rem;
          }

          .movie-desc {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .movie-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
          }

          .book-price {
            font-size: 1rem;
            font-weight: 600;
            color: #0b132b;
          }

          .price-amount {
            color: #ffd700;
          }

          .book-actions {
            display: flex;
            gap: 0.5rem;
          }

          .action-btn {
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .action-btn.book-now {
            background: #ffd700;
            color: #0b132b;
            border: none;
          }

          .action-btn.book-now:hover:not(:disabled) {
            background: #e8c200;
          }

          .action-btn.trailer {
            background: #1c2541;
            color: #e8e8e8;
            border: 1px solid #ffd700;
          }

          .action-btn.trailer:hover:not(:disabled) {
            background: #ffd700;
            color: #0b132b;
          }

          .action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .book-image-placeholder {
            width: 100%;
            height: 200px;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .book-image-placeholder::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .book-icon {
            color: #4a5568;
            opacity: 0.7;
          }

          .book-title-placeholder {
            height: 1.2rem;
            background: #e2e8f0;
            border-radius: 4px;
            margin-bottom: 0.5rem;
            animation: pulse 1.5s infinite ease-in-out;
          }

          .book-author-placeholder {
            height: 0.8rem;
            width: 60%;
            background: #e2e8f0;
            border-radius: 4px;
            animation: pulse 1.5s infinite ease-in-out 0.2s;
          }

          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .booking-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .booking-modal.open {
            opacity: 1;
            visibility: visible;
          }

          .booking-modal-content {
            background: #ffffff;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
          }

          .booking-modal.open .booking-modal-content {
            transform: scale(1);
          }

          .booking-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #4a5568;
            transition: color 0.2s ease;
          }

          .booking-modal-close:hover {
            color: #0b132b;
          }

          .booking-modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0b132b;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .booking-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .booking-form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .booking-form-label {
            font-size: 0.9rem;
            font-weight: 600;
            color: #0b132b;
          }

          .booking-form-input, .booking-form-select {
            padding: 10px 14px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.2s ease;
          }

          .booking-form-input:focus, .booking-form-select:focus {
            border-color: #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.2);
          }

          .booking-form-select option {
            background: #ffffff;
            color: #0b132b;
          }

          .booking-form-submit {
            padding: 12px;
            background: #ffd700;
            color: #0b132b;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .booking-form-submit:hover {
            background: #e8c200;
            transform: translateY(-2px);
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2rem;
            }
            .hero-subtitle {
              font-size: 0.9rem;
            }
            .section-title {
              font-size: 1.5rem;
            }
            .movie-grid {
              flex-direction: column;
            }
            .movie-card {
              flex: 0 0 100%;
              max-width: 300px;
              margin: 0 auto;
            }
            .hero {
              padding: 4rem 1rem;
            }
            .movies-section {
              padding: 3rem 1rem;
            }
            .booking-modal-content {
              padding: 1.5rem;
              width: 95%;
            }
            .nav-container {
              padding: 0 1rem;
            }
          }

          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #0b132b;
          }

          ::-webkit-scrollbar-thumb {
            background: #ffd700;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #e8c200;
          }

          .hero-btn:focus-visible,
          .nav-link:focus-visible,
          .mobile-nav-link:focus-visible,
          .action-btn:focus-visible,
          .booking-form-submit:focus-visible,
          .booking-modal-close:focus-visible {
            outline: 2px solid #ffd700;
            outline-offset: 2px;
            border-radius: 4px;
          }
        `}
      </style>

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo">
            <div className="logo-icon">
              <Play size={20} color="#0b132b" />
            </div>
            <span className="logo-text">MovieMania</span>
          </a>

          <nav className="nav-links">
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="nav-link">Register</a>
            <a href="/my-profile" className="nav-link">My Profile</a>
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-links">
            <a href="/login" className="mobile-nav-link" onClick={toggleMenu}>Login</a>
            <a href="/register" className="mobile-nav-link" onClick={toggleMenu}>Register</a>
            <a href="/my-profile" className="mobile-nav-link" onClick={toggleMenu}>My Profile</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn.pixabay.com/video/2024/07/25/221734_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1 className="hero-title">Discover Epic Cinema</h1>
          <p className="hero-subtitle">
            Explore a world of captivating stories and unforgettable moments.
          </p>
          <div className="hero-search">
            <Search className="hero-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for movies..."
              className="hero-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hero-buttons">
            <a href="/explore" className="hero-btn hero-btn-primary">
              <Zap size={18} /> Start Watching
            </a>
          </div>
        </div>
      </section>

      <section className="movies-section">
        <div className="movies-container">
          <div className="section-header">
            <h2 className="section-title">Now Playing</h2>
            <p className="section-subtitle">
              Browse our selection of the latest blockbuster hits and hidden gems.
            </p>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="movie-carousel">
            <div className="movie-grid">
              {loading ? (
                [...Array(8)].map((_, index) => (
                  <div key={index} className="movie-card">
                    <div className="book-image-placeholder">
                      <Play className="book-icon" size={48} />
                    </div>
                    <div className="movie-content">
                      <div className="book-title-placeholder"></div>
                      <div className="book-author-placeholder"></div>
                    </div>
                  </div>
                ))
              ) : movies.length > 0 ? (
                movies.map((movie) => (
                  <div key={movie._id} className="movie-card">
                    <img
                      src={movie.poster.startsWith("http") ? movie.poster : `http://localhost:5000/${movie.poster}`}
                      alt={movie.name}
                      className="movie-image"
                    />
                    <div className="movie-content">
                      <h3 className="movie-title">{movie.name}</h3>
                      <p className="movie-director">Directed by {movie.director}</p>
                      <p className="movie-desc">{movie.description}</p>
                      <div className="movie-footer">
                        <p className="book-price">$<span className="price-amount">{movie.ticketPrice}</span></p>
                        <div className="book-actions">
                          <button
                            className="action-btn book-now"
                            onClick={() => openBookingModal(movie)}
                          >
                            <ShoppingCart size={16} /> Book Now
                          </button>
                          {movie.trailer ? (
                            <a
                              href={movie.trailer.startsWith('http') ? movie.trailer : `http://localhost:5000/${movie.trailer}`}
                              className="action-btn trailer"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Play size={16} /> Trailer
                            </a>
                          ) : (
                            <button className="action-btn trailer" disabled>No Trailer</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[#e8e8e8]">No movies available</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {isBookingModalOpen && (
        <div className="booking-modal open">
          <div className="booking-modal-content">
            <button className="booking-modal-close" onClick={closeBookingModal}>
              <X size={20} />
            </button>
            <h2 className="booking-modal-title">Book Tickets for {selectedMovie?.name}</h2>
            {bookingError && <p className="form-error">{bookingError}</p>}
            {bookingSuccess && <p className="form-success">{bookingSuccess}</p>}
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="customerName">Full Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={bookingForm.customerName}
                  onChange={handleBookingFormChange}
                  className="booking-form-input"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleBookingFormChange}
                  className="booking-form-input"
                  placeholder="Enter your email"
                />
              </div>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleBookingFormChange}
                  className="booking-form-input"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="numberOfTickets">Number of Tickets</label>
                <input
                  type="number"
                  id="numberOfTickets"
                  name="numberOfTickets"
                  value={bookingForm.numberOfTickets}
                  onChange={handleBookingFormChange}
                  className="booking-form-input"
                  min="1"
                  max="10"
                  placeholder="Select number of tickets"
                />
              </div>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="showDate">Show Date</label>
                <input
                  type="date"
                  id="showDate"
                  name="showDate"
                  value={bookingForm.showDate}
                  onChange={handleBookingFormChange}
                  className="booking-form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="showTime">Show Time</label>
                <select
                  id="showTime"
                  name="showTime"
                  value={bookingForm.showTime}
                  onChange={handleBookingFormChange}
                  className="booking-form-select"
                >
                  <option value="" disabled>Select show time</option>
                  {["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"].map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="theater">Theater</label>
                <input
                  type="text"
                  id="theater"
                  name="theater"
                  value={bookingForm.theater}
                  onChange={handleBookingFormChange}
                  className="booking-form-input"
                  placeholder="Enter theater name"
                />
              </div>
              <button type="submit" className="booking-form-submit">
                <ShoppingCart size={16} /> Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;