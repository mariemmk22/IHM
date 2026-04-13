# ServiConnect 🔧

Plateforme de mise en relation entre clients et prestataires de services en Tunisie.

## Structure du projet

```
serviconnect/
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Composants partagés (Badge, Card, Btn, Modal, Table...)
│   │   └── Layout.jsx       # Layout avec sidebar (partagé entre les 3 rôles)
│   ├── data/
│   │   └── mockData.js      # Données de test (users, services, RDV, avis...)
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx    # Page de connexion avec sélecteur de rôle
│   │   ├── admin/
│   │   │   └── AdminApp.jsx # Dashboard admin complet
│   │   ├── prestataire/
│   │   │   └── PrestataireApp.jsx # Dashboard prestataire complet
│   │   └── client/
│   │       └── ClientApp.jsx # Dashboard client complet
│   ├── App.jsx              # Routage principal entre les rôles
│   └── main.jsx             # Point d'entrée React
├── index.html
├── package.json
└── vite.config.js
```

## Démarrage rapide

```bash
cd serviconnect
npm install
npm run dev
```

## Comptes de test

| Rôle        | Email                       | Mot de passe |
|-------------|----------------------------|--------------|
| Admin       | admin@serviconnect.tn       | admin123     |
| Prestataire | ahmed.mansouri@email.com    | prest123     |
| Client      | yasmine@email.com           | client123    |

---

## Pages par rôle

### 🛡️ Admin
- **Tableau de bord** — Stats globales, derniers utilisateurs, docs en attente, RDV récents
- **Utilisateurs** — Liste complète, filtres, recherche, bloquer/débloquer, voir détail
- **Documents** — Vérification des documents prestataires (accepter / refuser)
- **Catégories** — Gestion catégories + sous-catégories (activer/désactiver)
- **Services** — Vue de tous les services, filtres, suspension
- **Rendez-vous** — Tous les RDV de la plateforme avec filtres et stats
- **Avis** — Modération des avis clients
- **Paramètres** — Config plateforme, notifications, actions rapides

### 🔧 Prestataire
- **Tableau de bord** — Bannière accueil, stats, prochains RDV, derniers avis, services actifs
- **Mon Profil** — Infos personnelles/pro, mode édition, zone de suppression
- **Documents** — Statut des documents soumis, soumettre nouveau, documents requis
- **Mon Statut** — Disponible / Occupé / En congé + jours et horaires de travail
- **Mes Services** — Ajouter/modifier/supprimer/activer services
- **Rendez-vous** — Confirmer/refuser/terminer les RDV avec stats
- **Avis reçus** — Note globale avec distribution + liste des avis
- **Rechercher** — Recherche simple et avancée des services
- **Notifications** — Centre de notifications avec marquage lu/non lu

### 👤 Client
- **Accueil** — Hero search, catégories, services populaires, derniers RDV
- **Rechercher** — Recherche simple et avancée avec filtres (catégorie, ville, tarif, note)
- **Tous les services** — Parcourir par catégorie avec prise de RDV directe
- **Prestataires** — Annuaire des prestataires avec recherche
- **Mes Rendez-vous** — Historique, annulation, laisser un avis avec étoiles
- **Mes Avis** — Gérer ses avis publiés
- **Mon Profil** — Infos personnelles, stats, sécurité
- **Notifications** — Centre de notifications

---

## Fonctionnalités clés

- ✅ **Authentification** — Login avec sélecteur de rôle (3 rôles)
- ✅ **Sidebar collapsible** — Réductible avec icônes only
- ✅ **Données dynamiques** — State React, toutes les actions fonctionnent
- ✅ **Modals** — Formulaires de création/détail
- ✅ **Filtres** — Recherche et filtres sur toutes les listes
- ✅ **Responsive** — Adapté aux différentes tailles d'écran
- ✅ **Thème cohérent** — 3 couleurs différentes par rôle

## Prochaines étapes (Backend Node.js)

```
backend/
├── routes/
│   ├── auth.js          # POST /api/auth/login, /register
│   ├── users.js         # CRUD utilisateurs
│   ├── services.js      # CRUD services
│   ├── rendezvous.js    # CRUD rendez-vous
│   ├── avis.js          # CRUD avis
│   ├── categories.js    # CRUD catégories
│   └── documents.js     # Upload & vérification docs
├── middleware/
│   ├── auth.js          # JWT verification
│   └── roles.js         # Role-based access
├── models/              # Mongoose models
└── server.js
```

### Stack recommandée
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Upload:** Multer pour les documents
- **Email:** Nodemailer pour les notifications
