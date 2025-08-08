// Ce fichier définit la page Settings de l'application.
// Il affiche les paramètres (rôles, permissions, départements, utilisateurs) avec navigation par onglets.
// Utilisé pour la gestion des paramètres administratifs de l'application.
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Tabs,
  Table,
  Title,
  Button,
  Group,
  Box,
  Text,
  Center,
  ThemeIcon,
} from '@mantine/core';
import { IconUserCog, IconKey, IconBuilding, IconUsers, IconPlus } from '@tabler/icons-react';

// =====================
// Styles séparés
// =====================
const mainStyle = {
  marginLeft: 260,
  padding: '32px 40px 32px 40px',
  background: '#fff',
  minHeight: '100vh',
  borderRadius: '0 0 0 32px',
  boxShadow: '0 2px 16px rgba(24,49,83,0.06)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 24,
};

const addButtonStyle = {
  marginBottom: 18,
};

const emptyBoxStyle = {
  color: '#b0bed9',
  textAlign: 'center',
  padding: 32,
  fontSize: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};

// =====================
// Données des onglets
// =====================
const TABS = [
  { key: "roles", label: "Rôles", icon: IconUserCog },
  { key: "permissions", label: "Permissions", icon: IconKey },
  { key: "departments", label: "Départements", icon: IconBuilding },
  { key: "users", label: "Utilisateurs", icon: IconUsers },
];

const TAB_TITLES = {
  roles: "ABLENS - Settings - Rôles",
  permissions: "ABLENS - Settings - Permissions",
  departments: "ABLENS - Settings - Départements",
  users: "ABLENS - Settings - Utilisateurs",
};

const ADD_LABELS = {
  roles: "Ajouter un rôle",
  permissions: "Ajouter une permission",
  departments: "Ajouter un département",
  users: "Ajouter un utilisateur",
};

const TABLE_COLUMNS = {
  roles: ["Nom du rôle", "Description", "Permissions", "Rôle par défaut", "Actions"],
  permissions: ["Nom", "Code", "Description", "Groupe", "Rôles associés"],
  departments: ["Nom du département", "Description", "Statut", "Agents", "Actions"],
  users: ["Nom", "Email", "Rôle", "Département", "Actif", "Dernière connexion", "Actions"],
};

const EMPTY_TEXT = {
  roles: "Aucun rôle pour le moment.",
  permissions: "Aucune permission pour le moment.",
  departments: "Aucun département pour le moment.",
  users: "Aucun utilisateur pour le moment.",
};

// =====================
// Composant Table Section
// =====================
function SectionTable({ columns, emptyText }) {
  return (
    <Table striped withTableBorder withColumnBorders highlightOnHover>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={columns.length} style={{ padding: 0 }}>
            <Box style={emptyBoxStyle}>
              <IconUsers size={38} stroke={1.2} />
              <span>{emptyText}</span>
              <Text size="sm" color="#a0aec0">Commencez par ajouter une nouvelle entrée.</Text>
            </Box>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

// =====================
// Composant principal Settings
// =====================
export default function Settings() {
  const [tab, setTab] = useState('roles');

  // Mise à jour du titre de la page selon l'onglet actif
  React.useEffect(() => {
    document.title = TAB_TITLES[tab] || 'ABLENS - Settings';
  }, [tab]);

  const TabIcon = TABS.find(t => t.key === tab)?.icon || IconUserCog;

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
      <Sidebar />
      <main style={mainStyle}>
        {/* En-tête avec icône et titre */}
        <div style={headerStyle}>
          <ThemeIcon color="blue" size={38} radius="md" variant="light">
            <TabIcon size={26} />
          </ThemeIcon>
          <Title order={2} style={{ fontWeight: 700, fontSize: 28 }}>Paramètres</Title>
        </div>

        {/* Onglets avec icônes */}
        <Tabs value={tab} onChange={setTab} variant="outline">
          <Tabs.List>
            {TABS.map(t => (
              <Tabs.Tab value={t.key} key={t.key} icon={<t.icon size={18} />}>{t.label}</Tabs.Tab>
            ))}
          </Tabs.List>
          {TABS.map(t => (
            <Tabs.Panel value={t.key} key={t.key}>
              <Group position="right" mb={12} mt={18}>
                <Button
                  leftIcon={<IconPlus size={18} />}
                  color="blue"
                  style={addButtonStyle}
                  variant="filled"
                >
                  {ADD_LABELS[t.key]}
                </Button>
              </Group>
              <SectionTable columns={TABLE_COLUMNS[t.key]} emptyText={EMPTY_TEXT[t.key]} />
            </Tabs.Panel>
          ))}
        </Tabs>
      </main>
    </div>
  );
} 