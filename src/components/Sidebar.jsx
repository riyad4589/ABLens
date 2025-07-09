import React from "react";
import "../dashboard.css";
import logo from "../assets/ablens2.jpg";
import { MdDashboard, MdConfirmationNumber, MdPieChart, MdSettings, MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/dashboard" style={{ display: 'inline-block' }}>
          <img src={logo} alt="AB LENS" className="logo-img" style={{ cursor: 'pointer' }} />
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none', width: '100%' }}>
              <MdDashboard className="icon" /> Dashboard
            </Link>
          </li>
          <li className={location.pathname.startsWith("/tickets") ? "active" : ""}>
            <Link to="/tickets" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none', width: '100%' }}>
              <MdConfirmationNumber className="icon" /> Tickets
            </Link>
          </li>
          <li className={location.pathname.startsWith("/reports") ? "active" : ""}>
            <Link to="/reports" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none', width: '100%' }}>
              <MdPieChart className="icon" /> Reports
            </Link>
          </li>
          <li className={location.pathname.startsWith("/settings") ? "active" : ""}>
            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none', width: '100%' }}>
              <MdSettings className="icon" /> Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-bottom" style={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
        <span className="logout-text">Log Out</span>
        <MdLogout className="icon logout-icon" />
      </div>
    </aside>
  );
}

export default Sidebar; 