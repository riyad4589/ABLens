// Ce fichier définit la page Ticket de l'application.
// Il affiche la liste des tickets dans un tableau avec tri, création, et affichage détaillé.
// Utilisé pour la gestion et le suivi des tickets par les utilisateurs.

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NewTicketForm from "../modal/NewTicketForm";
import { MdConfirmationNumber } from "react-icons/md";
import { Container, Group, Button, Title, Card, Center, Alert, Text, Stack } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { Link } from "react-router-dom";
import { comparePriority, compareStatus } from "../utils/sortUtils";
import { DataTable } from 'mantine-datatable';
import { IconEye, IconAlertCircle, IconLock, IconTicketOff, IconPlus } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { useTickets } from '../hooks/useTickets';
import { showNotification } from '@mantine/notifications';

const PAGE_SIZE = 8;

const useStyles = createStyles(() => ({
  wrapper: {
    margin: '40px auto 48px auto',
    padding: 0,
    borderRadius: 18,
    background: '#f7f9fb',
    border: 'none',
    boxShadow: '0 4px 24px 0 rgba(33,118,189,0.06)',
    overflowX: 'auto',
    maxWidth: '98vw',
    width: '100%',
  },
  thead: {
    background: 'linear-gradient(90deg, #194898 0%, #4fc3f7 100%)',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    boxShadow: 'none',
    '& th': {
      color: '#fff',
      fontWeight: 800,
      fontSize: 16,
      border: 'none',
      padding: '14px 18px',
      whiteSpace: 'nowrap',
      background: 'transparent',
      letterSpacing: 0.2,
      cursor: 'pointer',
      transition: 'background 0.18s',
      userSelect: 'none',
      borderRight: '1px solid #e3e6ea',
      textAlign: 'left',
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    '& th:last-child': {
      borderRight: 'none',
      textAlign: 'right',
      borderTopRightRadius: 18,
    },
    '& th:hover': {
      background: '#174189',
    },
  },
  cell: {
    fontWeight: 400,
    fontSize: 15,
    color: '#183153',
    background: '#fff',
    borderBottom: '1px solid #e3e6ea',
    borderRight: '1px solid #e3e6ea',
    whiteSpace: 'nowrap',
    padding: '13px 18px',
    transition: 'background 0.18s',
    textAlign: 'left',
  },
  row: {
    transition: 'background 0.18s',
    '&:hover': {
      backgroundColor: '#eaf2fa',
    },
    '& td:last-child': {
      borderRight: 'none',
      textAlign: 'right',
    },
    '&:last-child td': {
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
    },
  },
}));

export default function Ticket() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState({ columnAccessor: 'subject', direction: 'asc' });
  const { classes } = useStyles();
  
  // Utiliser le hook useTickets pour récupérer les données depuis l'API
  const { tickets, loading, error, fetchTickets, createTicket, closeTicket } = useTickets();

  // Fonction pour fermer un ticket
  const handleCloseTicket = async (ticketId, ticketSubject) => {
    if (window.confirm(`Êtes-vous sûr de vouloir fermer le ticket "${ticketSubject}" ?`)) {
      try {
        await closeTicket(ticketId);
        showNotification({
          title: 'Ticket fermé',
          message: `Le ticket "${ticketSubject}" a été fermé avec succès`,
          color: 'green',
          autoClose: 3000,
        });
      } catch (error) {
        showNotification({
          title: 'Erreur',
          message: `Erreur lors de la fermeture: ${error.message}`,
          color: 'red',
          autoClose: 5000,
        });
      }
    }
  };

  // Fonction pour créer un nouveau ticket
  const handleCreateTicket = async (ticketData) => {
    try {
      await createTicket(ticketData);
      setShowNewTicket(false);
      showNotification({
        title: 'Succès',
        message: 'Ticket créé avec succès',
        color: 'green',
        autoClose: 3000,
      });
    } catch (error) {
      showNotification({
        title: 'Erreur',
        message: `Erreur lors de la création: ${error.message}`,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  // Trier les tickets
  const sortedTickets = [...tickets].sort((a, b) => {
    const dir = sortStatus.direction === 'asc' ? 1 : -1;
    
    // Gestion spéciale pour les propriétés imbriquées
    if (sortStatus.columnAccessor === 'createdBy') {
      const aVal = a.createdBy?.username || '';
      const bVal = b.createdBy?.username || '';
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    }
    
    if (sortStatus.columnAccessor === 'assignedAgent') {
      const aVal = a.assignedAgent?.username || '';
      const bVal = b.assignedAgent?.username || '';
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    }
    
    if (sortStatus.columnAccessor === 'assignedDepartment') {
      const aVal = a.assignedDepartment?.name || '';
      const bVal = b.assignedDepartment?.name || '';
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    }
    
    if (sortStatus.columnAccessor === 'priority') return comparePriority(a, b, sortStatus.direction === 'asc');
    if (sortStatus.columnAccessor === 'status') return compareStatus(a, b, sortStatus.direction === 'asc');
    
    // Tri standard pour les autres propriétés
    const aVal = a[sortStatus.columnAccessor];
    const bVal = b[sortStatus.columnAccessor];
    
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (aVal > bVal) return dir;
    if (aVal < bVal) return -dir;
    return 0;
  });
  
  const total = sortedTickets.length;
  const records = sortedTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { accessor: 'subject', title: 'Sujet', sortable: true, width: 180 },
    { 
      accessor: 'createdBy', 
      title: 'Créé par', 
      sortable: true, 
      width: 140,
      render: (ticket) => ticket.createdBy?.username || 'N/A'
    },
    { 
      accessor: 'assignedAgent', 
      title: 'Agent assigné', 
      sortable: true, 
      width: 140,
      render: (ticket) => ticket.assignedAgent?.username || 'Non assigné'
    },
    { 
      accessor: 'status', 
      title: 'Statut', 
      sortable: true, 
      width: 110,
      render: (ticket) => {
        let color = '#b0bed9', bg = '#f4f6fb', label = ticket.status;
        if (ticket.status === 'OPEN') { color = '#1ecb7b'; bg = '#eafaf3'; label = 'Ouvert'; }
        else if (ticket.status === 'CLOSED') { color = '#b0bed9'; bg = '#f4f6fb'; label = 'Fermé'; }
        else if (ticket.status === 'ASSIGNED') { color = '#f7b731'; bg = '#fffbe6'; label = 'Assigné'; }
        else if (ticket.status === 'PENDING') { color = '#f7b731'; bg = '#fffbe6'; label = 'En attente'; }
        return (
          <span style={{
            background: bg,
            color,
            fontWeight: 700,
            borderRadius: 8,
            padding: '4px 14px',
            fontSize: 15,
            letterSpacing: 0.1,
            display: 'inline-block',
            minWidth: 70,
            textAlign: 'center',
          }}>{label}</span>
        );
      }
    },
    { 
      accessor: 'priority', 
      title: 'Priorité', 
      sortable: true, 
      width: 110,
      render: (ticket) => {
        let color = '#2176bd', bg = '#eaf2fa', label = ticket.priority;
        if (ticket.priority === 'HIGH') { color = '#b8860b'; bg = '#fffbe6'; }
        else if (ticket.priority === 'URGENT') { color = '#ff4d4f'; bg = '#fff0f0'; }
        else if (ticket.priority === 'NORMAL') { color = '#2176bd'; bg = '#eaf2fa'; }
        else if (ticket.priority === 'LOW') { color = '#b0bed9'; bg = '#f4f6fb'; }
        return (
          <span style={{
            background: bg,
            color,
            fontWeight: 700,
            borderRadius: 8,
            padding: '4px 14px',
            fontSize: 15,
            letterSpacing: 0.1,
            display: 'inline-block',
            minWidth: 70,
            textAlign: 'center',
          }}>{label}</span>
        );
      }
    },
    { 
      accessor: 'createdAt', 
      title: 'Date de création', 
      sortable: true, 
      width: 140,
      render: (ticket) => {
        if (!ticket.createdAt) return 'N/A';
        const date = new Date(ticket.createdAt);
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    { 
      accessor: 'assignedDepartment', 
      title: 'Département', 
      sortable: true, 
      width: 120,
      render: (ticket) => ticket.assignedDepartment?.name || 'N/A'
    },
    {
      accessor: 'actions',
      title: '',
      width: 120,
      render: (ticket) => (
        <Group gap={8} justify="flex-end">
          <Link
            to={`/tickets/${ticket.id}`}
            title="Voir le ticket"
            style={{ display: 'inline-block' }}
            onClick={e => e.stopPropagation()}
          >
            <ActionIcon
              size={32}
              radius={50}
              variant="filled"
              color="#2176bd"
              style={{
                background: '#eaf2fa',
                color: '#2176bd',
                transition: 'background 0.18s, color 0.18s',
                boxShadow: '0 1px 4px #2176bd11',
                cursor: 'pointer',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#2176bd';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#eaf2fa';
                e.currentTarget.style.color = '#2176bd';
              }}
            >
              <IconEye size={22} />
            </ActionIcon>
          </Link>
          
          <ActionIcon
            size={32}
            radius={50}
            variant="filled"
            color="#f7b731"
            title="Fermer le ticket"
            style={{
              background: '#fffbe6',
              color: '#f7b731',
              transition: 'background 0.18s, color 0.18s',
              boxShadow: '0 1px 4px #f7b73111',
              cursor: 'pointer',
              display: ticket.status === 'CLOSED' ? 'none' : 'inline-flex',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#f7b731';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#fffbe6';
              e.currentTarget.style.color = '#f7b731';
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCloseTicket(ticket.id, ticket.subject);
            }}
          >
            <IconLock size={22} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  useEffect(() => {
    document.title = "ABLENS - Tickets";
  }, []);

  // Afficher une erreur si problème
  if (error) {
    return (
      <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
        <Sidebar />
        <main
          style={{
            marginLeft: 260,
            padding: '32px 40px 32px 40px',
            background: '#fff',
            minHeight: '100vh',
            borderRadius: '0 0 0 32px',
            boxShadow: '0 2px 16px rgba(24,49,83,0.06)',
          }}
        >
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Erreur de chargement"
            color="red"
            variant="light"
            style={{ marginBottom: 20 }}
          >
            <Text size="sm" mb={10}>
              Impossible de charger les tickets depuis le serveur.
            </Text>
            <Text size="sm" mb={10}>
              Erreur: {error}
            </Text>
            <Button 
              size="sm" 
              onClick={fetchTickets}
              style={{ background: '#194898' }}
            >
              Réessayer
            </Button>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
      <style>{`
        .mantine-DataTable-row:hover {
          background-color: #eaf2fa !important;
          transition: background 0.18s;
        }
      `}</style>
      <Sidebar />
      <main
        style={{
          marginLeft: 260,
          padding: '32px 40px 32px 40px',
          background: '#fff',
          minHeight: '100vh',
          borderRadius: '0 0 0 32px',
          boxShadow: '0 2px 16px rgba(24,49,83,0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Title order={2} style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>Tickets</Title>
          <Button
            leftSection={<MdConfirmationNumber style={{ fontSize: 20 }} />}
            size="md"
            color="#194898"
            radius="md"
            style={{ fontWeight: 600, background: '#194898' }}
            onClick={() => setShowNewTicket(true)}
          >
            Nouveau Ticket
          </Button>
        </div>
        
        <div className={classes.wrapper} style={{ background: 'transparent', boxShadow: 'none', margin: 0, padding: 0, marginTop: 20 }}>
          <DataTable
            striped
            maxHeight={900}
            withTableBorder
            highlightOnHover
            borderRadius="md"
            withColumnBorders
            verticalAlign="middle"
            columns={columns}
            records={records}
            page={page}
            onPageChange={setPage}
            totalRecords={total}
            recordsPerPage={PAGE_SIZE}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            classNames={{
              thead: classes.thead,
              row: classes.row,
              cell: classes.cell,
            }}
            noRecordsText="Aucun ticket trouvé"
          />
        </div>
        
        {showNewTicket && (
          <NewTicketForm 
            onClose={() => setShowNewTicket(false)} 
            onTicketCreated={handleCreateTicket}
          />
        )}
      </main>
    </div>
  );
}