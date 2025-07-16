# ABLENS - Dashboard & Gestion de Tickets

## Présentation
ABLENS est une application web de gestion de tickets et de suivi d’activité, conçue pour les équipes de support et les administrateurs. Elle propose un tableau de bord moderne, une gestion avancée des tickets, des rapports, des paramètres utilisateurs et une interface intuitive.

---

## Couleurs principales
- **Bleu foncé Sidebar & boutons principaux** : `#194898`
- **Bleu clair (BarChart, DonutChart)** : `#4fc3f7`
- **Violet (DonutChart)** : `#6c5fc7`
- **Jaune (DonutChart, priorité)** : `#f7b731`
- **Vert (DonutChart, statut ouvert)** : `#4caf50`, `#1ecb7b`
- **Gris clair (fonds, séparateurs)** : `#f7f9fb`, `#f3f7fb`, `#eaf2fa`, `#b0bed9`
- **Rouge (priorité urgente)** : `#ff4d4f`

---

## Icônes utilisées
- **Sidebar** :
  - Dashboard : `IconLayoutDashboard` (Tabler Icons)
  - Tickets : `IconTicket` (Tabler Icons)
  - Reports : `IconChartPie` (Tabler Icons)
  - Settings : `IconSettings` (Tabler Icons)
  - Déconnexion : `IconLogout` (Tabler Icons)
- **Dashboard** :
  - Statistiques : `IconTicket`, `IconCirclePlus`, `IconTicketOff`, `IconAlertTriangle` (Tabler Icons)
  - Bouton "Nouveau Ticket" : `MdConfirmationNumber` (Material Icons)
- **Tickets** :
  - Vue détaillée : `IconEye` (Tabler Icons)
- **Settings** :
  - Onglets : `IconUserCog`, `IconKey`, `IconBuilding`, `IconUsers`, `IconPlus` (Tabler Icons)

---

## Technologies principales
- **React 18**
- **Mantine UI** (v8)
- **Tabler Icons** et **Material Icons**
- **Recharts** (graphiques)
- **Vite** (build & dev)
- **ESLint** (qualité du code)

---

## Installation & Lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer le linter
npm run lint

# Générer la version de production
npm run build
```

L’application sera accessible sur [http://localhost:5173](http://localhost:5173)

---

## Structure du projet

```
├── public/
├── src/
│   ├── assets/           # Images et logos
│   ├── components/       # Composants réutilisables (Sidebar, StatsCards, BarChart, DonutChart...)
│   ├── data/             # Données mock pour les graphiques
│   ├── modal/            # Modales (création ticket, détail ticket)
│   ├── pages/            # Pages principales (Dashboard, Tickets, Reports, Settings, Login)
│   ├── utils/            # Fonctions utilitaires
│   └── main.jsx          # Point d’entrée React
├── package.json
├── README.md
└── ...
```

---

## Fonctionnalités principales
- **Tableau de bord** : Statistiques, graphiques (barres, donut), accès rapide à la création de ticket.
- **Tickets** : Liste, tri, création, affichage détaillé, priorités et statuts colorés.
- **Rapports** : (à venir) Statistiques avancées.
- **Paramètres** : Gestion des rôles, permissions, départements, utilisateurs (navigation par onglets avec icônes).
- **Design moderne** : Couleurs harmonieuses, transitions douces, responsive, accessibilité améliorée.

---

## Auteurs & Contact
- Réalisé par l’équipe ABLENS
- Pour toute question, contactez : [votre.email@exemple.com]
