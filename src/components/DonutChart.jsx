// Ce fichier définit le composant React DonutChart.
// Il affiche un graphique en anneau (donut) pour la répartition des tickets par catégorie avec recharts.
// Contient la gestion du survol, la légende, le total au centre et le tooltip personnalisé.
// Utilisé pour visualiser la répartition des tickets dans le dashboard.
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { pieChartData } from '../data/mockData';

const total = pieChartData.reduce((acc, d) => acc + d.value, 0);

// Couleurs de survol (modifie ici pour personnaliser l'effet hover)
const HOVER_OPACITY = 0.7;

export default function DonutChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  // Affichage de la part en surbrillance
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={HOVER_OPACITY}
        />
      </g>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 48, width: "100%", margin: "32px 0 0 0", minHeight: 240, maxWidth: 900 }}>
      {/* Donut chart */}
      <div style={{ width: 340, minWidth: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PieChart width={340} height={220}>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            startAngle={0}
            endAngle={360}
            innerRadius={68}
            outerRadius={96}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={900}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, idx) => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {pieChartData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} cursor="pointer" />
            ))}
          </Pie>
          {/* Total au centre du donut */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="32"
            fontWeight="bold"
            fill="#174189"
            style={{ textShadow: '0 2px 8px #fff' }}
          >
            {total}
          </text>
          {/* Tooltip au survol */}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              backgroundColor: "#fff",
              border: "1.5px solid #174189",
              fontSize: 14,
              boxShadow: "0 4px 16px rgba(23,65,137,0.12)"
            }}
            labelStyle={{ fontWeight: "bold", color: "#174189" }}
            formatter={(value, name, props) => [`${value}`, props.payload.name]}
          />
        </PieChart>
      </div>

      {/* Légende */}
      <div style={{ minWidth: 180 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, color: "#174189", letterSpacing: 0.5 }}>
          Total Tickets Opened
        </div>
        {pieChartData.map((entry, idx) => (
          <div key={entry.name} style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <div
              style={{
                width: 22,
                height: 22,
                background: entry.color,
                borderRadius: 6,
                marginRight: 14,
                border: "2px solid #f0f0f0",
                boxShadow: activeIndex === idx ? '0 0 0 3px #e0e6ed' : 'none',
                transition: 'box-shadow 0.2s'
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: activeIndex === idx ? entry.color : "#222"
              }}
            >
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
