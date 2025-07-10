// Ce fichier définit la page Ticket de l'application.
// Il affiche la liste des tickets dans un tableau avec tri, création, et affichage détaillé.
// Utilisé pour la gestion et le suivi des tickets par les utilisateurs.
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NewTicketForm from "../modal/NewTicketForm";
import "../dashboard.css";
import { MdConfirmationNumber } from "react-icons/md";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import { tickets as ticketData } from "../data/mockTickets";
import { ticketColumns } from "../config/ticketColumns";
import { comparePriority, compareStatus } from "../utils/sortUtils";

export default function Ticket() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(ticketData);

  const handleRefresh = () => {
    setSortBy(null);
    setSortAsc(true);
    setSelectedRows([]);
    setPage(1);
    setTableData(ticketData);
  };

  let sortedTickets = [...tableData];
  if (sortBy === 'priority') {
    sortedTickets.sort((a, b) => comparePriority(a, b, sortAsc));
  } else if (sortBy === 'date') {
    sortedTickets.sort((a, b) => sortAsc ? (a.date > b.date ? 1 : -1) : (a.date < b.date ? 1 : -1));
  } else if (sortBy === 'status') {
    sortedTickets.sort((a, b) => compareStatus(a, b, sortAsc));
  } else {
    sortedTickets.sort((a, b) => a.id - b.id);
  }

  useEffect(() => {
    document.title = "ABLENS - Tickets";
  }, []);

  return (
    <div className="dashboard-layout" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main className="dashboard-main" style={{ background: '#f7f9fb', padding: 32 }}>
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1>Tickets</h1>
          <button className="new-ticket-btn" onClick={() => setShowNewTicket(true)}>
            <MdConfirmationNumber className="ticket-icon" /> Nouveau Ticket
          </button>
        </div>

        <Box sx={{ width: '100%', maxWidth: 1100, margin: '0 auto' }}>
          <DataGrid
            rows={sortedTickets}
            columns={ticketColumns}
            pageSize={8}
            rowsPerPageOptions={[8, 16, 32]}
            disableRowSelectionOnClick
            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'row-blue' : 'row-white'}
            disableColumnMenu
          />
        </Box>

        {showNewTicket && <NewTicketForm onClose={() => setShowNewTicket(false)} />}
      </main>
    </div>
  );
}