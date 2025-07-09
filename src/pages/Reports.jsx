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