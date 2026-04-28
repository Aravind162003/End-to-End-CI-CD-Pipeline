import React, { useState, useEffect } from 'react';
import { Play, Menu, X, User, Trash, Ticket } from 'lucide-react';

const AdminHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    director: '',
    description: '',
    ticketPrice: '',
    poster: null,
    trailer: null,
  });
  const [bookings, setBookings] = useState([]);
  const [bookingsError, setBookingsError] = useState('');
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.id || userData.role !== 'admin') {
      setError("Unauthorized access: Admin privileges required");
      setBookingsLoading(false);
      return;
    }
    setUser(userData);
    fetchBookings(userData.role);
  }, []);

  const fetchBookings = async (role) => {
    try {
      setBookingsLoading(true);
      const response = await fetch('http://localhost:5000/api/bookings/all', {
        headers: { 'x-user-role': role, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setBookings(data.data || []);
      setBookingsError('');
    } catch (err) {
      setBookingsError('Failed to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('director', formData.director);
    data.append('description', formData.description);
    data.append('ticketPrice', formData.ticketPrice);
    if (formData.poster) data.append('poster', formData.poster);
    if (formData.trailer) data.append('trailer', formData.trailer);
    try {
      const token = localStorage.getItem("token");
      await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      setSuccess('Movie added successfully!');
      setFormData({ name: '', director: '', description: '', ticketPrice: '', poster: null, trailer: null });
    } catch (err) {
      setError('Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setBookingsError('');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'x-user-role': user.role, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });
      const data = await response.json();
      setBookings(bookings.map((booking) => 
        booking._id === bookingId ? data.data : booking
      ));
    } catch (err) {
      setBookingsError('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      setBookingsError('');
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'x-user-role': user.role, 'Content-Type': 'application/json' },
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      setBookingsError('Failed to delete booking');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-page">
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

          .admin-page {
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

          .admin-section {
            padding: 6rem 2rem 4rem;
            max-width: 1440px;
            margin: 0 auto;
          }

          .admin-header {
            text-align: center;
            margin-bottom: 4rem;
          }

          .admin-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 0.75rem;
            letter-spacing: 1px;
          }

          @media (min-width: 768px) {
            .admin-title {
              font-size: 3.5rem;
            }
          }

          .admin-subtitle {
            font-size: 1.1rem;
            color: #a8a8a8;
            max-width: 600px;
            margin: 0 auto;
          }

          .error, .success {
            padding: 12px 16px;
            border-radius: 6px;
            margin: 0 auto 2rem;
            font-size: 0.9rem;
            text-align: center;
            max-width: 600px;
          }

          .error {
            background: rgba(255, 99, 71, 0.1);
            border: 1px solid #ff6347;
            color: #ff6347;
          }

          .success {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid #ffd700;
            color: #ffd700;
          }

          .profile-card {
            background: #1c2541;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            gap: 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 0.5rem;
          }

          .profile-email {
            font-size: 1rem;
            color: #a8a8a8;
          }

          .logout-btn {
            padding: 0.75rem 1.5rem;
            background: #ff6347;
            border: none;
            border-radius: 6px;
            color: #ffffff;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .logout-btn:hover {
            background: #e5533d;
            transform: translateY(-2px);
          }

          .section-container {
            background: #1c2541;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 1.5rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
          }

          .form-label {
            font-size: 0.9rem;
            font-weight: 600;
            color: #ffd700;
            margin-bottom: 0.5rem;
          }

          .form-input {
            padding: 12px 16px;
            background: #0b132b;
            border: 1px solid #3a4660;
            border-radius: 6px;
            color: #e8e8e8;
            font-size: 15px;
            outline: none;
            transition: all 0.2s ease;
          }

          .form-input:focus {
            border-color: #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.2);
          }

          .form-input:hover {
            border-color: #ffd700;
          }

          .form-textarea {
            min-height: 100px;
            resize: vertical;
          }

          .form-input[type="file"] {
            padding: 12px 16px;
            background: #0b132b;
            border: 1px dashed #ffd700;
            color: #e8e8e8;
            border-radius: 6px;
          }

          .form-input[type="file"]::-webkit-file-upload-button {
            background: #ffd700;
            color: #0b132b;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-weight: 600;
            cursor: pointer;
            margin-right: 1rem;
            transition: all 0.2s ease;
          }

          .form-input[type="file"]::-webkit-file-upload-button:hover {
            background: #e8c200;
          }

          .form-input[type="file"]:focus {
            border-color: #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.2);
          }

          .form-submit {
            width: 100%;
            padding: 12px 24px;
            background: #ffd700;
            color: #0b132b;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .form-submit:hover:not(:disabled) {
            background: #e8c200;
            transform: translateY(-2px);
          }

          .form-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .bookings-section {
            margin-top: 4rem;
          }

          .bookings-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 1.5rem;
          }

          .bookings-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #1c2541;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .bookings-table th,
          .bookings-table td {
            padding: 1rem;
            text-align: left;
            font-size: 0.875rem;
            color: #e8e8e8;
          }

          .bookings-table th {
            background: #0b132b;
            font-weight: 600;
            color: #ffd700;
            border-bottom: 1px solid #3a4660;
          }

          .bookings-table tr:hover {
            background: rgba(255, 215, 0, 0.05);
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
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid #22c55e;
          }

          .booking-status.cancelled {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid #ef4444;
          }

          .booking-status.pending {
            background: rgba(255, 215, 0, 0.2);
            color: #ffd700;
            border: 1px solid #ffd700;
          }

          .status-select {
            padding: 0.5rem;
            background: #0b132b;
            border: 1px solid #3a4660;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #e8e8e8;
            cursor: pointer;
          }

          .status-select:focus {
            border-color: #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.2);
            outline: none;
          }

          .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #ef4444;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            transform: scale(1.1);
          }

          @media (max-width: 768px) {
            .admin-title {
              font-size: 2rem;
            }

            .admin-subtitle {
              font-size: 0.9rem;
            }

            .profile-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .admin-section {
              padding: 6rem 1rem 4rem;
            }

            .bookings-table {
              display: block;
              overflow-x: auto;
            }

            .bookings-table th,
            .bookings-table td {
              min-width: 120px;
            }

            .nav-container {
              padding: 0 1rem;
            }
          }

          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
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

          .form-submit:focus-visible,
          .logout-btn:focus-visible,
          .nav-link:focus-visible,
          .mobile-nav-link:focus-visible,
          .delete-btn:focus-visible {
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
            <a href="/adminHome" className="nav-link">Admin Dashboard</a>
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
            <a href="/adminHome" className="mobile-nav-link" onClick={toggleMenu}>Admin Dashboard</a>
          </nav>
        </div>
      </header>

      <section className="admin-section">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage movies and bookings on the MovieMania platform.
          </p>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {user ? (
          <>
            <div className="profile-card">
              <div className="profile-icon">
                <User size={32} />
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user.username || user.email.split('@')[0]}</h2>
                <p className="profile-email">{user.email} (Admin)</p>
              </div>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="section-container">
              <h2 className="section-title">Add New Movie</h2>
              <div onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Movie Title</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter movie title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Director</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter director name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Poster</label>
                  <input
                    type="file"
                    name="poster"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Trailer (Optional)</label>
                  <input
                    type="file"
                    name="trailer"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input form-textarea"
                    placeholder="Enter movie description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ticket Price</label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter ticket price"
                    step="0.01"
                    required
                  />
                </div>
                <button type="button" onClick={handleSubmit} className="form-submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Movie'}
                </button>
              </div>
            </div>

            <div className="section-container bookings-section">
              <h2 className="bookings-title">Manage Bookings</h2>
              {bookingsError && <p className="error">{bookingsError}</p>}
              {bookingsLoading ? (
                <p style={{ textAlign: 'center', color: '#e8e8e8' }}>Loading bookings...</p>
              ) : bookings.length > 0 ? (
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Movie</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Theater</th>
                      <th>Tickets</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.bookingReference}</td>
                        <td>{booking.movieId?.name || 'Unknown'}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.email}</td>
                        <td>{formatDate(booking.showDate)}</td>
                        <td>{booking.showTime}</td>
                        <td>{booking.theater}</td>
                        <td>{booking.numberOfTickets}</td>
                        <td>${booking.totalPrice.toFixed(2)}</td>
                        <td>
                          <select
                            className="status-select"
                            value={booking.bookingStatus}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteBooking(booking._id)}
                            aria-label="Delete booking"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', color: '#e8e8e8' }}>No bookings found.</p>
              )}
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#e8e8e8' }}>Loading admin dashboard...</p>
        )}
      </section>
    </div>
  );
};

export default AdminHome;