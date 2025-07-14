// Ce fichier définit la page TicketDetail de l'application.
// Il affiche le détail complet d'un ticket sélectionné, avec timeline, messages, et informations client.
// Utilisé pour consulter et interagir avec un ticket spécifique.
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
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
  const [isClosed, setIsClosed] = useState(ticket.status === 'Fermé');

  if (!ticket) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
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

  const handleCloseTicket = () => {
    setIsClosed(true);
    setTimeout(() => navigate(-1), 400); // Petite pause pour feedback visuel
  };

  // Pour la démo, alterner l'expéditeur entre 'Vous' et 'Agent' selon l'index
  const getSender = (idx) => idx % 2 === 0 ? { name: 'Vous', avatar: 'https://ui-avatars.com/api/?name=Vous&background=2176bd&color=fff' } : { name: 'Agent', avatar: 'https://ui-avatars.com/api/?name=Agent&background=b0bed9&color=fff' };

  return (
    <div className="dashboard-layout" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main className="dashboard-main">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Ticket N° {ticket.id}30</h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(24,49,83,0.08)', cursor: 'pointer' }}
                onClick={handleCloseTicket}
              >
                <MdClose style={{ fontSize: 22 }} />
                {isClosed ? 'Ticket Fermé' : 'Close Ticket'}
                <span style={{ fontSize: 14, marginLeft: 2, marginTop: 2 }}>▼</span>
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: 320 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 10 }}>
                <div>Created : <b>{ticket.created}</b> <span style={{ color: '#888', fontSize: 13, fontWeight: 400 }}>20/04/2024 09:50</span></div>
                <div>Order Number : <b>{ticket.orderNumber}</b></div>
                <div>Priority : <span style={{ background: priorityColors[ticket.priority], color: '#fff', borderRadius: 6, padding: '2px 12px', fontWeight: 600, fontSize: 15, letterSpacing: 1 }}>{ticket.priority}</span></div>
                <div>Motive : <b>{ticket.motive}</b></div>
                <div>Tags: {ticket.tags.map((tag, i) => <span key={i} style={{ background: '#e0e6ed', color: '#174189', borderRadius: 6, padding: '2px 8px', fontWeight: 500, fontSize: 14, marginRight: 6, display: 'inline-block', marginBottom: 2 }}>{tag}</span>)}</div>
                <div>Team : <b>{ticket.team}</b></div>
              </div>
              <div style={{ margin: '24px 0 32px 0', maxWidth: 600 }}>
                <div style={{ background: '#2176bd', color: '#fff', borderRadius: 8, padding: 16, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>
                  <span style={{ fontSize: 22, background: '#174189', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</span>
                  <span style={{ fontWeight: 600 }}>Ticket Claim:</span>
                </div>
                <div style={{ background: '#eaf2fb', borderRadius: 0, padding: 18, fontSize: 15, color: '#174189', fontWeight: 500 }}>{ticket.claim}</div>
              </div>
              {/* Affichage des messages dans une zone scrollable */}
              <div style={{ maxWidth: 600, height: 'calc(32vh - 48px)', minHeight: 80, maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', margin: '0 0 18px 0', background: '#fff', borderRadius: 8, padding: '8px 0' }}>
                {messages.map((msg, idx) => {
                  const sender = getSender(idx);
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#fff', borderRadius: 8, padding: '10px 16px', margin: '0 12px 8px 12px', color: '#174189', fontSize: 15, boxShadow: '0 1px 4px rgba(24,49,83,0.04)' }}>
                      <img src={sender.avatar} alt={sender.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #e0e6ed' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#2176bd', marginBottom: 2 }}>{sender.name}</div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
             </div>
            <div style={{ flex: 1, minWidth: 260, borderLeft: '1.5px solid #e0e6ed', paddingLeft: 24 }}>
              {/* Timeline verticale en haut */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#2176bd', marginBottom: 18 }}>Timeline</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', marginLeft: 12 }}>
                  {ticket.timeline.map((event, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: 24 }}>
                      {/* Ligne verticale */}
                      <div style={{ width: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: idx === 0 ? '#2176bd' : '#b0bed9', border: '2px solid #fff', boxShadow: '0 0 0 2px #2176bd22' }} />
                        {idx < ticket.timeline.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: '#e0e6ed', margin: '2px 0 0 5px' }} />
                        )}
                      </div>
                      <div style={{ marginLeft: 8, flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#2176bd', fontSize: 15, marginBottom: 2 }}>{event.text}</div>
                        <div style={{ color: '#555', fontSize: 14, marginBottom: 2 }}>{event.detail}</div>
                        <div style={{ color: '#b0bed9', fontSize: 13 }}>{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Client Info en dessous */}
              <div style={{ marginTop: 12 }}>
                <div style={{ color: '#174189', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Client Info:</div>
                <div style={{ color: '#222', fontSize: 15, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><FaStore style={{ fontSize: 16 }} /><b style={{ marginLeft: 4 }}>Store Name:</b> {ticket.client.name}</div>
                <div style={{ color: '#222', fontSize: 15, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><FaCity style={{ fontSize: 16 }} /><b style={{ marginLeft: 4 }}>City:</b> {ticket.client.city}</div>
                <div style={{ color: '#222', fontSize: 15, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><FaPhone style={{ fontSize: 16 }} /><b style={{ marginLeft: 4 }}>Phone:</b> {ticket.client.phone}</div>
                <div style={{ color: '#222', fontSize: 15, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><FaMapMarkerAlt style={{ fontSize: 16 }} /><b style={{ marginLeft: 4 }}>Address:</b> {ticket.client.address}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Barre de commentaire en bas du contenu, pas en fixed */}
        <form
          onSubmit={handleSend}
          style={{
            background: '#fff',
            padding: '12px 0 0 0',
            marginTop: 24,
            borderTop: '1.5px solid #e0e6ed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: 600,
            width: '100%',
          }}
        >
          <input
            type="text"
            placeholder="type a comment"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ flex: 1, border: '1.5px solid #e0e6ed', borderRadius: 6, padding: 10, fontSize: 15 }}
          />
          <button type="submit" style={{ background: '#2176bd', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            Envoyer
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M2 21l21-9-21-9v7l15 2-15 2v7z"/></svg>
          </button>
        </form>
      </main>
    </div>
  );
} 