import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
import StatsCards from "../components/StatsCards";
import { MdConfirmationNumber } from "react-icons/md";
import CustomBarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import NewTicketForm from "../modal/NewTicketForm";

function Dashboard() {
  useEffect(() => {
    document.title = "ABLENS - Dashboard";
  }, []);
  const [showNewTicket, setShowNewTicket] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Tableau de bord</h1>
          <button className="new-ticket-btn" onClick={() => setShowNewTicket(true)}>
            <MdConfirmationNumber className="ticket-icon" /> New Ticket
          </button>
        </div>
        <StatsCards />
        <hr className="dashboard-separator" />
        <div style={{ marginTop: 24, maxWidth: 650 }}>
          <CustomBarChart />
        </div>
        <hr className="dashboard-separator" />
        {/* Donut chart Mantine sous le BarChart */}
        <div style={{ marginTop: 24, maxWidth: 900 }}>
          <DonutChart />
        </div>
        {showNewTicket && <NewTicketForm onClose={() => setShowNewTicket(false)} />}
      </main>
    </div>
  );
}

export default Dashboard;