// Ce fichier définit le composant React TicketDetailModal.
// Il affiche une modale détaillée pour consulter les informations d'un ticket (priorité, client, timeline, etc.).
// Utilisé pour afficher les détails d'un ticket depuis la liste ou le tableau de tickets.
// TicketDetailModal.jsx
import React from "react";
import '../style/TicketDetailModal.css';

const priorityColors = {
  LOW: "#b0bed9",
  NORMAL: "#2176bd",
  HIGH: "#f7b731",
  URGENT: "#ff4d4f"
};

export default function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className="modal-overlay" onClick={e => {
      if (e.target.classList.contains('modal-overlay')) onClose();
    }}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} title="Fermer">×</button>
        <div className="modal-left">
          <h2 className="modal-title">Ticket N° {ticket.id}</h2>
          <div className="ticket-info-group">
            <div>Created : <b>{ticket.created}</b> <span className="ticket-date">({ticket.date})</span></div>
            <div>Order Number : <b>{ticket.orderNumber}</b></div>
            <div>
              Priority :
              <span
                className="priority-tag"
                style={{ background: priorityColors[ticket.priority] }}
              >
                {ticket.priority}
              </span>
            </div>
            <div>Motif : <b>{ticket.motive}</b></div>
            <div>
              Tags :
              {ticket.tags.map((tag, i) => (
                <span key={i} className="ticket-tag">{tag}</span>
              ))}
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
            <input type="text" placeholder="Type a comment" className="comment-input" />
          </div>
        </div>

        <div className="modal-right">
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

        <button className="close-ticket-btn">Close Ticket</button>
      </div>
    </div>
  );
}
