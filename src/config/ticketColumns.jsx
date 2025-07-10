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
          textDecoration: 'none',
        }}
      >
        <MdRemoveRedEye style={{ fontSize: 22 }} />
      </Link>
    ),
  },
];
