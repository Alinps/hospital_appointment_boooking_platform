import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/authSlice";
import { useState } from "react";
import "../static/css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = useSelector(store => store.auth.user);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (user?.token) {
        await axios.post(
          "https://hospital-appointment-booking-app-backend.onrender.com/logout/",
          null,
          { headers: { Authorization: `Token ${user.token}` } }
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(removeUser());
      navigate("/");
    }
  };

  return (
    <nav className="app-navbar glass">
      <div className="app-navbar-inner">
        {/* BRAND */}
        <Link to="/" className="logo">
          CarePlus Hospital
        </Link>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        {/* NAV LINKS */}
        <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {user?.token && (
            <>
              <Link to="/myappointments" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Appointments
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {!user?.token && (
            <>
              <Link to="/login" className="btn-outline" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
