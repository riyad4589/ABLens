import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NewTicketForm from "../modal/NewTicketForm";
import "../dashboard.css";
import { MdConfirmationNumber, MdRemoveRedEye, MdRefresh } from "react-icons/md";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { useNavigate, Link } from 'react-router-dom';

// Données mockées pour la table
const tickets = [
  { id: 1, subject: "Problème de connexion", customer: "Jean Dupont", status: "Ouvert", priority: "HIGH", date: "2024-06-01", created: "2 Hours ago", orderNumber: "N/A", motive: "RETARD DE LIVRAISON", tags: ["Tag", "Tag", "Tag"], team: "LOGISTICS", claim: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et . consectetur adipiscing elit, sed", client: { name: "Skyonode", city: "Palayan City", phone: "212-171-876-636", address: "844 Morris Park avenue" }, timeline: [{ text: "Ticket Created", detail: "Agent : Sara Doe created ticket for Client John doe", time: "21 hours ago" }] },
  { id: 2, subject: "Erreur de paiement", customer: "Sophie Martin", status: "Fermé", priority: "NORMAL", date: "2024-06-02", created: "1 day ago", orderNumber: "N/A", motive: "PAIEMENT", tags: ["Tag", "Tag"], team: "SUPPORT", claim: "Problème de paiement sur la commande #1234.", client: { name: "Shopcity", city: "Paris", phone: "01 23 45 67 89", address: "12 rue de Paris" }, timeline: [{ text: "Ticket Closed", detail: "Agent : Paul a fermé le ticket", time: "10 hours ago" }] },
  { id: 3, subject: "Demande d'information", customer: "Ali Ben", status: "En attente", priority: "LOW", date: "2024-06-03", created: "3 days ago", orderNumber: "N/A", motive: "INFO", tags: ["Tag"], team: "SUPPORT", claim: "Demande d'information sur le produit.", client: { name: "InfoStore", city: "Lyon", phone: "04 56 78 90 12", address: "34 avenue des Infos" }, timeline: [{ text: "Ticket Created", detail: "Agent : Alice a créé le ticket", time: "3 days ago" }] },
  { id: 4, subject: "Bug application", customer: "Fatima Zahra", status: "Ouvert", priority: "URGENT", date: "2024-06-04", created: "1 hour ago", orderNumber: "N/A", motive: "BUG", tags: ["Tag", "Urgent"], team: "DEV", claim: "Bug critique sur l'application mobile.", client: { name: "AppCorp", city: "Marseille", phone: "06 12 34 56 78", address: "56 rue du Code" }, timeline: [{ text: "Ticket Created", detail: "Agent : Karim a créé le ticket", time: "1 hour ago" }] },
];

const priorityColors = {
  LOW: "#b0bed9",
  NORMAL: "#2176bd",
  HIGH: "#f7b731",
  URGENT: "#ff4d4f"
};

function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null;
  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={e => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 1100, width: '98vw', minHeight: 500, display: 'flex', flexDirection: 'row', gap: 32, padding: 32, position: 'relative' }}>
        {/* Bouton de fermeture */}
        <button className="modal-close-btn" onClick={onClose} title="Fermer">×</button>
        <div style={{ flex: 2, minWidth: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 18 }}>Ticket N° {ticket.id}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 10 }}>
            <div>Created : <b>{ticket.created}</b> <span style={{ color: '#888', fontSize: 13 }}>({ticket.date})</span></div>
            <div>Order Number : <b>{ticket.orderNumber}</b></div>
            <div>Priority : <span style={{ background: priorityColors[ticket.priority], color: '#fff', borderRadius: 6, padding: '2px 12px', fontWeight: 600, fontSize: 15 }}>{ticket.priority}</span></div>
            <div>Motif : <b>{ticket.motive}</b></div>
            <div>Tags : {ticket.tags.map((tag, i) => <span key={i} style={{ background: '#e0e6ed', color: '#174189', borderRadius: 6, padding: '2px 8px', fontWeight: 500, fontSize: 14, marginRight: 6 }}>{tag}</span>)}</div>
            <div>Team : <b>{ticket.team}</b></div>
          </div>
          <div style={{ margin: '24px 0 32px 0', maxWidth: 600 }}>
            <div style={{ background: '#2176bd', color: '#fff', borderRadius: 8, padding: 16, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>
              <span style={{ fontSize: 22, background: '#174189', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</span>
              <span>Ticket Claim:</span>
            </div>
            <div style={{ background: '#eaf2fb', borderRadius: 0, padding: 18, fontSize: 16, color: '#174189', fontWeight: 500 }}>{ticket.claim}</div>
          </div>
          <div style={{ marginTop: 32 }}>
            <input type="text" placeholder="type a comment" style={{ width: '100%', border: '1.5px solid #e0e6ed', borderRadius: 6, padding: 10, fontSize: 15 }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, borderLeft: '1.5px solid #e0e6ed', paddingLeft: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ color: '#2176bd', fontWeight: 700, fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, background: '#e0e6ed', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛈</span>
              Ticket Created
            </div>
            <div style={{ color: '#555', fontSize: 15 }}>{ticket.timeline[0]?.detail}</div>
            <div style={{ color: '#b0bed9', fontSize: 13, marginTop: 4 }}>{ticket.timeline[0]?.time}</div>
          </div>
          <div style={{ marginTop: 32 }}>
            <div style={{ color: '#174189', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>Client Info:</div>
            <div style={{ color: '#222', fontSize: 15, marginBottom: 6 }}><b>Store Name:</b> {ticket.client.name}</div>
            <div style={{ color: '#222', fontSize: 15, marginBottom: 6 }}><b>City:</b> {ticket.client.city}</div>
            <div style={{ color: '#222', fontSize: 15, marginBottom: 6 }}><b>Phone:</b> {ticket.client.phone}</div>
            <div style={{ color: '#222', fontSize: 15, marginBottom: 6 }}><b>Address:</b> {ticket.client.address}</div>
          </div>
        </div>
        <button style={{ position: 'absolute', top: 24, right: 24, background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(24,49,83,0.08)', cursor: 'pointer' }}>Close Ticket</button>
      </div>
    </div>
  );
}

function comparePriority(a, b, asc) {
  const order = ["LOW", "NORMAL", "HIGH", "URGENT"];
  const diff = order.indexOf(a.priority) - order.indexOf(b.priority);
  return asc ? diff : -diff;
}

function compareStatus(a, b, asc) {
  const order = ["Ouvert", "En attente", "Fermé"];
  const diff = order.indexOf(a.status) - order.indexOf(b.status);
  return asc ? diff : -diff;
}

// Colonnes pour DataGrid MUI
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'subject', headerName: 'Sujet', flex: 1, minWidth: 180 },
  { field: 'customer', headerName: 'Client', flex: 1, minWidth: 140 },
  {
    field: 'status',
    headerName: 'Statut',
    width: 120,
    renderCell: (params) => (
      <span style={{ color: params.value === 'Ouvert' ? '#1ecb7b' : params.value === 'Fermé' ? '#b0bed9' : '#f7b731', fontWeight: 600 }}>{params.value}</span>
    ),
  },
  {
    field: 'priority',
    headerName: 'Priorité',
    width: 120,
    renderCell: (params) => (
      <span style={{ background: priorityColors[params.value], color: '#fff', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: 15 }}>{params.value}</span>
    ),
  },
  { field: 'date', headerName: 'Date', width: 120 },
  {
    field: 'action',
    headerName: 'Action',
    width: 110,
    sortable: false,
    filterable: false,
    cellClassName: 'action-cell-center',
    renderCell: (params) => (
      <Link
        to={`/tickets/${params.row.id}`}
        title="Voir le ticket"
        style={{
          color: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <MdRemoveRedEye style={{ fontSize: 22 }} />
      </Link>
    ),
  },
];

// Fonction pour afficher les détails lors de l'expansion de ligne
const ExpandedComponent = ({ data }) => (
  <div style={{ padding: 16, background: '#f7f9fb', borderRadius: 8 }}>
    <div><b>Motif :</b> {data.motive}</div>
    <div><b>Tags :</b> {data.tags.join(', ')}</div>
    <div><b>Team :</b> {data.team}</div>
    <div><b>Claim :</b> {data.claim}</div>
    <div><b>Client :</b> {data.client.name} ({data.client.city})</div>
    <div><b>Timeline :</b> {data.timeline.map(t => t.text + ' - ' + t.detail + ' (' + t.time + ')').join(', ')}</div>
  </div>
);

// Menu contextuel personnalisé
const RowContextMenu = ({ row, onClose }) => (
  <ContextMenu id={`contextmenu-${row.id}`}>
    <MenuItem onClick={() => { onClose(); }}>Voir le ticket</MenuItem>
    <MenuItem onClick={() => alert('Action personnalisée')}>Action personnalisée</MenuItem>
  </ContextMenu>
);

export default function Ticket() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [sortBy, setSortBy] = useState(null); // 'priority', 'date', 'status'
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(tickets);
  const navigate = useNavigate();

  // Fonction de reset complet
  const handleRefresh = () => {
    setSortBy(null);
    setSortAsc(true);
    setSelectedRows([]);
    setPage(1);
    setTableData(tickets);
  };

  let sortedTickets = [...tableData];
  if (sortBy === 'priority') {
    sortedTickets.sort((a, b) => comparePriority(a, b, sortAsc));
  } else if (sortBy === 'date') {
    sortedTickets.sort((a, b) => {
      if (a.date === b.date) return 0;
      return sortAsc ? (a.date > b.date ? 1 : -1) : (a.date < b.date ? 1 : -1);
    });
  } else if (sortBy === 'status') {
    sortedTickets.sort((a, b) => compareStatus(a, b, sortAsc));
  } else {
    // Par défaut, tri par id croissant
    sortedTickets.sort((a, b) => a.id - b.id);
  }

  useEffect(() => {
    document.title = "ABLENS - Tickets";
  }, []);

  return (
    <div className="dashboard-layout" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main className="dashboard-main" style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden', background: '#f7f9fb', padding: 32 }}>
        <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1>Tickets</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="new-ticket-btn" onClick={() => setShowNewTicket(true)}>
              <MdConfirmationNumber className="ticket-icon" /> Nouveau Ticket
            </button>
          </div>
        </div>
        {/* Bouton de réinitialisation du tri */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={handleRefresh}
            style={{ background: '#e0e6ed', color: '#174189', border: 'none', borderRadius: 6, padding: '7px 12px', fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 1px 4px rgba(24,49,83,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Rafraîchir / Réinitialiser le tableau"
          >
            <MdRefresh />
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', width: '100%' }}>
          <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="60vh" width="100%">
            <Box sx={{ width: '100%', maxWidth: 1100 }}>
              <DataGrid
                rows={sortedTickets}
                columns={columns}
                pageSize={8}
                rowsPerPageOptions={[8, 16, 32]}
                disableRowSelectionOnClick={true}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'row-blue' : 'row-white'}
                disableColumnMenu={true}
              />
            </Box>
          </Box>
        </div>
        {showNewTicket && <NewTicketForm onClose={() => setShowNewTicket(false)} />}
      </main>
    </div>
  );
}