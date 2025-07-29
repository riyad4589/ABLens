// Ce fichier définit la page Dashboard de l'application.
// Il affiche le tableau de bord avec les statistiques, graphiques, et permet la création rapide d'un ticket.
// Utilisé comme page d'accueil après connexion.
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import { MdConfirmationNumber } from "react-icons/md";
import CustomBarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import NewTicketForm from "../modal/NewTicketForm";
import { Group, Button, Title, Card, Paper, Stack, Divider, Container } from '@mantine/core';

export default function Dashboard() {
  useEffect(() => {
    document.title = "ABLENS - Dashboard";
  }, []);
  const [showNewTicket, setShowNewTicket] = useState(false);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Title order={2} style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>Dashboard</Title>
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
        <StatsCards />
        <Divider my={24} />
        <Container size={650} px={0} style={{ marginTop: 24, marginLeft: 0, marginRight: 'auto' }}>
          <Card shadow="sm" radius="md" p="lg" withBorder>
            <CustomBarChart />
          </Card>
        </Container>
        <Divider my={24} />
        <Container size={650} px={0} style={{ marginTop: 24, marginLeft: 0, marginRight: 'auto' }}>
          <Card shadow="sm" radius="md" p="lg" withBorder>
            <DonutChart />
          </Card>
        </Container>
        {showNewTicket && <NewTicketForm onClose={() => setShowNewTicket(false)} />}
      </main>
    </div>
  );
}