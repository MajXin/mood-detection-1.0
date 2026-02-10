import React, { useState } from 'react';
import EmotionDetector from './components/EmotionDetector';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('detector');

  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="nav-brand">🎭 Emotion AI</h2>
        <ul className="nav-links">
          <li>
            <button 
              className={currentPage === 'detector' ? 'active' : ''} 
              onClick={() => setCurrentPage('detector')}
            >
              Detection
            </button>
          </li>
          <li>
            <button 
              className={currentPage === 'dashboard' ? 'active' : ''} 
              onClick={() => setCurrentPage('dashboard')}
            >
              Analytics
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {currentPage === 'detector' && <EmotionDetector />}
        {currentPage === 'dashboard' && <Dashboard />}
      </main>

      <footer className="footer">
        <p>Powered by MERN Stack • Face-API.js • MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
