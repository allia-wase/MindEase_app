import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { moodAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState(null);
  const [moodStats, setMoodStats] = useState(null);

  useEffect(() => {
    fetchMoodStats();
  }, []);

  const fetchMoodStats = async () => {
    try {
      const response = await moodAPI.getStats();
      setMoodStats(response.data);
    } catch (error) {
      console.error('Error fetching mood stats:', error);
    }
  };

  const handleMoodSelect = async (mood) => {
    setCurrentMood(mood);
    try {
      await moodAPI.track({ mood, intensity: 5 });
      // You could show a success message here
    } catch (error) {
      console.error('Error tracking mood:', error);
    }
  };

  const moodOptions = [
    { value: 'very_sad', icon: 'fas fa-sad-tear', label: 'Very Sad' },
    { value: 'sad', icon: 'fas fa-frown', label: 'Sad' },
    { value: 'neutral', icon: 'fas fa-meh', label: 'Neutral' },
    { value: 'happy', icon: 'fas fa-smile', label: 'Happy' },
    { value: 'very_happy', icon: 'fas fa-laugh', label: 'Very Happy' }
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-message">
            <h2>Welcome back, {user?.firstName}!</h2>
            <p>How are you feeling today?</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/crisis-support" className="btn btn-outline">
              <i className="fas fa-first-aid"></i> Crisis Support
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Mood Tracking Card */}
          <div className="dashboard-card card">
            <h3><i className="fas fa-smile"></i> Today's Mood</h3>
            <p>How are you feeling right now?</p>
            <div className="mood-tracker">
              {moodOptions.map((mood) => (
                <div
                  key={mood.value}
                  className={`mood-option ${currentMood === mood.value ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(mood.value)}
                >
                  <i className={mood.icon}></i>
                  <div>{mood.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Assessment Card */}
          <div className="dashboard-card card">
            <h3><i className="fas fa-clipboard-check"></i> Self-Assessment</h3>
            <p>Check in with your mental health status with our confidential assessment.</p>
            <Link to="/assessment" className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}>
              Start Assessment
            </Link>
          </div>

          {/* Counselor Sessions Card */}
          <div className="dashboard-card card">
            <h3><i className="fas fa-user-md"></i> Counselor Sessions</h3>
            <p>Connect with a mental health professional.</p>
            <button className="btn btn-outline" style={{ marginTop: '15px', width: '100%' }}>
              Book a Session
            </button>
          </div>

          {/* Peer Support Card */}
          <div className="dashboard-card card">
            <h3><i className="fas fa-users"></i> Peer Support</h3>
            <p>Join anonymous chat groups with other students.</p>
            <button className="btn btn-outline" style={{ marginTop: '15px', width: '100%' }}>
              Join Community
            </button>
          </div>

          {/* Resources Card */}
          <div className="dashboard-card card">
            <h3><i className="fas fa-book"></i> Resources</h3>
            <p>Access articles and tools for mental wellness.</p>
            <Link to="/resources" className="btn btn-outline" style={{ marginTop: '15px', width: '100%' }}>
              Browse Resources
            </Link>
          </div>

          {/* Progress Card */}
          <div className="dashboard-card card">
            <h3><i className="fas fa-chart-line"></i> Your Progress</h3>
            <p>View your mood history and assessment results.</p>
            <button className="btn btn-outline" style={{ marginTop: '15px', width: '100%' }}>
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
