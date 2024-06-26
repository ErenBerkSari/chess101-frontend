import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import UserProgress from "../UserProgress/UserProgress";
import { ProgressContext } from "../../contexts/ProgressContext";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("currentUser")
    ? JSON.parse(sessionStorage.getItem("currentUser"))
    : null;
  const { fetchProgress } = useContext(ProgressContext);

  useEffect(() => {
    if (currentUser) {
      fetchProgress(currentUser.id);
    }
  }, [currentUser, fetchProgress]);

  const handleLogout = () => {
    sessionStorage.removeItem("tokenKey");
    sessionStorage.removeItem("currentUser");
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Chess101</Link>
      </div>
      <div className="navbar-links">
        {currentUser && <Link to="/">Home</Link>}
        <Link to="/user-guide">User Guide</Link>
        {currentUser && <Link to="/profile">Profile</Link>}
        {currentUser && <Link to="/my-lessons">My Lessons</Link>}
        {currentUser?.role === "ADMIN" && (
          <Link to="/dashboard">Admin Paneli</Link>
        )}
      </div>
      <div className="navbar-user">
        {currentUser && (
          <div className="user-progress">
            <UserProgress />
          </div>
        )}
        {currentUser && (
          <button id="logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
