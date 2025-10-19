import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.web.css';

const SimpleLandingPage = () => {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Sportification</h1>
        <p className="subtitle">Your Sports Community Platform</p>
      </header>

      <div className="content">
        <p className="description">
          Connect with fellow sports enthusiasts, organize matches, join tournaments,
          manage teams, and book venues all in one place.
        </p>

        <div className="features">
          <FeatureItem icon="⚽" title="Matches" description="Find and join sports matches" />
          <FeatureItem icon="🏆" title="Tournaments" description="Compete in tournaments" />
          <FeatureItem icon="👥" title="Teams" description="Create and manage teams" />
          <FeatureItem icon="📍" title="Venues" description="Book sports venues" />
          <FeatureItem icon="💬" title="Chat" description="Real-time messaging" />
          <FeatureItem icon="🔔" title="Notifications" description="Stay updated" />
        </div>

        <div className="download-section">
          <h2 className="download-title">Download the Mobile App</h2>
          <p className="download-text">
            For the best experience, download our mobile app:
          </p>
          <div className="button-container">
            <button className="download-button">📱 iOS App Store</button>
            <button className="download-button">🤖 Google Play Store</button>
          </div>
        </div>

        <footer className="footer">
          <p className="footer-text">
            © 2025 Sportification. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <div className="feature-item">
    <span className="feature-icon">{icon}</span>
    <div className="feature-content">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SimpleLandingPage />
  </React.StrictMode>
);
