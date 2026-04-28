import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Users, Star, ArrowRight, Play, Award } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredStats = [
    { icon: Play, label: 'Now Showing', value: '120+' },
    { icon: Users, label: 'Tickets Sold', value: '1M+' },
    { icon: Star, label: 'Avg Rating', value: '4.8' },
    { icon: Award, label: 'Directors', value: '500+' }
  ];

  const trendingMovies = [
    { title: 'Inception', director: 'Christopher Nolan', rating: 4.9, image: '🎬' },
    { title: 'Parasite', director: 'Bong Joon-ho', rating: 4.8, image: '🏆' },
    { title: 'Interstellar', director: 'Christopher Nolan', rating: 4.7, image: '🌌' },
    { title: 'The Godfather', director: 'Francis Ford Coppola', rating: 4.9, image: '🕴️' }
  ];

  return (
    <>
      <style>{`
        .hero-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #4c1d95 75%, #6b21a8 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .hero-bg-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 50%);
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.4;
        }

        .hero-content {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr 0.8fr;
            padding: 2rem;
          }
        }

        .hero-text {
          text-align: center;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .hero-text {
            text-align: left;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          color: #e0e7ff;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.2s forwards;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 4rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 4.5rem;
          }
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.4s forwards;
        }

        @media (min-width: 1024px) {
          .hero-subtitle {
            margin-left: 0;
            margin-right: 0;
          }
        }

        .hero-search {
          position: relative;
          max-width: 500px;
          margin: 0 auto 2rem auto;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.6s forwards;
        }

        @media (min-width: 1024px) {
          .hero-search {
            margin: 0 0 2rem 0;
          }
        }

        .hero-search-input {
          width: 100%;
          padding: 1rem 1.25rem 1rem 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 1rem;
          color: #1f2937;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .hero-search-input::placeholder {
          color: #6b7280;
        }

        .hero-search-input:focus {
          background: rgba(255, 255, 255, 1);
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .hero-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          transition: color 0.3s ease;
        }

        .hero-search:focus-within .hero-search-icon {
          color: #8b5cf6;
        }

        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          margin-bottom: 3rem;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.8s forwards;
        }

        @media (min-width: 640px) {
          .hero-buttons {
            flex-direction: row;
            justify-content: center;
          }
        }

        @media (min-width: 1024px) {
          .hero-buttons {
            justify-content: flex-start;
          }
        }

        .hero-btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4);
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hero-btn-primary:hover::before {
          opacity: 1;
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 35px -5px rgba(139, 92, 246, 0.5);
        }

        .hero-btn-primary span {
          position: relative;
          z-index: 1;
        }

        .hero-btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease 1s forwards;
        }

        @media (min-width: 640px) {
          .hero-stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .hero-stat {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }

        .hero-stat:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .hero-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border-radius: 0.5rem;
          margin: 0 auto 0.5rem auto;
        }

        .hero-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.25rem;
        }

        .hero-stat-label {
          font-size: 0.875rem;
          color: #cbd5e1;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-movies-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 400px;
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s ease 1.2s forwards;
        }

        .hero-movie-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .hero-movie-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-5px);
        }

        .hero-movie-emoji {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          display: block;
        }

        .hero-movie-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }

        .hero-movie-director {
          font-size: 0.75rem;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
        }

        .hero-movie-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #fbbf24;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .floating-movie {
          position: absolute;
          color: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .floating-movie:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-movie:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-movie:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
      
      <section className="hero-container">
        <div className="hero-bg-pattern"></div>
        <div className="hero-grid"></div>
        
        <div className="floating-elements">
          <Play className="floating-movie" size={24} />
          <Sparkles className="floating-movie" size={20} />
          <Star className="floating-movie" size={18} />
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Discover Your Next Great Read</span>
            </div>
            
            <h1 className="hero-title">
              Unleash the Power of{' '}
              <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Reading
              </span>
            </h1>
            
            <p className="hero-subtitle">
              Join thousands of movie lovers discovering amazing stories, connecting with directors, 
              and building their personal libraries in the ultimate reading community.
            </p>

            <div className="hero-search">
              <Search className="hero-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for movies, directors, or genres..."
                className="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search movies"
              />
            </div>

            <div className="hero-buttons">
              <a href="/explore" className="hero-btn-primary">
                <span>Start Exploring</span>
                <ArrowRight size={20} />
              </a>
              <a href="/demo" className="hero-btn-secondary">
                <Play size={18} />
                <span>Watch Demo</span>
              </a>
            </div>

            <div className="hero-stats">
              {featuredStats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <div className="hero-stat-icon">
                    <stat.icon size={20} color="white" />
                  </div>
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-movies-grid">
              {trendingMovies.map((movie, index) => (
                <div key={index} className="hero-movie-card">
                  <span className="hero-movie-emoji">{movie.image}</span>
                  <div className="hero-movie-title">{movie.title}</div>
                  <div className="hero-movie-director">{movie.director}</div>
                  <div className="hero-movie-rating">
                    <Star size={12} fill="currentColor"/>
                    <span>{movie.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;