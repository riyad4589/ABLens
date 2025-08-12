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
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import AppInitializer from './components/AppInitializer';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryProvider } from './providers/QueryProvider';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { clearTokensOnStartup } from './utils/authUtils';

// Initialisation au démarrage : nettoyer les tokens pour forcer la redirection vers login
clearTokensOnStartup();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <style>{`
      .mantine-Card-root {
        background-color: #ffffff !important;
        color: #183153 !important;
      }
      
      .mantine-Paper-root:not([data-sidebar]) {
        background-color: #ffffff !important;
        color: #183153 !important;
      }
      
      .mantine-Text-root {
        color: #183153 !important;
      }
      
      .mantine-Title-root {
        color: #183153 !important;
      }
    `}</style>
    <AppInitializer>
      <QueryProvider>
        <MantineProvider defaultColorScheme="light">
          <Notifications />
          <BrowserRouter>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              {/* Routes protégées */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/tickets" element={
                <ProtectedRoute>
                  <Ticket />
                </ProtectedRoute>
              } />
              <Route path="/tickets/:id" element={
                <ProtectedRoute>
                  <TicketDetail />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              } />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </QueryProvider>
    </AppInitializer>
  </StrictMode>,
);