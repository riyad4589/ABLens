// Ce fichier définit la page Reports de l'application.
// Il sert de base pour l'affichage des rapports et statistiques avancées (actuellement vide).
// Utilisé pour la future extension des rapports dans l'application.
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Reports() {
  useEffect(() => {
    document.title = "ABLENS - Reports";
  }, []);
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Page Reports vide */}
      </main>
    </div>
  );
} 