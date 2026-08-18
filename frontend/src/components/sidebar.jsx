import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">A</div>

        <div className="logo-text">
          <h2>AssetAI</h2>
          <span>Management</span>
        </div>
      </div>

      <nav>
        <p className="menu-title">MAIN</p>

        <NavLink to="/" end>
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink to="/employees">
          <span>👥</span>
          Employees
        </NavLink>

        <NavLink to="/categories">
          <span>🏷️</span>
          Categories
        </NavLink>

        <NavLink to="/assets">
          <span>💻</span>
          Assets
        </NavLink>

        <NavLink to="/issues">
          <span>🔄</span>
          Issues
        </NavLink>

        <NavLink to="/scraped-assets">
          <span>🗑️</span>
          Scraped Assets
        </NavLink>

        <p className="menu-title">ARTIFICIAL INTELLIGENCE</p>

        <NavLink to="/ai">
          <span>🤖</span>
          AI Assistant
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        AssetAI v1.0
      </div>
    </aside>
  );
}

export default Sidebar;