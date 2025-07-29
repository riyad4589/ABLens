// Ce fichier est le point d'entrée principal de l'application React.
// Il configure le routing, le provider Mantine, et monte les différentes pages (Login, Dashboard, Tickets, etc.).
// Utilisé pour initialiser et organiser la navigation de l'application.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Dashboard from './pages/Dashboard';
import Ticket from './pages/Ticket';
import TicketDetail from './pages/TicketDetail';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <Notifications />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);