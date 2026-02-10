import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentStats, setRecentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(60);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [allStats, recent] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/stats`),
        axios.get(`${process.env.REACT_APP_API_URL}/stats/recent?minutes=${timeRange}`)
      ]);

      setStats(allStats.data.data);
      setRecentStats(recent.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      
      <div className="dashboard-controls">
        <label>
          Time Range (minutes):
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="30">Last 30 min</option>
            <option value="60">Last 1 hour</option>
            <option value="240">Last 4 hours</option>
            <option value="1440">Last 24 hours</option>
          </select>
        </label>
        <button onClick={fetchStats}>🔄 Refresh</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Detections</h3>
          <p className="stat-value">{stats?.totalDetections || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Average Confidence</h3>
          <p className="stat-value">{stats?.averageConfidence || 0}%</p>
        </div>

        <div className="stat-card">
          <h3>Top Emotion (Recent)</h3>
          <p className="stat-value">{recentStats?.topEmotion?.toUpperCase()}</p>
        </div>

        <div className="stat-card">
          <h3>Top Mood (Recent)</h3>
          <p className="stat-value">{recentStats?.topMood}</p>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stat-section">
          <h3>Emotion Distribution (All Time)</h3>
          {stats?.emotionCount && Object.entries(stats.emotionCount).map(([emotion, count]) => (
            <div key={emotion} className="stat-bar">
              <span className="emotion-label">{emotion}</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${(count / stats.totalDetections * 100)}%` }}></div>
              </div>
              <span className="count">{count}</span>
            </div>
          ))}
        </div>

        <div className="stat-section">
          <h3>Mood Distribution (Recent {timeRange} min)</h3>
          {recentStats?.moods && Object.entries(recentStats.moods).map(([mood, count]) => (
            <div key={mood} className="stat-bar">
              <span className="mood-label">{mood}</span>
              <div className="bar">
                <div className="bar-fill mood-bar" style={{ width: `${(count / recentStats.totalDetections * 100)}%` }}></div>
              </div>
              <span className="count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
