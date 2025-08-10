// Ce fichier définit le composant React NewTicketForm.
// Il affiche un formulaire dans une modale pour créer un nouveau ticket avec gestion des champs, priorités et validation.
// Utilisé pour l'ajout de tickets dans l'application.
import React, { useState, useEffect } from "react";
import { MdSave, MdClose, MdInfo } from "react-icons/md";
import { Select, TextInput, Textarea, SegmentedControl, TagsInput, Modal, Button, Group, Title, Alert } from '@mantine/core';
import '@mantine/core/styles.css';
import apiService from '../services/api';

export default function NewTicketForm({ onClose, onTicketCreated }) {
  const [priority, setPriority] = useState("NORMAL");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState([]);
  const [sources, setSources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    departmentId: "", // Valeur par défaut vide
    issueId: "",
    orderNumber: "",
    type: "",
    sourceId: "",
    claim: ""
  });

  // État pour filtrer les sources selon le type sélectionné
  const [selectedType, setSelectedType] = useState("");
  const [filteredSources, setFilteredSources] = useState([]);
  const [assignmentStrategy, setAssignmentStrategy] = useState(null);

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
        setError('Impossible de charger les données de référence. Vérifiez que le backend est démarré.');
      }
    };
    
    loadReferenceData();
  }, []);

  // Charger la stratégie d'affectation quand le département change
  useEffect(() => {
    const loadAssignmentStrategy = async () => {
      if (formData.departmentId) {
        try {
          const strategy = await apiService.getAssignmentStrategy(parseInt(formData.departmentId));
          setAssignmentStrategy(strategy);
        } catch (error) {
          setAssignmentStrategy({ strategy: 'ROUND_ROBIN', name: 'Round-Robin', description: 'Stratégie par défaut' });
        }
      } else {
        setAssignmentStrategy(null);
      }
    };
    
    loadAssignmentStrategy();
  }, [formData.departmentId]);

  // Filtrer les sources quand le type change
  useEffect(() => {
    if (selectedType) {
      const filtered = sources.filter(source => source.type === selectedType);
      setFilteredSources(filtered);
      // Réinitialiser la source sélectionnée si elle ne correspond plus au type
      if (formData.sourceId) {
        const currentSource = sources.find(s => s.id.toString() === formData.sourceId);
        if (!currentSource || currentSource.type !== selectedType) {
          setFormData({...formData, sourceId: ""});
        }
      }
    } else {
      setFilteredSources([]);
      setFormData({...formData, sourceId: ""});
    }
  }, [selectedType, sources]);

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
    if (!selectedType) {
      setError("Le type de ticket est requis");
      return;
    }
    if (!formData.sourceId) {
      setError("La source est requise");
      return;
    }
    
    // Vérifier que la source sélectionnée correspond au type choisi
    const selectedSource = sources.find(s => s.id.toString() === formData.sourceId);
    if (selectedSource && selectedSource.type !== selectedType) {
      setError("La source sélectionnée ne correspond pas au type choisi");
      return;
    }

    try {
      const ticketData = {
        subject: formData.subject.trim(),
        claim: formData.claim.trim(),
        orderNumber: formData.orderNumber?.trim() || "",
        priority: priority,
        tags: tags || [],
        departmentId: parseInt(formData.departmentId),
        issueId: parseInt(formData.issueId),
        sourceId: parseInt(formData.sourceId)
      };

      const newTicket = await apiService.createTicket(ticketData);
      
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }
      
      onClose();
    } catch (error) {
      setError(error.message || "Erreur lors de la création du ticket");
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Nouveau ticket"
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
            label="Type de ticket"
            placeholder="Choisir le type"
            data={[
              { value: 'EXTERNAL', label: 'Externe' },
              { value: 'INTERNAL', label: 'Interne' }
            ]}
            required
            className="mantine-select"
            clearable
            checkIconPosition="right"
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value);
              setFormData({...formData, sourceId: ""});
            }}
          />
          <Select
            label="Source"
            placeholder={selectedType ? "Choisir une source" : "Sélectionnez d'abord le type"}
            data={filteredSources.map(source => ({ value: source.id.toString(), label: source.name }))}
            className="mantine-select"
            clearable
            checkIconPosition="right"
            value={formData.sourceId}
            onChange={(value) => setFormData({...formData, sourceId: value})}
            disabled={!selectedType}
            required
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