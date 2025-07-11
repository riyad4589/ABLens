// Ce fichier définit le composant React NewTicketForm.
// Il affiche un formulaire dans une modale pour créer un nouveau ticket avec gestion des champs, priorités et validation.
// Utilisé pour l'ajout de tickets dans l'application.
import React, { useState } from "react";
import "../dashboard.css";
import { MdSave, MdClose } from "react-icons/md";

export default function NewTicketForm({ onClose }) {
  const [priority, setPriority] = useState("NORMAL");
  const [type, setType] = useState("Internal");
  const priorities = [
    { label: "LOW", color: "#b0bed9" },
    { label: "NORMAL", color: "#2176bd" },
    { label: "HIGH", color: "#f7b731" },
    { label: "URGENT", color: "#ff4d4f" },
  ];

  // Ferme la modale si on clique sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose && onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} title="Fermer">
          <MdClose style={{ fontSize: '1.25em', display: 'block', margin: 'auto' }} />
        </button>
        <h2 style={{ marginBottom: 18 }}>New Ticket Information :</h2>
        <form className="ticket-form">
          <div className="form-row">
            <label>Customer<span className="required">*</span></label>
            <input type="text" required />
          </div>
          <div className="form-row">
            <label>Ticket Subject<span className="required">*</span></label>
            <input type="text" required />
          </div>
          <div className="form-row">
            <label>Department<span className="required">*</span></label>
            <select required><option>Support</option></select>
          </div>
          <div className="form-row">
            <label>Motif<span className="required">*</span></label>
            <select required><option>General</option></select>
          </div>
          <div className="form-row priority-row">
            <label>Ticket Priority</label>
            <div className="priority-group">
              {priorities.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  className={`priority-btn${priority === p.label ? " active" : ""}`}
                  style={{ background: priority === p.label ? p.color : "#fff", color: priority === p.label ? "#fff" : p.color, borderColor: p.color }}
                  onClick={() => setPriority(p.label)}
                >
                  {p.label === "HIGH" ? "✔ HIGH" : p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label>Order Number</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Tags<span className="required">*</span></label>
            <input type="text" placeholder="Tag, Tag, ..." required />
          </div>
          <div className="form-row">
            <label>Type<span className="required">*</span></label>
            <select required value={type} onChange={e => setType(e.target.value)}>
              <option>Internal</option>
              <option>External</option>
            </select>
          </div>
          <div className="form-row">
            <label>Source</label>
            <select disabled={type === "Internal"}>
              <option>Phone Call</option>
              <option>Email</option>
              <option>Whats App</option>
            </select>
          </div>
          <div className="form-row">
            <label>Claim<span className="required">*</span></label>
            <textarea required rows={3} />
          </div>
          <div className="form-actions single-action">
            <button type="submit" className="save-btn">
              <MdSave style={{ marginRight: 8, fontSize: '1.3em', verticalAlign: 'middle' }} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 