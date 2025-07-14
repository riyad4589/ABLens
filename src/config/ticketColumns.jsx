// Ce fichier définit la configuration des colonnes pour l'affichage des tickets dans un tableau (DataGrid).
// Il contient les définitions de colonnes, les couleurs de priorité, et les fonctions de rendu personnalisées pour chaque colonne.
// Utilisé pour personnaliser l'affichage des tickets dans la page Tickets.
import { MdRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";

const priorityColors = {
  LOW: "#b0bed9",
  NORMAL: "#2176bd",
  HIGH: "#f7b731",
  URGENT: "#ff4d4f"
};

export const ticketColumns = [
  { accessor: 'id', title: 'ID' },
  { accessor: 'subject', title: 'Sujet' },
  { accessor: 'customer', title: 'Client' },
  {
    accessor: 'status',
    title: 'Statut',
    render: (ticket) => (
      <span style={{ color: ticket.status === 'Ouvert' ? '#1ecb7b' : ticket.status === 'Fermé' ? '#b0bed9' : '#f7b731', fontWeight: 600 }}>{ticket.status}</span>
    ),
  },
  {
    accessor: 'priority',
    title: 'Priorité',
    render: (ticket) => (
      <span style={{ background: priorityColors[ticket.priority], color: '#fff', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: 15 }}>{ticket.priority}</span>
    ),
  },
  { accessor: 'date', title: 'Date' },
  {
    accessor: 'action',
    title: 'Action',
    render: (ticket) => (
      <Link
        to={`/tickets/${ticket.id}`}
        title="Voir le ticket"
        style={{
          color: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          textDecoration: 'none',
        }}
      >
        <MdRemoveRedEye style={{ fontSize: 22 }} />
      </Link>
    ),
  },
];
