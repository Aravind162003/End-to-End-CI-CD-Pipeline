import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, User, UserCheck, Play } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    const formData = { username, email, password, role };
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === 'user') {
        navigate("/userHome");
      } else if (user.role === 'admin') {
        navigate("/adminHome");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
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

          .register-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            background: url('https://images.unsplash.com/photo-1489599849927-2ee91cede3f5?q=80&w=2070&auto=format&fit=crop') no-repeat center center/cover;
          }

          .register-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(11, 19, 43, 0.7);
            z-index: 1;
          }

          .header-logo {
            position: fixed;
            top: 1rem;
            left: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            z-index: 10;
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

          .register-container {
            width: 100%;
            max-width: 400px;
            background: #ffffff;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 2;
            animation: fadeIn 0.5s ease-out;
          }

          .register-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #0b132b;
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .register-subtitle {
            font-size: 0.9rem;
            color: #4a5568;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .message {
            background: rgba(255, 99, 71, 0.1);
            border: 1px solid #ff6347;
            color: #ff6347;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            text-align: center;
            animation: slideIn 0.3s ease-out;
          }

          .message.success {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid #ffd700;
            color: #ffd700;
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .form-group {
            margin-bottom: 1rem;
            position: relative;
          }

          .input-field, .select-field {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #0b132b;
            outline: none;
            transition: all 0.2s ease;
          }

          .input-field::placeholder {
            color: #a8a8a8;
          }

          .input-field:focus, .select-field:focus {
            border-color: #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.2);
          }

          .select-field option {
            background: #ffffff;
            color: #0b132b;
          }

          .input-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #4a5568;
            transition: color 0.2s ease;
          }

          .form-group:focus-within .input-icon {
            color: #ffd700;
          }

          .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #4a5568;
            transition: color 0.2s ease;
          }

          .password-toggle:hover {
            color: #0b132b;
          }

          .register-button {
            width: 100%;
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

          .register-button:hover:not(:disabled) {
            background: #e8c200;
            transform: translateY(-2px);
          }

          .register-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(11, 19, 43, 0.3);
            border-top: 2px solid #0b132b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .register-link {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: #e8e8e8;
          }

          .register-link a {
            color: #ffd700;
            text-decoration: none;
            font-weight: 600;
            margin-left: 4px;
            transition: color 0.2s ease;
          }

          .register-link a:hover {
            color: #e8c200;
          }

          @media (max-width: 640px) {
            .register-container {
              padding: 1.5rem;
              margin: 1rem;
            }

            .register-title {
              font-size: 1.5rem;
            }

            .register-subtitle {
              font-size: 0.85rem;
            }

            .header-logo {
              top: 0.5rem;
              left: 0.5rem;
            }

            .input-field, .select-field {
              padding: 8px 12px;
              font-size: 0.85rem;
            }

            .register-button {
              padding: 10px;
              font-size: 0.85rem;
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

          .register-button:focus-visible,
          .register-link a:focus-visible {
            outline: 2px solid #ffd700;
            outline-offset: 2px;
            border-radius: 4px;
          }
        `}
      </style>

      <a href="/" className="header-logo">
        <div className="logo-icon">
          <Play size={20} color="#0b132b" />
        </div>
        <span className="logo-text">MovieMania</span>
      </a>

      <div className="register-container">
        <h1 className="register-title">Create Your Account</h1>
        <p className="register-subtitle">
          Join MovieMania to start booking your favorite movies.
        </p>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : ''}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* <User className="input-icon" size={18} /> */}
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            {/* <Mail className="input-icon" size={18} /> */}
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            {/* <Lock className="input-icon" size={18} /> */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-group">
            {/* <UserCheck className="input-icon" size={18} /> */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select-field"
              required
              disabled={isLoading}
            >
              <option value="" disabled>Select Role</option>
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="register-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;