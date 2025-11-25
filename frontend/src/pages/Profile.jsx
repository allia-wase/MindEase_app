import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header card">
          <div className="profile-avatar">
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div className="profile-info">
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-university">{user?.university}</p>
          </div>
        </div>

        <div className="profile-sections">
          <div className="card">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <p>{user?.studentId}</p>
            </div>
            <div className="form-group">
              <label className="form-label">University</label>
              <p>{user?.university}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <p>{user?.role}</p>
            </div>
          </div>

          <div className="card">
            <h3>Emergency Contact</h3>
            <p>Set up your emergency contact information for crisis situations.</p>
            <button className="btn btn-outline">
              Add Emergency Contact
            </button>
          </div>

          <div className="card">
            <h3>Preferences</h3>
            <p>Manage your notification preferences and app settings.</p>
            <button className="btn btn-outline">
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
