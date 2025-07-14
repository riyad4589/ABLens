// Ce fichier définit le composant React CustomBarChart.
// Il affiche un graphique en barres (tickets créés/fermés par jour) avec la bibliothèque recharts.
// Contient la configuration des couleurs, des données de test, un tooltip personnalisé et la légende.
// Utilisé pour visualiser les statistiques de tickets dans le dashboard.
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList
} from "recharts";

// =====================
// Données du graphique (modifie ici)
// =====================
const data = [
  { name: "April 01", created: 1200, closed: 800 },
  { name: "April 02", created: 700, closed: 400 },
  { name: "April 03", created: 1500, closed: 900 },
  { name: "April 04", created: 1100, closed: 700 },
  { name: "April 05", created: 1700, closed: 1200 },
  { name: "April 06", created: 800, closed: 500 },
];

// =====================
// Couleurs personnalisables
// =====================
const COLOR_CREATED = "#174189"; // Couleur principale (harmonie avec sidebar)
const COLOR_CLOSED = "#4fc3f7"; // Couleur secondaire
const BAR_HOVER_SHADOW = "0 8px 32px 0 rgba(33,118,189,0.18), 0 0 0 4px #2176bd33";

// =====================
// Tooltip customisé
// =====================
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1.5px solid #2176bd',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 4px 24px rgba(33,118,189,0.10)',
        fontSize: 16,
        minWidth: 180
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: '#174189', fontSize: 17 }}>{label}</div>
        <div style={{ color: COLOR_CREATED, fontWeight: 600, marginBottom: 4 }}>
          ● Tickets Closed : <b>{payload[1]?.value}</b>
        </div>
        <div style={{ color: COLOR_CLOSED, fontWeight: 600 }}>
          ● Tickets Created : <b>{payload[0]?.value}</b>
        </div>
      </div>
    );
  }
  return null;
};

function CustomBarChart() {
  // Pour gérer l'animation de survol, on garde l'index ET la série survolée
  const [hoveredBar, setHoveredBar] = useState(null); // { index, key } ou null

  // Moyennes calculées (modifie ici si tu veux des valeurs fixes)
  const avgCreated = Math.round(data.reduce((acc, d) => acc + d.created, 0) / data.length);
  const avgClosed = Math.round(data.reduce((acc, d) => acc + d.closed, 0) / data.length);

  // Fonction pour appliquer le style animé sur la barre survolée
  const getBarStyle = (index, key, color) => {
    return {
      fill: color,
      cursor: "pointer"
    };
  };

  return (
    <div style={{ display: "flex", borderRadius: 8, boxShadow: "none", padding: 0, alignItems: "center", width: "100%", maxWidth: 2000, minHeight: 220 }}>
      {/* Légende verticale à gauche */}
      <div style={{ minWidth: 140, display: "flex", flexDirection: "column", gap: 24, marginLeft: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 18, height: 18, background: COLOR_CREATED, borderRadius: 4 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#174189" }}>Tickets Closed</div>
            <div style={{ fontSize: 15, color: "#222", fontWeight: 400 }}>Avg: {avgCreated}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 18, height: 18, background: COLOR_CLOSED, borderRadius: 4 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#2176bd" }}>Tickets Created</div>
            <div style={{ fontSize: 15, color: "#222", fontWeight: 400 }}>Avg: {avgClosed}</div>
          </div>
        </div>
      </div>
      {/* BarChart */}
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 10 }}>
        <BarChart width={600} height={260} data={data} barGap={6} barCategoryGap={30}>
          <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 13, fill: "#bbb" }} axisLine={false} tickLine={false} />
          {/* Barres empilées, pas d'arrondi, pas de label, pas d'effet hover */}
          <Bar
            dataKey="created"
            stackId="a"
            fill={COLOR_CREATED}
            radius={[0, 0, 0, 0]}
            maxBarSize={50}
            name="Tickets Closed"
            onMouseOver={undefined}
            onMouseOut={undefined}
            shape={props => <rect {...props} style={getBarStyle(props.index, 'created', COLOR_CREATED)} />} />
          <Bar
            dataKey="closed"
            stackId="a"
            fill={COLOR_CLOSED}
            radius={[8, 8, 0, 0]}
            maxBarSize={38}
            name="Tickets Created"
            onMouseOver={undefined}
            onMouseOut={undefined}
            shape={props => <rect {...props} style={getBarStyle(props.index, 'closed', COLOR_CLOSED)} />} />
        </BarChart>
      </div>
    </div>
  );
}

export default CustomBarChart;