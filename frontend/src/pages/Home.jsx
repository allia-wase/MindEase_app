import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Your Mental Health Matters</h1>
            <p className="hero-subtitle">
              MindEase provides university students with accessible mental health support, 
              resources, and a caring community to help navigate academic challenges.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Already have an account?
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>How MindEase Supports You</h2>
            <p>Our comprehensive platform offers multiple ways to support your mental wellness journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3>Self-Assessment</h3>
              <p>Take confidential assessments to understand your mental health status and receive personalized recommendations.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Professional Support</h3>
              <p>Connect with certified counselors and mental health professionals for personalized sessions.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Peer Community</h3>
              <p>Join anonymous support groups to share experiences and find solidarity with fellow students.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Resources Library</h3>
              <p>Access articles, videos, and tools for coping with stress, anxiety, and other mental health challenges.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Mood Tracking</h3>
              <p>Monitor your emotional wellbeing over time and identify patterns to better manage your mental health.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-first-aid"></i>
              </div>
              <h3>Crisis Support</h3>
              <p>Immediate access to emergency contacts and crisis resources when you need them most.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
