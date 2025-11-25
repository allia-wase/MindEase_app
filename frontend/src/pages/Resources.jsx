import React from 'react';

const Resources = () => {
  const resources = [
    {
      category: 'Coping Strategies',
      items: [
        'Deep Breathing Exercises',
        'Mindfulness Meditation Guide',
        'Progressive Muscle Relaxation',
        'Grounding Techniques for Anxiety'
      ]
    },
    {
      category: 'Educational Materials',
      items: [
        'Understanding Depression',
        'Managing Academic Stress',
        'Building Healthy Relationships',
        'Sleep Hygiene Tips'
      ]
    },
    {
      category: 'Self-Help Tools',
      items: [
        'Mood Journal Template',
        'Thought Record Worksheet',
        'Weekly Planner for Self-Care',
        'Crisis Safety Plan Template'
      ]
    },
    {
      category: 'Campus Resources',
      items: [
        'University Counseling Services',
        'Academic Support Centers',
        'Student Health Services',
        'Peer Support Programs'
      ]
    }
  ];

  return (
    <div className="resources-container">
      <div className="container">
        <div className="section-title">
          <h2>Mental Health Resources</h2>
          <p>Tools and information to support your mental wellness journey</p>
        </div>

        <div className="resources-grid">
          {resources.map((resource, index) => (
            <div key={index} className="resource-card card">
              <div className="resource-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="resource-content">
                <h3>{resource.category}</h3>
                <ul>
                  {resource.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="resource-actions">
                <button className="btn btn-outline">
                  Explore Resources
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
