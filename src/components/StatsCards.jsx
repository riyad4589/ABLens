import { Card, Group, Text, Title, ThemeIcon, Grid, Badge } from '@mantine/core';
import { IconTicket, IconCirclePlus, IconTicketOff, IconAlertTriangle } from '@tabler/icons-react';

const stats = [
  {
    icon: <IconTicket size={28} />, label: 'Open Tickets', value: 500, color: 'blue',
    diff: '+1.2%', diffColor: 'green', subtitle: 'compared to yesterday',
  },
  {
    icon: <IconCirclePlus size={28} />, label: 'Created Tickets', value: '1200', color: 'teal',
    diff: '+9.2%', diffColor: 'green', subtitle: 'compared to last month',
  },
  {
    icon: <IconTicketOff size={28} />, label: 'Closed Tickets', value: 1000, color: 'gray',
    diff: '-2.6%', diffColor: 'red', subtitle: 'compared to last month',
  },
  {
    icon: <IconAlertTriangle size={28} />, label: 'Urgent Tickets', value: 123, color: 'yellow',
    diff: '+3.2%', diffColor: 'green', subtitle: 'compared to last month',
  },
];

export default function StatsCards() {
  return (
    <Grid gutter={24}>
      {stats.map((stat, idx) => (
        <Grid.Col span={3} key={stat.label}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.18s cubic-bezier(.4,1,.7,1), box-shadow 0.18s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.045)';
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(33,118,189,0.18), 0 0 0 4px #2176bd33';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Group align="flex-start" spacing={16} style={{ width: '100%' }}>
              <ThemeIcon color={stat.color} size={48} radius="md" variant="light">
                {stat.icon}
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={600} style={{ color: '#183153', marginBottom: 2 }}>{stat.label}</Text>
                <Group spacing={8} align="center">
                  <Title order={2} style={{ fontWeight: 700 }}>{stat.value}</Title>
                  <Badge color={stat.diffColor} variant="light" size="md" style={{ fontWeight: 600 }}>{stat.diff}</Badge>
                </Group>
                <Text size="xs" color="dimmed" mt={2}>{stat.subtitle}</Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
} 