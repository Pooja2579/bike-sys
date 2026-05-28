import { NavLink } from 'react-router-dom'

export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-panel">
        <div className="brand-mark">BP</div>
        <div>
          <h1>BikePool</h1>
          <p>Safe ride share made simple</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/offer">Offer Ride</NavLink>
        <NavLink to="/navigation">Navigation</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <div className="user-tools">
        {user ? (
          <>
            <div className="user-chip">{user.name}</div>
            <button className="button small" onClick={onLogout}>
              Sign out
            </button>
          </>
        ) : (
          <NavLink className="button" to="/verify">
            Verify Phone
          </NavLink>
        )}
      </div>
    </header>
  )
}
