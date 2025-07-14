// Ce fichier définit le composant React NewTicketForm.
// Il affiche un formulaire dans une modale pour créer un nouveau ticket avec gestion des champs, priorités et validation.
// Utilisé pour l'ajout de tickets dans l'application.
import React, { useState } from "react";
import "../dashboard.css";
import "./NewTicketForm.css";
import { MdSave, MdClose } from "react-icons/md";
import { Select, TextInput, Textarea, SegmentedControl } from '@mantine/core';
import '@mantine/core/styles.css';

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
          <MdClose className="icon-close" />
        </button>
        <h2 className="modal-title">New Ticket Information :</h2>
        <form className="ticket-form">
          <div className="form-row">
            <TextInput
              label="Customer"
              placeholder="Nom du client"
              required
              className="mantine-input"
            />
          </div>
          <div className="form-row">
            <TextInput
              label="Ticket Subject"
              placeholder="Sujet du ticket"
              required
              className="mantine-input"
            />
          </div>
          <div className="form-row">
            <Select
              label="Department"
              placeholder="Choisir un département"
              data={['Support', 'Ventes', 'Technique']}
              required
              className="mantine-select"
              clearable
              checkIconPosition="right"
            />
          </div>
          <div className="form-row">
            <Select
              label="Motif"
              placeholder="Choisir un motif"
              data={['General', 'Facturation', 'Technique']}
              required
              className="mantine-select"
              clearable
              checkIconPosition="right"
            />
          </div>
          <div className="form-row priority-row">
            <label>Ticket Priority</label>
            <SegmentedControl
              fullWidth
              color="blue"
              data={[
                { label: 'LOW', value: 'LOW' },
                { label: 'NORMAL', value: 'NORMAL' },
                { label: 'HIGH', value: 'HIGH' },
                { label: 'URGENT', value: 'URGENT' },
              ]}
              value={priority}
              onChange={setPriority}
              className="mantine-priority"
            />
          </div>
          <div className="form-row">
            <TextInput
              label="Order Number"
              placeholder="Numéro de commande"
              className="mantine-input"
            />
          </div>
          <div className="form-row">
            <TextInput
              label="Tags"
              placeholder="Tag, Tag, ..."
              required
              className="mantine-input"
            />
          </div>
          <div className="form-row">
            <Select
              label="Type"
              placeholder="Choisir un type"
              data={['Internal', 'External']}
              value={type}
              onChange={setType}
              required
              className="mantine-select"
              clearable
              checkIconPosition="right"
            />
          </div>
          <div className="form-row">
            <Select
              label="Source"
              placeholder="Choisir une source"
              data={['Phone Call', 'Email', 'Whats App']}
              disabled={type === 'Internal'}
              className="mantine-select"
              clearable
              checkIconPosition="right"
            />
          </div>
          <div className="form-row">
            <Textarea
              label="Claim"
              placeholder="Décrivez la réclamation"
              required
              minRows={3}
              className="mantine-input"
            />
          </div>
          <div className="form-actions single-action">
            <button type="submit" className="save-btn">
              <MdSave className="icon-save" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 