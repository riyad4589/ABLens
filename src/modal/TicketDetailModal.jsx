// Ce fichier définit le composant React TicketDetailModal.
// Il affiche une modale détaillée pour consulter les informations d'un ticket (priorité, client, timeline, etc.).
// Utilisé pour afficher les détails d'un ticket depuis la liste ou le tableau de tickets.
// TicketDetailModal.jsx
import React from "react";
import { Modal, Button, Badge, TextInput, Group, Title, TagsInput } from '@mantine/core';

const priorityColors = {
  LOW: "blue",
  NORMAL: "indigo",
  HIGH: "yellow",
  URGENT: "red"
};

export default function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <Modal
      opened={!!ticket}
      onClose={onClose}
      title={<Title order={3}>Ticket N° {ticket.id}</Title>}
      size="xl"
      overlayProps={{ opacity: 0.55, blur: 3 }}
      centered
    >
      <Group align="flex-start" noWrap>
        <div className="modal-left" style={{ flex: 1 }}>
          <Group mb="md">
            <Badge color={priorityColors[ticket.priority]} size="lg">
              {ticket.priority}
            </Badge>
            <Badge color="gray" variant="light">Order: {ticket.orderNumber}</Badge>
          </Group>
          <div className="ticket-info-group">
            <div>Created : <b>{ticket.created}</b> <span className="ticket-date">({ticket.date})</span></div>
            <div>Motif : <b>{ticket.motive}</b></div>
            <div>
              Tags :
              <TagsInput
                value={ticket.tags}
                disabled
                readOnly
                className="mantine-tagsinput"
                label={null}
                placeholder=""
                style={{ marginLeft: 6, marginTop: 4, maxWidth: 320 }}
              />
            </div>
            <div>Team : <b>{ticket.team}</b></div>
          </div>

          <div className="claim-section">
            <div className="claim-header">
              <span className="claim-icon">✉️</span>
              <span>Ticket Claim:</span>
            </div>
            <div className="claim-content">{ticket.claim}</div>
          </div>

          <div className="comment-section">
            <TextInput placeholder="Type a comment" className="comment-input" />
          </div>
        </div>

        <div className="modal-right" style={{ flex: 1 }}>
          <div className="timeline-block">
            <div className="timeline-title">
              <span className="timeline-icon">🛈</span>
              Ticket Created
            </div>
            <div className="timeline-detail">{ticket.timeline[0]?.detail}</div>
            <div className="timeline-time">{ticket.timeline[0]?.time}</div>
          </div>

          <div className="client-info-block">
            <div className="client-title">Client Info:</div>
            <div><b>Store Name:</b> {ticket.client.name}</div>
            <div><b>City:</b> {ticket.client.city}</div>
            <div><b>Phone:</b> {ticket.client.phone}</div>
            <div><b>Address:</b> {ticket.client.address}</div>
          </div>
        </div>
      </Group>
      <Group mt="xl" position="right">
        <Button variant="default" onClick={onClose}>Fermer</Button>
        <Button color="red">Close Ticket</Button>
      </Group>
    </Modal>
  );
}
