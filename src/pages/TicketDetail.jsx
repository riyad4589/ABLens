import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
import "../style/TicketDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaStore, FaCity, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

// Données mockées (à factoriser si besoin)
const tickets = [
  { id: 1, subject: "Problème de connexion", customer: "Jean Dupont", status: "Ouvert", priority: "HIGH", date: "2024-06-01", created: "2 Hours ago", orderNumber: "N/A", motive: "RETARD DE LIVRAISON", tags: ["Tag", "Tag", "Tag"], team: "LOGISTICS", claim: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et . consectetur adipiscing elit, sed", client: { name: "Skyonode", city: "Palayan City", phone: "212-171-876-636", address: "844 Morris Park avenue" }, timeline: [{ text: "Ticket Created", detail: "Agent : Sara Doe created ticket for Client John doe", time: "2 hours ago" }] },
  { id: 2, subject: "Erreur de paiement", customer: "Sophie Martin", status: "Fermé", priority: "NORMAL", date: "2024-06-02", created: "1 day ago", orderNumber: "N/A", motive: "PAIEMENT", tags: ["Tag", "Tag"], team: "SUPPORT", claim: "Problème de paiement sur la commande #1234.", client: { name: "Shopcity", city: "Paris", phone: "01 23 45 67 89", address: "12 rue de Paris" }, timeline: [{ text: "Ticket Closed", detail: "Agent : Paul a fermé le ticket", time: "10 hours ago" }] },
  { id: 3, subject: "Demande d'information", customer: "Ali Ben", status: "En attente", priority: "LOW", date: "2024-06-03", created: "3 days ago", orderNumber: "N/A", motive: "INFO", tags: ["Tag"], team: "SUPPORT", claim: "Demande d'information sur le produit.", client: { name: "InfoStore", city: "Lyon", phone: "04 56 78 90 12", address: "34 avenue des Infos" }, timeline: [{ text: "Ticket Created", detail: "Agent : Alice a créé le ticket", time: "3 days ago" }] },
  { id: 4, subject: "Bug application", customer: "Fatima Zahra", status: "Ouvert", priority: "URGENT", date: "2024-06-04", created: "1 hour ago", orderNumber: "N/A", motive: "BUG", tags: ["Tag", "Urgent"], team: "DEV", claim: "Bug critique sur l'application mobile.", client: { name: "AppCorp", city: "Marseille", phone: "06 12 34 56 78", address: "56 rue du Code" }, timeline: [{ text: "Ticket Created", detail: "Agent : Karim a créé le ticket", time: "1 hour ago" }] },
];

const priorityColors = {
  LOW: "#b0bed9",
  NORMAL: "#2176bd",
  HIGH: "#f7b731",
  URGENT: "#ff4d4f"
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = tickets.find(t => String(t.id) === String(id));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  if (!ticket) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main dashboard-center-content">
        <div>Ticket introuvable</div>
      </main>
    </div>
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, date: new Date() }]);
      setInput("");
    }
  };

  // Pour la démo, alterner l'expéditeur entre 'Vous' et 'Agent' selon l'index
  const getSender = (idx) => idx % 2 === 0 ? { name: 'Vous', avatar: 'https://ui-avatars.com/api/?name=Vous&background=2176bd&color=fff' } : { name: 'Agent', avatar: 'https://ui-avatars.com/api/?name=Agent&background=b0bed9&color=fff' };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main dashboard-detail-main">
        <div>
          <div className="ticketdetail-header">
            <h1 className="ticketdetail-title">Ticket N° {ticket.id}</h1>
            <div className="ticketdetail-header-actions">
              <button className="ticketdetail-close-btn" onClick={() => {/* action close ticket */}}><MdClose className="ticketdetail-close-icon" /> Close Ticket <span className="ticketdetail-close-arrow">▼</span></button>
              <button className="ticketdetail-return-btn" onClick={() => navigate('/tickets')} title="Retour à la liste des tickets">
                <MdClose />
              </button>
            </div>
          </div>
          <div className="ticketdetail-content">
            <div className="ticketdetail-main">
              <div className="ticketdetail-infos">
                <div>Created : <b>{ticket.created}</b> <span className="ticketdetail-date">20/04/2024 09:50</span></div>
                <div>Order Number : <b>{ticket.orderNumber}</b></div>
                <div>Priority : <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></div>
                <div>Motive : <b>{ticket.motive}</b></div>
                <div>Tags: {ticket.tags.map((tag, i) => <span key={i} className="ticket-tag ticketdetail-tag">{tag}</span>)}</div>
                <div>Team : <b>{ticket.team}</b></div>
              </div>
              <div className="ticket-claim-block">
                <div className="ticket-claim-header">
                  <span className="ticket-claim-icon">✉️</span>
                  <span className="ticket-claim-label">Ticket Claim:</span>
                </div>
                <div className="ticket-claim-content ticketdetail-claim-content">{ticket.claim}</div>
              </div>
              {/* Affichage des messages dans une zone scrollable */}
              <div className="ticketdetail-messages">
                {messages.map((msg, idx) => {
                  const sender = getSender(idx);
                  return (
                    <div key={idx} className="ticketdetail-message">
                      <img src={sender.avatar} alt={sender.name} className="ticketdetail-message-avatar" />
                      <div>
                        <div className="ticketdetail-message-sender">{sender.name}</div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="ticketdetail-side">
              {/* Timeline verticale en haut */}
              <div className="ticketdetail-timeline-block">
                <div className="ticketdetail-timeline-title">Timeline</div>
                <div className="ticketdetail-timeline-list">
                  {ticket.timeline.map((event, idx) => (
                    <div key={idx} className="ticketdetail-timeline-event">
                      {/* Ligne verticale */}
                      <div className="ticketdetail-timeline-dotcol">
                        <div className={`ticketdetail-timeline-dot${idx === 0 ? ' ticketdetail-timeline-dot-active' : ''}`}></div>
                        {idx < ticket.timeline.length - 1 && (
                          <div className="ticketdetail-timeline-connector" />
                        )}
                      </div>
                      <div className="ticketdetail-timeline-event-content">
                        <div className="ticketdetail-timeline-event-title">{event.text}</div>
                        <div className="ticketdetail-timeline-event-detail">{event.detail}</div>
                        <div className="ticketdetail-timeline-event-time">{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Client Info en dessous */}
              <div className="ticketdetail-client-block">
                <div className="ticket-client-header">Client Info:</div>
                <div className="ticketdetail-client-info"><FaStore className="ticketdetail-client-icon" /><b>Store Name:</b> {ticket.client.name}</div>
                <div className="ticketdetail-client-info"><FaCity className="ticketdetail-client-icon" /><b>City:</b> {ticket.client.city}</div>
                <div className="ticketdetail-client-info"><FaPhone className="ticketdetail-client-icon" /><b>Phone:</b> {ticket.client.phone}</div>
                <div className="ticketdetail-client-info"><FaMapMarkerAlt className="ticketdetail-client-icon" /><b>Address:</b> {ticket.client.address}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Barre de commentaire en bas du contenu, pas en fixed */}
        <form
          onSubmit={handleSend}
          className="ticketdetail-form"
        >
          <input
            type="text"
            placeholder="type a comment"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="ticketdetail-form-input"
          />
          <button type="submit" className="ticketdetail-form-btn">
            Envoyer
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M2 21l21-9-21-9v7l15 2-15 2v7z"/></svg>
          </button>
        </form>
      </main>
    </div>
  );
} 