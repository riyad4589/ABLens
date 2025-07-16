import React from "react";
import logo from "../assets/ablens2.jpg";
import {
  IconLayoutDashboard,
  IconTicket,
  IconChartPie,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  Group,
  Stack,
  NavLink,
  Text,
  Paper,
  Image,
  Box,
  Badge,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

const navItems = [
  { 
    to: '/dashboard', 
    label: 'Dashboard', 
    icon: IconLayoutDashboard,
  },
  { 
    to: '/tickets', 
    label: 'Tickets', 
    icon: IconTicket,
    // badge: 3 // Nombre de tickets en attente
  },
  { 
    to: '/reports', 
    label: 'Reports', 
    icon: IconChartPie,
  },
  { 
    to: '/settings', 
    label: 'Settings', 
    icon: IconSettings,
  },
];

// Style actif des boutons (plus marqué)
const navLinkActiveStyle = {
  background: '#fff',
  color: '#194898',
  fontWeight: 700,
  boxShadow: '0 2px 8px rgba(25,72,152,0.10)',
  transform: 'scale(1.04)',
  transition: 'all 0.18s cubic-bezier(.4,1.3,.6,1)',
};

// Style personnalisé pour le root du bouton au survol et focus
const navLinkRootStyles = {
  root: {
    '&:hover': {
      background: '#eaf1fb',
      transform: 'translateX(8px) scale(1.06)',
    },
    '&:focus': {
      outline: '2px solid #194898',
      outlineOffset: 2,
    },
  },
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    showNotification({
      title: 'Déconnexion',
      message: 'Déconnexion réussie',
      color: 'blue',
      autoClose: 2500,
      icon: <IconLogout size={18} />,
    });
    navigate('/');
  };

  return (
    <Paper
      withBorder={false}
      radius={0}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: 270,
        background: '#194898', // Couleur de fond demandée
        color: '#fff', // Texte blanc d'origine
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header avec Logo */}
      <Box style={{ 
        textAlign: 'center', 
        padding: '25px 0 20px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Image 
          src={logo} 
          alt="Logo" 
          width={140} 
          mx="auto"
          style={{
            filter: 'brightness(1.1)',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>


      {/* Navigation principale */}
      <Stack spacing={4} style={{ flex: 1, padding: '20px 15px' }}>
        
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.to);
          const IconComponent = item.icon;
          
          return (
            <Box key={item.to} style={{ position: 'relative' }}>
              <NavLink
                label={
                  <Group justify="space-between" style={{ width: '100%' }}>
                    <Text size="sm" weight={isActive ? 600 : 500}>
                      {item.label}
                    </Text>
                    {item.badge && (
                      <Badge 
                        size="xs" 
                        color={isActive ? "#14438b" : "rgba(255,255,255,0.2)"}
                        style={{
                          backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.2)',
                          color: isActive ? '#14438b' : '#fff',
                        }}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Group>
                }
                leftSection={
                  <IconComponent 
                    size={20} 
                    stroke={1.5}
                    style={{ 
                      color: isActive ? '#14438b' : '#fff',
                      transition: 'all 0.2s ease'
                    }} 
                  />
                }
                active={isActive}
                onClick={() => navigate(item.to)}
                style={{
                  borderRadius: 12,
                  margin: '4px 0',
                  padding: '12px 16px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                styles={{
                  root: {
                    backgroundColor: isActive ? '#fff' : 'transparent',
                    color: isActive ? '#14438b' : '#fff',
                    '&:hover': {
                      backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.1)',
                      transform: 'translateX(4px)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: isActive ? '4px' : '0',
                      backgroundColor: '#14438b',
                      transition: 'width 0.3s ease',
                    }
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>

      
      {/* Bouton de déconnexion */}
      <Box style={{ padding: '0 20px 25px 20px' }}>
        <Group
          justify="space-between"
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Text size="sm" weight={500} style={{ color: '#fff' }}>
            Log Out
          </Text>
          <IconLogout 
            size={18} 
            color="#fff" 
            style={{ 
              transition: 'transform 0.2s ease'
            }} 
          />
        </Group>
      </Box>
    </Paper>
  );
}