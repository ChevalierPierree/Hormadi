# HORMADI ANGLET — Site Officiel

Site web complet du club de hockey sur glace Hormadi Anglet (Ligue Magnus).

## Lancer le projet

### Prérequis
- Node.js 18+
- npm 9+

### Installation

```bash
cd hormadi-site

# Installer les dépendances
npm install

# Générer le client Prisma + créer la base + remplir les données de démo
npm run setup

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

### Comptes admin de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@hormadi.fr | hormadi2026 | Super Admin |
| billetterie@hormadi.fr | hormadi2026 | Admin Billetterie |
| boutique@hormadi.fr | hormadi2026 | Admin Boutique |
| editeur@hormadi.fr | hormadi2026 | Éditeur |

Panel admin : **http://localhost:3000/admin/login**

## Structure du projet

```
hormadi-site/
├── prisma/              # Schéma BDD + seed
├── src/
│   ├── app/
│   │   ├── (vitrine)/   # Pages publiques (accueil, actu, calendrier...)
│   │   ├── admin/       # Panel administration
│   │   ├── api/         # API REST
│   │   ├── billetterie/ # Réservation de billets
│   │   └── boutique/    # Boutique en ligne
│   ├── components/      # Composants React
│   ├── lib/             # Utilitaires, auth, DB
│   └── styles/          # CSS global + Tailwind
└── public/              # Assets statiques
```

## Stack technique

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (dark mode, design system custom)
- **Prisma** + **SQLite** (base de données)
- **bcryptjs** + **JWT** (authentification)
- **Framer Motion** (animations)
- **Lucide React** (icônes)
- **Recharts** (graphiques)
