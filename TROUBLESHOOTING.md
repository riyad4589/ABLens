# 🔧 Guide de dépannage - Problèmes de connexion backend

## Problème : Endpoint non trouvé (404)

### Symptômes
- Erreur `404 (Not Found)` lors de la création de tickets
- Erreur `Endpoint non trouvé` dans la console
- L'application ne peut pas se connecter au backend

### Solutions

#### 1. Vérifier que le backend est démarré

```bash
# Aller dans le répertoire backend
cd ../backend/ticket_system_backend

# Démarrer le backend Spring Boot
./mvnw spring-boot:run
```

#### 2. Vérifier que le backend écoute sur le bon port

Le backend doit être démarré sur le port `8080`. Vérifiez dans la console du backend :

```
Started TicketSystemApplication in X.XXX seconds (process running for X.XXX)
```

#### 3. Tester la connectivité

Ouvrez un navigateur et testez :
- `http://localhost:8080/api/ticket` (GET)
- `http://localhost:8080/api/auth/login` (POST)

#### 4. Vérifier la base de données PostgreSQL

Le backend nécessite PostgreSQL. Vérifiez que :
- PostgreSQL est installé et démarré
- La base de données `ablens_ticket_system` existe
- Les identifiants dans `application.properties` sont corrects

```bash
# Vérifier que PostgreSQL est démarré
psql -U postgres -d ablens_ticket_system
```

#### 5. Vérifier les logs du backend

Regardez les logs dans la console où le backend est démarré pour voir les erreurs.

### Configuration requise

1. **Java 17+** installé
2. **Maven** installé
3. **PostgreSQL** installé et démarré
4. **Base de données** `ablens_ticket_system` créée

### Commandes utiles

```bash
# Vérifier la version de Java
java -version

# Vérifier la version de Maven
mvn -version

# Tester la connexion PostgreSQL
psql -U postgres -h localhost -d ablens_ticket_system

# Redémarrer le backend
./mvnw spring-boot:run
```

### Problèmes courants

1. **Port 8080 déjà utilisé** : Changez le port dans `application.properties`
2. **Base de données non accessible** : Vérifiez les identifiants PostgreSQL
3. **CORS** : Vérifiez la configuration CORS dans le backend
4. **JWT** : Vérifiez la configuration JWT

### Support

Si le problème persiste, vérifiez :
1. Les logs du backend dans la console
2. La console du navigateur (F12) pour les erreurs
3. La configuration dans `application.properties`
