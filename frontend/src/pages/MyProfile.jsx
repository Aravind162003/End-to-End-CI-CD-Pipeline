import React, { useState, useEffect } from 'react';
import { Menu, X, User, Play, Ticket } from 'lucide-react';
import axios from 'axios';

const MyProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingsError, setBookingsError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user from localStorage
        const userDataString = localStorage.getItem("user");
        if (!userDataString) {
          setError("No user data found, please login again");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userDataString);
        console.log("User data from localStorage:", userData); // Debug log
        if (!userData || !userData.email) {
          setError("User email not found, please login again");
          setLoading(false);
          return;
        }

        setUser(userData);

        // Fetch bookings by email
        console.log("Fetching bookings for email:", userData.email); // Debug log
        const bookingsResponse = await axios.get('http://localhost:5000/api/bookings', {
          params: { email: userData.email },
          headers: { 'Content-Type': 'application/json' }
        });

        console.log("Bookings response:", bookingsResponse.data); // Debug log
        setBookings(bookingsResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to load profile data');
        setBookingsError(error.response?.data?.message || 'Failed to load bookings');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="profile-page">
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

          .profile-page {
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            background: url('https://images.unsplash.com/photo-1536440136628-849c177e76ff?q=80&w=2070&auto=format&fit=crop') no-repeat center center/cover;
          }

          .profile-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(11, 19, 43, 0.7);
            z-index: 1;
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

          .profile-section {
            padding: 6rem 2rem 4rem;
            max-width: 1440px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
          }

          .profile-header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .profile-title {
            font-size: 2rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 0.5rem;
          }

          .profile-subtitle {
            font-size: 1rem;
            color: #a8a8a8;
            max-width: 600px;
            margin: 0 auto;
          }

          .error {
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 2rem;
            font-size: 0.9rem;
            text-align: center;
            background: rgba(255, 99, 71, 0.1);
            border: 1px solid #ff6347;
            color: #ff6347;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .profile-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.5s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .profile-icon {
            background: #ffd700;
            padding: 1rem;
            border-radius: 50%;
            color: #0b132b;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          }

          .profile-info {
            flex: 1;
          }

          .profile-name {
            font-size: 1.5rem;
            font-weight: 600;
            color: #0b132b;
            margin-bottom: 0.5rem;
          }

          .profile-email {
            font-size: 0.9rem;
            color: #4a5568;
          }

          .bookings-section {
            margin-top: 3rem;
          }

          .bookings-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffd700;
            margin-bottom: 1.5rem;
          }

          .booking-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .booking-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
          }

          .booking-card:hover {
            transform: translateY(-4px);
          }

          .booking-icon {
            background: #1c2541;
            padding: 0.75rem;
            border-radius: 50%;
            color: #ffd700;
            margin-bottom: 1rem;
          }

          .booking-info {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .booking-field {
            font-size: 0.85rem;
            color: #4a5568;
            font-weight: 500;
          }

          .booking-value {
            font-size: 0.85rem;
            font-weight: 600;
            color: #0b132b;
          }

          .booking-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
          }

          .booking-status.confirmed {
            background: rgba(255, 215, 0, 0.1);
            color: #ffd700;
            border: 1px solid #ffd700;
          }

          .booking-status.cancelled {
            background: rgba(255, 99, 71, 0.1);
            color: #ff6347;
            border: 1px solid #ff6347;
          }

          .booking-status.pending {
            background: rgba(160, 174, 192, 0.1);
            color: #a0aec0;
            border: 1px solid #a0aec0;
          }

          @media (max-width: 768px) {
            .profile-section {
              padding: 5rem 1rem 3rem;
            }

            .profile-title {
              font-size: 1.5rem;
            }

            .profile-subtitle {
              font-size: 0.9rem;
            }

            .profile-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .booking-grid {
              grid-template-columns: 1fr;
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

          .nav-link:focus-visible,
          .mobile-nav-link:focus-visible {
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

      <section className="profile-section">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">
            View your personal details and booking history.
          </p>
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="text-center text-[#e8e8e8]">Loading profile...</p>
        ) : user ? (
          <>
            <div className="profile-card">
              <div className="profile-icon">
                <User size={32} />
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user.username || user.email.split('@')[0]}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>

            <div className="bookings-section">
              <h2 className="bookings-title">Your Bookings</h2>
              {bookingsError && <p className="error">{bookingsError}</p>}
              {bookings.length > 0 ? (
                <div className="booking-grid">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-icon">
                        <Ticket size={24} />
                      </div>
                      <div className="booking-info">
                        <div>
                          <span className="booking-field">Movie: </span>
                          <span className="booking-value">{booking.movieId?.name || 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="booking-field">Booking Reference: </span>
                          <span className="booking-value">{booking.bookingReference}</span>
                        </div>
                        <div>
                          <span className="booking-field">Show Date: </span>
                          <span className="booking-value">{formatDate(booking.showDate)}</span>
                        </div>
                        <div>
                          <span className="booking-field">Show Time: </span>
                          <span className="booking-value">{booking.showTime}</span>
                        </div>
                        <div>
                          <span className="booking-field">Theater: </span>
                          <span className="booking-value">{booking.theater}</span>
                        </div>
                        <div>
                          <span className="booking-field">Tickets: </span>
                          <span className="booking-value">{booking.numberOfTickets}</span>
                        </div>
                        <div>
                          <span className="booking-field">Total Price: </span>
                          <span className="booking-value">${booking.totalPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="booking-field">Status: </span>
                          <span className={`booking-status ${booking.bookingStatus}`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#e8e8e8]">No bookings found.</p>
              )}
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
};

export default MyProfile;