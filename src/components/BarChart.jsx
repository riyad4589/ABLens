import React from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Title, Group } from "@mantine/core";
import { barChartData } from "../data/mockData"; // Données externes

const COLOR_CLOSED = "#4fc3f7";  // Bleu clair
const COLOR_CREATED = "#174189";   // Bleu foncé

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#fff",
        border: "1.5px solid #ccc",
        borderRadius: 12,
        padding: 14,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        fontSize: 14,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} style={{ color: entry.color, fontWeight: 600 }}>
            ● {entry.name}: <b>{entry.value}</b>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StackedBarChart() {
  return (
    <>
      <Group position="apart" mb="md">
        <Title order={4} fw={600}>
          Tickets Activity
        </Title>
      </Group>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData} barGap={4} barCategoryGap={25}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#555" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />

            <Bar
              dataKey="created"
              name="Tickets Created"
              fill={COLOR_CREATED}
              stackId="a"
            />

            <Bar
              dataKey="closed"
              name="Tickets Closed"
              fill={COLOR_CLOSED}
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
