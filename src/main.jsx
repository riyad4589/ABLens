// Ce fichier est le point d'entrée principal de l'application React.
// Il configure le routing, le provider Mantine, et monte les différentes pages (Login, Dashboard, Tickets, etc.).
// Utilisé pour initialiser et organiser la navigation de l'application.
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import Dashboard from './pages/Dashboard';
import Ticket from './pages/Ticket';
import TicketDetail from './pages/TicketDetail';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { MantineProvider, Loader, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { CssLoader } from './components/CssLoader';

// Thème Mantine avec loader personnalisé
const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: CssLoader },
        type: 'custom',
      },
    }),
  },
});

// Composant qui affiche le loader lors des transitions de page
function AppWithLoader() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigationType === 'PUSH') {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 900);
      return () => clearTimeout(timeout);
    }
    setLoading(false);
  }, [location, navigationType]);

  return (
    <>
      {loading ? (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: '#fff', // fond blanc opaque
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loader size={70} type="custom" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications />
      <BrowserRouter>
        <AppWithLoader />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
