// // Ce fichier définit la page Ticket de l'application.
// // Il affiche la liste des tickets dans un tableau avec tri, création, et affichage détaillé.
// // Utilisé pour la gestion et le suivi des tickets par les utilisateurs.

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NewTicketForm from "../modal/NewTicketForm";
import { MdConfirmationNumber } from "react-icons/md";
import { Container, Group, Button, Title, Card } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { Link } from "react-router-dom";
import { tickets as ticketData } from "../data/mockTickets";
import { comparePriority, compareStatus } from "../utils/sortUtils";
import { DataTable } from 'mantine-datatable';
import { IconEye } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
// import classes from './Ticket.module.css';

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
    background: '#f3f7fb',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    boxShadow: 'none',
    '& th': {
      color: '#194898',
      fontWeight: 700,
      fontSize: 16,
      border: 'none',
      padding: '12px 14px',
      whiteSpace: 'nowrap',
      background: '#f3f7fb',
      letterSpacing: 0.1,
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
      background: '#eaf2fa',
    },
  },
  cell: {
    fontWeight: 400,
    fontSize: 15,
    color: '#222',
    background: '#fff',
    borderBottom: '1px solid #e3e6ea',
    borderRight: '1px solid #e3e6ea',
    whiteSpace: 'nowrap',
    padding: '10px 14px',
    transition: 'background 0.18s',
    textAlign: 'left',
  },
  row: {
    transition: 'background 0.18s',
    '&:hover': {
      backgroundColor: '#f6faff',
    },
    '&:nth-of-type(even)': {
      background: '#fff',
    },
    '&:nth-of-type(odd)': {
      background: '#f7f9fb',
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
  const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });
  const { classes } = useStyles();

  const sortedTickets = [...ticketData].sort((a, b) => {
    const dir = sortStatus.direction === 'asc' ? 1 : -1;
    if (sortStatus.columnAccessor === 'priority') return comparePriority(a, b, sortStatus.direction === 'asc');
    if (sortStatus.columnAccessor === 'status') return compareStatus(a, b, sortStatus.direction === 'asc');
    if (a[sortStatus.columnAccessor] > b[sortStatus.columnAccessor]) return dir;
    if (a[sortStatus.columnAccessor] < b[sortStatus.columnAccessor]) return -dir;
    return 0;
  });
  const total = sortedTickets.length;
  const records = sortedTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { accessor: 'id', title: 'ID', sortable: true, width: 50, textAlign: 'center' },
    { accessor: 'subject', title: 'Sujet', sortable: true, width: 180 },
    { accessor: 'customer', title: 'Client', sortable: true, width: 140 },
    { accessor: 'status', title: 'Statut', sortable: true, width: 110,
      render: (ticket) => {
        let color = '#b0bed9', bg = '#f4f6fb', label = ticket.status;
        if (ticket.status === 'Ouvert') { color = '#1ecb7b'; bg = '#eafaf3'; }
        else if (ticket.status === 'Fermé') { color = '#b0bed9'; bg = '#f4f6fb'; }
        else if (ticket.status === 'En attente') { color = '#f7b731'; bg = '#fffbe6'; }
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
    { accessor: 'priority', title: 'Priorité', sortable: true, width: 110,
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
    { accessor: 'date', title: 'Date', sortable: true, width: 120 },
    {
      accessor: 'actions',
      title: '',
      width: 70,
      render: (ticket) => (
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
      ),
    },
  ];

  useEffect(() => {
    document.title = "ABLENS - Tickets";
  }, []);

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
        <Group position="apart" align="center" mb={32} style={{ width: '100%', gap: 760 }}>
          <Title order={2} style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>Tickets</Title>
          <Button
            leftSection={<MdConfirmationNumber style={{ fontSize: 20 }} />}
            size="md"
            color="#194898"
            radius="md"
            style={{ fontWeight: 600, background: '#194898', color: '#fff' }}
            onClick={() => setShowNewTicket(true)}
          >
            Nouveau Ticket
          </Button>
        </Group>
          <div className={classes.wrapper} style={{ background: 'transparent', boxShadow: 'none', margin: 0, padding: 0 }}>
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
            />
          </div>
        {showNewTicket && <NewTicketForm onClose={() => setShowNewTicket(false)} />}
      </main>
    </div>
  );
}