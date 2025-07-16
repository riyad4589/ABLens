import React, { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip,
} from "recharts";
import { pieChartData } from '../data/mockData';
import {
  Title, Group, Text, Stack, Box, Center,
} from '@mantine/core';

const total = pieChartData.reduce((acc, d) => acc + d.value, 0);
const HOVER_OPACITY = 0.7;

const styles = {
  containerBox: {
    width: 350,
    height: 250,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipContent: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    border: "1.5px solid #174189",
    fontSize: 13,
    boxShadow: "0 4px 16px rgba(23,65,137,0.12)",
    padding: 8,
  },
  tooltipLabel: {
    fontWeight: 600,
    color: "#174189",
  },
  legendDot: (color, isActive) => ({
    width: 18,
    height: 18,
    background: color,
    borderRadius: 4,
    border: "2px solid #ffffff",
    boxShadow: isActive ? `0 0 0 3px ${color}66` : '0 0 0 1px #ccc',
    transition: 'box-shadow 0.2s',
  }),
  centerBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    textAlign: 'center',
  },
  totalText: {
    fontWeight: 700,
    color: '#183153',
    fontSize: 28,
  },
  groupWrapper: {
    width: '100%',
    maxWidth: 600,
  }
};

export default function DonutChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  const renderActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) => (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 2}
      outerRadius={outerRadius + 8} // un peu plus grand à l'hover
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      opacity={HOVER_OPACITY}
    />
  );

  return (
    <Group align="center" spacing="xl" noWrap style={styles.groupWrapper} direction="column">
      <Title order={4} fw={600} mb="md">
        Total Tickets Opened
      </Title>

      <Group align="center" spacing="xl" noWrap>
        <Box style={styles.containerBox}>
          <ResponsiveContainer width={300} height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                startAngle={0}
                endAngle={360}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
                isAnimationActive
                animationDuration={800}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {pieChartData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.color}
                    cursor="pointer"
                    style={{ transition: 'all 0.3s ease-in-out' }}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={styles.tooltipContent}
                labelStyle={styles.tooltipLabel}
                formatter={(value, name, props) => [`${value}`, props.payload.name]}
              />
            </PieChart>
          </ResponsiveContainer>

          <Center style={styles.centerBox}>
            <Box>
              <Text size="xs" color="gray" fw={500} mb={-4}>Total</Text>
              <Title order={2} style={styles.totalText}>
                {total}
              </Title>
            </Box>
          </Center>
        </Box>

        <Stack spacing="md" style={{ minWidth: 180 }}>
          {pieChartData.map((entry, idx) => (
            <Group key={entry.name} spacing={12} align="center">
              <div style={styles.legendDot(entry.color, activeIndex === idx)} />
              <Text
                size="sm"
                fw={activeIndex === idx ? 600 : 500}
                color={activeIndex === idx ? entry.color : "#333"}
              >
                {entry.name}
              </Text>
            </Group>
          ))}
        </Stack>
      </Group>
    </Group>
  );
}
