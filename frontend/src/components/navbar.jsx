function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h3>Asset Management</h3>
        <p>Manage your organization's assets</p>
      </div>

      <div className="profile">
        <div className="avatar">AR</div>

        <div>
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;