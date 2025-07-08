import React from "react";
import "../dashboard.css";

function StatsCards() {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <span className="stat-title">Open Tickets</span>
        <span className="stat-value">500</span>
        <span className="stat-trend positive">+12%</span>
        <span className="stat-desc">compared to yesterday</span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Created Tickets</span>
        <span className="stat-value">12,000</span>
        <span className="stat-trend positive">+9%</span>
        <span className="stat-desc">compared to last month</span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Closed Tickets</span>
        <span className="stat-value">1,000</span>
        <span className="stat-trend negative">-6%</span>
        <span className="stat-desc">compared to last month</span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Urgent Tickets</span>
        <span className="stat-value">123</span>
        <span className="stat-trend positive">+3%</span>
        <span className="stat-desc">compared to last month</span>
      </div>
    </div>
  );
}

export default StatsCards; 