import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './pages/Dashboard'
import Ticket from './pages/Ticket'
import TicketDetail from './pages/TicketDetail'
import Login from './pages/Login';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { MantineProvider } from '@mantine/core'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
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
)
