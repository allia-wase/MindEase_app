import React from 'react';
import { Link } from 'react-router-dom';

const CrisisSupport = () => {
  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '1-800-273-8255',
      description: '24/7 free and confidential support'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free 24/7 crisis counseling via text'
    },
    {
      name: 'Emergency Services',
      phone: '911',
      description: 'Local emergency services'
    },
    {
      name: 'University Counseling Center',
      phone: '(555) 123-4567',
      description: 'Your university mental health services'
    }
  ];

  return (
    <div className="crisis-section">
      <div className="container">
        <div className="crisis-card card">
          <h2><i className="fas fa-first-aid"></i> Immediate Support</h2>
          <p>
            If you're in crisis or having thoughts of harming yourself, please reach out 
            to these resources immediately. You don't have to face this alone.
          </p>
          
          <div className="emergency-contacts">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="contact-item">
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-phone">{contact.phone}</div>
                  <div className="contact-description">{contact.description}</div>
                </div>
                <button className="btn btn-danger">
                  Call Now
                </button>
              </div>
            ))}
          </div>
          
          <div className="safety-plan">
            <h3>Safety Plan</h3>
            <ul>
              <li>Reach out to a trusted friend, family member, or professional</li>
              <li>Go to a safe environment where you feel comfortable</li>
              <li>Use coping strategies that have helped you in the past</li>
              <li>Remember that these feelings are temporary and help is available</li>
            </ul>
          </div>
          
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
            I've Reached Out for Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;
