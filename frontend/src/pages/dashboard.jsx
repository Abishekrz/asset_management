import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/api/dashboard/stats");

        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError("Unable to load dashboard data.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your asset management system</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Assets</span>
          <strong>{stats.totalAssets}</strong>
          <small>All registered assets</small>
        </div>

        <div className="stat-card">
          <span>Employees</span>
          <strong>{stats.totalEmployees}</strong>
          <small>Active employees</small>
        </div>

        <div className="stat-card">
          <span>Issued Assets</span>
          <strong>{stats.issuedAssets}</strong>
          <small>Currently assigned</small>
        </div>

        <div className="stat-card">
          <span>Available</span>
          <strong>{stats.stockAssets}</strong>
          <small>Ready to issue</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Asset Status</h2>

          <div className="status-list">
            <div>
              <span>Available</span>
              <strong>{stats.stockAssets}</strong>
            </div>

            <div>
              <span>Issued</span>
              <strong>{stats.issuedAssets}</strong>
            </div>

            <div>
              <span>Under Repair</span>
              <strong>{stats.repairAssets}</strong>
            </div>

            <div>
              <span>Scrapped</span>
              <strong>{stats.scrapAssets}</strong>
            </div>
          </div>
        </div>

        <div className="panel ai-panel">
          <div className="ai-icon">🤖</div>

          <h2>AI Assistant</h2>

          <p>
            Manage assets using natural language commands with the integrated
            AI agent.
          </p>

          <a href="/ai" className="ai-button">
            Open AI Assistant →
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;