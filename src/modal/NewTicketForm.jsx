// Ce fichier définit le composant React NewTicketForm.
// Il affiche un formulaire dans une modale pour créer un nouveau ticket avec gestion des champs, priorités et validation.
// Utilisé pour l'ajout de tickets dans l'application.
import React, { useState, useEffect } from "react";
import { MdSave, MdClose } from "react-icons/md";
import { Select, TextInput, Textarea, SegmentedControl, TagsInput, Modal, Button, Group, Title, Alert } from '@mantine/core';
import '@mantine/core/styles.css';
import apiService from '../services/api';

export default function NewTicketForm({ onClose, onTicketCreated }) {
  const [priority, setPriority] = useState("NORMAL");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [sources, setSources] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    subject: "",
    departmentId: "",
    issueId: "",
    orderNumber: "",
    type: "",
    sourceId: "",
    claim: ""
  });

  const priorities = [
    { label: "LOW", color: "#b0bed9" },
    { label: "NORMAL", color: "#2176bd" },
    { label: "HIGH", color: "#f7b731" },
    { label: "URGENT", color: "#ff4d4f" },
  ];

  // Charger les données de référence au montage du composant
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [depts, iss, srcs] = await Promise.all([
          apiService.getDepartments(),
          apiService.getIssues(),
          apiService.getSources()
        ]);
        setDepartments(depts);
        setIssues(iss);
        setSources(srcs);
      } catch (error) {
        console.error('Erreur lors du chargement des données de référence:', error);
      }
    };
    
    loadReferenceData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation des champs requis
    if (!formData.subject?.trim()) {
      setError("Le sujet du ticket est requis");
      return;
    }
    if (!formData.claim?.trim()) {
      setError("La description de la réclamation est requise");
      return;
    }
    if (!formData.departmentId) {
      setError("Le département est requis");
      return;
    }
    if (!formData.issueId) {
      setError("Le motif est requis");
      return;
    }

    try {
      const ticketData = {
        subject: formData.subject.trim(),
        claim: formData.claim.trim(),
        orderNumber: formData.orderNumber?.trim() || null,
        // Supprimer 'type' car il n'existe pas dans SaveTicketDto
        priority: priority,
        tags: tags,
        // Utiliser les IDs comme attendu par le backend
        departmentId: parseInt(formData.departmentId),
        issueId: parseInt(formData.issueId),
        sourceId: formData.sourceId ? parseInt(formData.sourceId) : null
      };

      console.log('📋 Données du formulaire avant envoi:', ticketData);
      console.log('🔍 Validation des données:');
      console.log('- Subject:', ticketData.subject);
      console.log('- Claim:', ticketData.claim);
      console.log('- DepartmentId:', ticketData.departmentId);
      console.log('- IssueId:', ticketData.issueId);
      console.log('- Priority:', ticketData.priority);
      console.log('- SourceId:', ticketData.sourceId);

      const newTicket = await apiService.createTicket(ticketData);
      
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Erreur dans handleSubmit:', error);
      setError(error.message || "Erreur lors de la création du ticket");
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<Title order={3}>Nouveau ticket</Title>}
      size="lg"
      overlayProps={{ opacity: 0.55, blur: 3 }}
      centered
    >
      <form className="ticket-form" onSubmit={handleSubmit}>
        {error && (
          <Alert color="red" title="Erreur" mb={16}>
            {error}
          </Alert>
        )}
        
        <Group grow mb="md">
          <TextInput
            label="Customer"
            placeholder="Nom du client"
            required
            className="mantine-input"
            value={formData.customer}
            onChange={(e) => setFormData({...formData, customer: e.target.value})}
          />
          <TextInput
            label="Ticket Subject"
            placeholder="Sujet du ticket"
            required
            className="mantine-input"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
        </Group>
        <Group grow mb="md">
          <Select
            label="Department"
            placeholder="Choisir un département"
            data={departments.map(dept => ({ value: dept.id.toString(), label: dept.name }))}
            required
            className="mantine-select"
            clearable
            checkIconPosition="right"
            value={formData.departmentId}
            onChange={(value) => setFormData({...formData, departmentId: value})}
          />
          <Select
            label="Motif"
            placeholder="Choisir un motif"
            data={issues.map(issue => ({ value: issue.id.toString(), label: issue.name }))}
            required
            className="mantine-select"
            clearable
            checkIconPosition="right"
            value={formData.issueId}
            onChange={(value) => setFormData({...formData, issueId: value})}
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
            value={formData.orderNumber}
            onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
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
            label="Source"
            placeholder="Choisir une source"
            data={sources.map(source => ({ value: source.id.toString(), label: source.name }))}
            className="mantine-select"
            clearable
            checkIconPosition="right"
            value={formData.sourceId}
            onChange={(value) => setFormData({...formData, sourceId: value})}
          />
        </Group>
        <Textarea
          label="Claim"
          placeholder="Décrivez la réclamation"
          required
          minRows={3}
          className="mantine-input"
          mb="md"
          value={formData.claim}
          onChange={(e) => setFormData({...formData, claim: e.target.value})}
        />
        <Group position="right" mt="md">
          <Button 
            variant="outline"
            onClick={() => {
              console.log('🧪 Test de l\'endpoint /ticket...');
              const testData = {
                subject: "Test ticket",
                claim: "Test réclamation",
                priority: "NORMAL",
                departmentId: 1,
                issueId: 1,
                sourceId: 1,
                tags: ["test", "debug"]
              };
              console.log('📦 Données de test:', testData);
              apiService.createTicket(testData)
                .then(result => console.log('✅ Test réussi:', result))
                .catch(error => console.error('❌ Test échoué:', error));
            }}
          >
            Test Endpoint
          </Button>
          <Button 
            type="submit" 
            leftSection={<MdSave style={{ marginRight: 8, fontSize: '1.3em', verticalAlign: 'middle' }} />}
          >
            Enregistrer
          </Button>
        </Group>
      </form>
    </Modal>
  );
} 