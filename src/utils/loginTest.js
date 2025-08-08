// Utilitaire pour tester différents scénarios de connexion
// Utilisé pour simuler les erreurs du backend

export const testLoginScenarios = {
  // Scénarios de test pour différentes erreurs
  scenarios: {
    // Identifiants corrects (à adapter selon votre backend)
    validCredentials: {
      username: "admin",
      password: "admin123",
      expectedResult: "success"
    },
    
    // Identifiants incorrects
    invalidCredentials: {
      username: "wronguser",
      password: "wrongpass",
      expectedResult: "Nom d'utilisateur ou mot de passe incorrect"
    },
    
    // Champs vides
    emptyFields: {
      username: "",
      password: "",
      expectedResult: "Le nom d'utilisateur est requis"
    },
    
    // Mot de passe trop court
    shortPassword: {
      username: "test",
      password: "12",
      expectedResult: "Le mot de passe doit contenir au moins 3 caractères"
    },
    
    // Nom d'utilisateur avec espaces
    usernameWithSpaces: {
      username: "  test  ",
      password: "password123",
      expectedResult: "success" // Sera automatiquement trimé
    }
  },
  
  // Fonction pour tester un scénario
  testScenario: (scenarioName) => {
    const scenario = testLoginScenarios.scenarios[scenarioName];
    if (!scenario) {
      throw new Error(`Scénario "${scenarioName}" non trouvé`);
    }
    return scenario;
  },
  
  // Fonction pour obtenir tous les scénarios
  getAllScenarios: () => {
    return Object.keys(testLoginScenarios.scenarios);
  }
};

// Messages d'erreur courants
export const errorMessages = {
  NETWORK_ERROR: "Impossible de se connecter au serveur - Vérifiez votre connexion",
  INVALID_CREDENTIALS: "Nom d'utilisateur ou mot de passe incorrect",
  SERVER_ERROR: "Erreur serveur - Veuillez réessayer plus tard",
  VALIDATION_ERROR: "Données de connexion invalides",
  EMPTY_USERNAME: "Le nom d'utilisateur est requis",
  EMPTY_PASSWORD: "Le mot de passe est requis",
  SHORT_PASSWORD: "Le mot de passe doit contenir au moins 3 caractères"
};
