// Ce fichier définit la page TicketDetail de l'application.
// Il affiche le détail complet d'un ticket sélectionné, avec timeline, messages, et informations client.
// Utilisé pour consulter et interagir avec un ticket spécifique.
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaStore, FaCity, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { TextInput, Button, Badge, Group } from '@mantine/core';
import { tickets } from '../data/mockTickets';

const priorityColors = {
  LOW: 'blue',
  NORMAL: 'indigo',
  HIGH: 'yellow',
  URGENT: 'red',
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = tickets.find(t => String(t.id) === String(id));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isClosed, setIsClosed] = useState(ticket.status === 'Fermé');

  if (!ticket) return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, padding: '32px 40px', background: '#fff', minHeight: '100vh', borderRadius: '0 0 0 32px', boxShadow: '0 2px 16px rgba(24,49,83,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, padding: '32px 40px', background: '#fff', minHeight: '100vh', borderRadius: '0 0 0 32px', boxShadow: '0 2px 16px rgba(24,49,83,0.06)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Ticket N° {ticket.id}</h1>
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
                <div>Priority : <Badge color={priorityColors[ticket.priority]}>{ticket.priority}</Badge></div>
                <div>Motive : <b>{ticket.motive}</b></div>
                <div>Tags: {ticket.tags.map((tag, i) => <Badge key={i} color="gray" variant="light" mr={6}>{tag}</Badge>)}</div>
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
          <TextInput
            placeholder="type a comment"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="submit" color="blue" style={{ fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 6 }}>
            Envoyer
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M2 21l21-9-21-9v7l15 2-15 2v7z"/></svg>
          </Button>
        </form>
      </main>
    </div>
  );
} 