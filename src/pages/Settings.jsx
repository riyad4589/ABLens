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
  Modal,
  Select,
  Stack,
  Alert,
} from '@mantine/core';
import { IconUserCog, IconKey, IconBuilding, IconUsers, IconPlus } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import apiService from '../services/api';

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
  { key: "users", label: "Utilisateurs", icon: IconUsers },
  { key: "assignment", label: "Affectation", icon: IconBuilding },
];

const TAB_TITLES = {
  roles: "ABLENS - Settings - Rôles",
  permissions: "ABLENS - Settings - Permissions",
  users: "ABLENS - Settings - Utilisateurs",
  assignment: "ABLENS - Settings - Affectation",
};

const ADD_LABELS = {
  roles: "Ajouter un rôle",
  permissions: "Ajouter une permission",
  users: "Ajouter un utilisateur",
  assignment: "Configurer la stratégie",
};

const TABLE_COLUMNS = {
  roles: ["Nom du rôle", "Description", "Permissions", "Rôle par défaut", "Actions"],
  permissions: ["Nom", "Code", "Description", "Groupe", "Rôles associés"],
  users: ["Nom", "Email", "Rôle", "Département", "Actif", "Dernière connexion", "Actions"],
  assignment: ["Département", "Stratégie d'affectation", "Description", "Actions"],
};

const EMPTY_TEXT = {
  roles: "Aucun rôle pour le moment.",
  permissions: "Aucune permission pour le moment.",
  users: "Aucun utilisateur pour le moment.",
  assignment: "Aucune configuration d'affectation pour le moment.",
};

// =====================
// Composant Table Section
// =====================
function SectionTable({ columns, emptyText, activeTab, onEditStrategy, roles, rolesLoading, rolesError }) {
  // Données mockées pour l'affectation
  const assignmentData = [
    { 
      department: "Production Team", 
      strategy: "Round-Robin", 
      description: "Affectation alternée entre les agents du département"
    },
    { 
      department: "Customer Service", 
      strategy: "Least-Busy", 
      description: "Affectation à l'agent ayant le moins de tickets en cours"
    }
  ];

  // Affichage des rôles
  if (activeTab === 'roles' && roles && roles.length > 0) {
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
          {roles.map((role) => (
            <tr key={role.id}>
              <td>
                <div>
                  <div style={{ fontWeight: 600, color: '#183153' }}>{role.name}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{role.description}</div>
                </div>
              </td>
              <td>{role.description}</td>
              <td>
                <Group gap={4}>
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.slice(0, 3).map((permission, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#eaf2fa',
                          color: '#2176bd',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 500
                        }}
                      >
                        {permission}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#6c757d', fontSize: '12px' }}>Aucune permission</span>
                  )}
                  {role.permissions && role.permissions.length > 3 && (
                    <span style={{ color: '#6c757d', fontSize: '11px' }}>
                      +{role.permissions.length - 3} autres
                    </span>
                  )}
                </Group>
              </td>
              <td>
                <span style={{
                  background: role.isDefault ? '#eafaf3' : '#f4f6fb',
                  color: role.isDefault ? '#1ecb7b' : '#b0bed9',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {role.isDefault ? 'Oui' : 'Non'}
                </span>
              </td>
              <td>
                <Group gap={8}>
                  <Button size="xs" variant="outline" color="blue">
                    Modifier
                  </Button>
                  <Button 
                    size="xs" 
                    variant="outline" 
                    color={role.enabled ? "red" : "green"}
                  >
                    {role.enabled ? 'Désactiver' : 'Activer'}
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (activeTab === 'assignment' && assignmentData.length > 0) {
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
          {assignmentData.map((item, index) => (
            <tr key={index}>
              <td>{item.department}</td>
              <td>
                <span style={{
                  background: item.strategy === 'Round-Robin' ? '#eaf2fa' : '#fffbe6',
                  color: item.strategy === 'Round-Robin' ? '#2176bd' : '#f7b731',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  {item.strategy}
                </span>
              </td>
              <td>{item.description}</td>
              <td>
                {activeTab === 'assignment' && onEditStrategy ? (
                  <Button 
                    size="xs" 
                    variant="outline" 
                    color="blue"
                    onClick={() => {
                      onEditStrategy(item);
                    }}
                  >
                    Modifier
                  </Button>
                ) : (
                  <Button 
                    size="xs" 
                    variant="outline" 
                    color="blue"
                    disabled
                  >
                    Modifier
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

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
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);

  // Mise à jour du titre de la page selon l'onglet actif
  React.useEffect(() => {
    document.title = TAB_TITLES[tab] || 'ABLENS - Settings';
  }, [tab]);

  // Charger les rôles quand l'onglet roles est activé
  React.useEffect(() => {
    if (tab === 'roles') {
      loadRoles();
    }
  }, [tab]);

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      setRolesError(null);
      const rolesData = await apiService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      setRolesError(error.message);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  const TabIcon = TABS.find(t => t.key === tab)?.icon || IconUserCog;

  /**
   * Ouvre le modal de modification de stratégie d'affectation
   * @param {Object} department - Département à modifier
   */
  const handleEditStrategy = (department) => {
    setEditingDepartment(department);
    setSelectedStrategy(department.strategy === 'Round-Robin' ? 'roundRobin' : 'leastBusy');
    setShowStrategyModal(true);
    setError(null);
  };

  /**
   * Ferme le modal de modification de stratégie
   */
  const handleCloseStrategyModal = () => {
    setShowStrategyModal(false);
    setEditingDepartment(null);
    setSelectedStrategy('');
    setError(null);
  };

  // Fonction pour sauvegarder la stratégie
  const handleSaveStrategy = async () => {
    if (!selectedStrategy) {
      setError('Veuillez sélectionner une stratégie');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Appeler l'API pour mettre à jour la stratégie
      await apiService.updateAssignmentStrategy(selectedStrategy);
      
      // Fermer le modal et recharger les données si nécessaire
      handleCloseStrategyModal();
      
      // Afficher une notification de succès
      showNotification({
        title: 'Succès',
        message: `Stratégie mise à jour pour ${editingDepartment?.department}: ${selectedStrategy === 'roundRobin' ? 'Round-Robin' : 'Least-Busy'}`,
        color: 'green',
      });
      
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour de la stratégie');
    } finally {
      setLoading(false);
    }
  };

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
              
              {/* Affichage des erreurs pour les rôles */}
              {t.key === 'roles' && rolesError && (
                <Alert color="red" title="Erreur" mb={16}>
                  {rolesError}
                </Alert>
              )}
              
              {/* Affichage du chargement pour les rôles */}
              {t.key === 'roles' && rolesLoading ? (
                <Box style={emptyBoxStyle}>
                  <Text>Chargement des rôles...</Text>
                </Box>
              ) : (
                <SectionTable 
                  columns={TABLE_COLUMNS[t.key]} 
                  emptyText={EMPTY_TEXT[t.key]} 
                  activeTab={t.key} 
                  onEditStrategy={handleEditStrategy}
                  roles={roles}
                  rolesLoading={rolesLoading}
                  rolesError={rolesError}
                />
              )}
            </Tabs.Panel>
          ))}
        </Tabs>

        {/* Modal pour modifier la stratégie d'affectation */}
        <Modal
          opened={showStrategyModal}
          onClose={handleCloseStrategyModal}
          title="Modifier la stratégie d'affectation"
          size="md"
          centered
        >
          <Stack spacing="md">
            {error && (
              <Alert color="red" title="Erreur">
                {error}
              </Alert>
            )}
            
            <Text size="sm" color="dimmed">
              Département : <strong>{editingDepartment?.department}</strong>
            </Text>
            
            <Select
              label="Stratégie d'affectation"
              placeholder="Choisir une stratégie"
              data={[
                { value: 'roundRobin', label: 'Round-Robin - Affectation alternée entre les agents' },
                { value: 'leastBusy', label: 'Least-Busy - Affectation à l\'agent ayant le moins de tickets' }
              ]}
              value={selectedStrategy}
              onChange={setSelectedStrategy}
              required
            />
            
            <Group position="right" mt="md">
              <Button variant="outline" onClick={handleCloseStrategyModal}>
                Annuler
              </Button>
              <Button 
                color="blue" 
                onClick={handleSaveStrategy}
                loading={loading}
              >
                Sauvegarder
              </Button>
            </Group>
          </Stack>
        </Modal>
      </main>
    </div>
  );
} 