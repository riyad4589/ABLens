import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const TABS = [
  { key: "roles", label: "Rôles" },
  { key: "permissions", label: "Permissions" },
  { key: "departments", label: "Départements" },
  { key: "users", label: "Utilisateurs" },
];

const TAB_TITLES = {
  roles: "ABLENS - Settings - Rôles",
  permissions: "ABLENS - Settings - Permissions",
  departments: "ABLENS - Settings - Départements",
  users: "ABLENS - Settings - Utilisateurs",
};

function SectionTable({ columns, emptyText }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #2176bd11', padding: 28, minHeight: 220, marginTop: 18 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} style={{ textAlign: 'left', color: '#174189', fontWeight: 700, fontSize: 16, padding: '8px 12px', borderBottom: '2px solid #e0e6ed', background: '#f7f9fb' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} style={{ color: '#b0bed9', textAlign: 'center', padding: 32, fontSize: 16 }}>{emptyText}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState('roles');

  useEffect(() => {
    document.title = TAB_TITLES[tab] || 'ABLENS - Settings';
  }, [tab]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 32, marginLeft: 240 }}>
        <h1 style={{ color: '#174189', fontWeight: 800, fontSize: 28, marginBottom: 24 }}>Paramètres</h1>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? 'linear-gradient(90deg, #2176bd 60%, #174189 100%)' : '#eaf2fb',
                color: tab === t.key ? '#fff' : '#174189',
                border: 'none',
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 17,
                padding: '10px 28px',
                cursor: 'pointer',
                boxShadow: tab === t.key ? '0 2px 12px #2176bd22' : 'none',
                transition: 'all 0.18s',
                outline: tab === t.key ? '2px solid #2176bd33' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'roles' && (
          <SectionTable columns={["Nom du rôle", "Description", "Permissions", "Rôle par défaut", "Actions"]} emptyText="Aucun rôle pour le moment." />
        )}
        {tab === 'permissions' && (
          <SectionTable columns={["Nom", "Code", "Description", "Groupe", "Rôles associés"]} emptyText="Aucune permission pour le moment." />
        )}
        {tab === 'departments' && (
          <SectionTable columns={["Nom du département", "Description", "Statut", "Agents", "Actions"]} emptyText="Aucun département pour le moment." />
        )}
        {tab === 'users' && (
          <SectionTable columns={["Nom", "Email", "Rôle", "Département", "Actif", "Dernière connexion", "Actions"]} emptyText="Aucun utilisateur pour le moment." />
        )}
      </main>
    </div>
  );
} 