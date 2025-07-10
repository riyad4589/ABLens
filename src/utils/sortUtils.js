// Ce fichier contient des fonctions utilitaires pour le tri des tickets.
// Inclut comparePriority (tri par priorité) et compareStatus (tri par statut).
// Utilisé pour trier les tickets dans les tableaux de l'application.
export function comparePriority(a, b, asc) {
    const order = ["LOW", "NORMAL", "HIGH", "URGENT"];
    const diff = order.indexOf(a.priority) - order.indexOf(b.priority);
    return asc ? diff : -diff;
  }
  
  export function compareStatus(a, b, asc) {
    const order = ["Ouvert", "En attente", "Fermé"];
    const diff = order.indexOf(a.status) - order.indexOf(b.status);
    return asc ? diff : -diff;
  }
  