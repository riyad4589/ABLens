// Ce fichier définit le composant React NewTicketForm.
// Il affiche un formulaire dans une modale pour créer un nouveau ticket avec gestion des champs, priorités et validation.
// Utilisé pour l'ajout de tickets dans l'application.
import React, { useState } from "react";
import { MdSave, MdClose } from "react-icons/md";
import { Select, TextInput, Textarea, SegmentedControl, TagsInput, Modal, Button, Group, Title } from '@mantine/core';
import '@mantine/core/styles.css';

export default function NewTicketForm({ onClose }) {
  const [priority, setPriority] = useState("NORMAL");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const priorities = [
    { label: "LOW", color: "#b0bed9" },
    { label: "NORMAL", color: "#2176bd" },
    { label: "HIGH", color: "#f7b731" },
    { label: "URGENT", color: "#ff4d4f" },
  ];

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<Title order={3}>Nouveau ticket</Title>}
      size="lg"
      overlayProps={{ opacity: 0.55, blur: 3 }}
      centered
    >
      <form className="ticket-form">
        <Group grow mb="md">
          <TextInput
            label="Customer"
            placeholder="Nom du client"
            required
            className="mantine-input"
          />
          <TextInput
            label="Ticket Subject"
            placeholder="Sujet du ticket"
            required
            className="mantine-input"
          />
        </Group>
        <Group grow mb="md">
          <Select
            label="Department"
            placeholder="Choisir un département"
            data={['Support', 'Ventes', 'Technique']}
            required
            className="mantine-select"
            clearable
            checkIconPosition="right"
          />
          <Select
            label="Motif"
            placeholder="Choisir un motif"
            data={['General', 'Facturation', 'Technique']}
            required
            className="mantine-select"
            clearable
            checkIconPosition="right"
          />
        </Group>
        <div className="form-row priority-row" style={{ marginBottom: 18 }}>
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
        <Group grow mb="md">
          <TextInput
            label="Order Number"
            placeholder="Numéro de commande"
            className="mantine-input"
          />
          <TagsInput
            label="Tags"
            placeholder="Appuyez sur Entrée pour ajouter un tag"
            required
            value={tags}
            onChange={setTags}
            className="mantine-input"
          />
        </Group>
        <Group grow mb="md">
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
          <Select
            label="Source"
            placeholder="Choisir une source"
            data={['Phone Call', 'Email', 'Whats App']}
            disabled={!type || type === 'Internal'}
            className="mantine-select"
            clearable
            checkIconPosition="right"
          />
        </Group>
        <Textarea
          label="Claim"
          placeholder="Décrivez la réclamation"
          required
          minRows={3}
          className="mantine-input"
          mb="md"
        />
        <Group position="right" mt="md">
          <Button type="submit" leftSection={<MdSave style={{ marginRight: 8, fontSize: '1.3em', verticalAlign: 'middle' }} />}>
            Enregistrer
          </Button>
        </Group>
      </form>
    </Modal>
  );
} 