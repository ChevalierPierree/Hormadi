# Rapport Projet — Site Hormadi Anglet

**Date :** 29 mars 2026
**Projet :** Site web officiel de l'Anglet Hormadi (hockey sur glace, Ligue Magnus)
**Stack :** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite) + JWT Auth

---

## 1. Vue d'ensemble

Le site se compose de **3 grands espaces** :

1. **Vitrine** (`/`) — pages publiques du club (accueil, actualités, calendrier, classement, histoire, hospitalités, partenaires)
2. **Billetterie** (`/billetterie`) — réservation de places pour les matchs à domicile
3. **Boutique** (`/boutique`) — e-commerce pour le merchandising du club (maillots, textile, accessoires)

Plus un **back-office admin** (`/admin`) avec authentification JWT et gestion par rôles.

---

## 2. Architecture technique

### 2.1 Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router, Server + Client Components) |
| Langage | TypeScript |
| Styling | Tailwind CSS avec tokens custom `hormadi-*` |
| Base de données | SQLite via Prisma ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Animations | Framer Motion |
| Charts | Recharts |
| Icônes | Lucide React |

### 2.2 Palette de couleurs (charte graphique Basque)

```
hormadi-dark:    #012e24  — Vert Foncé (fond principal)
hormadi-forest:  #00664f  — Vert Forêt (surfaces secondaires)
hormadi-ocean:   #009681  — Vert Océan (accent interactif)
hormadi-ice:     #a8d7d2  — Vert Glace (accents légers)
hormadi-red:     #e4002b  — Rouge Basque (CTAs, scores)
hormadi-surface: #021f19  — Surface sombre (cards)
hormadi-border:  #0a3d30  — Bordures
hormadi-muted:   #8aafa6  — Texte secondaire
```

### 2.3 Typographies

- **Sans-serif :** Glacial Indifference
- **Display :** Anton / League Gothic
- **Heading :** Contrail One

### 2.4 Structure des dossiers

```
hormadi-site/
├── prisma/
│   ├── schema.prisma          # Modèles BDD
│   └── seed.ts                # Données de démo
├── public/
│   ├── images/
│   │   ├── partners/          # Logos partenaires (upload)
│   │   └── teams/             # Logos équipes Ligue Magnus
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── (vitrine)/         # Pages publiques (layout avec Header/Footer)
│   │   │   ├── page.tsx       # Accueil
│   │   │   ├── actualites/    # Articles + détail [slug]
│   │   │   ├── calendrier/    # Calendrier des matchs
│   │   │   ├── classement/    # Classement Ligue Magnus
│   │   │   ├── histoire/      # Histoire du club
│   │   │   ├── hospitalites/  # Offres VIP et loges
│   │   │   ├── partenaires/   # Page partenaires publique
│   │   │   └── layout.tsx
│   │   ├── admin/             # Back-office
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── matchs/
│   │   │   ├── actualites/
│   │   │   ├── classement/
│   │   │   ├── partenaires/
│   │   │   ├── billetterie/   # + sous-page [matchId]
│   │   │   ├── boutique/      # + sous-pages produits/, commandes/
│   │   │   └── layout.tsx
│   │   ├── billetterie/       # Pages publiques billetterie
│   │   │   ├── page.tsx
│   │   │   └── [matchId]/
│   │   ├── boutique/          # Pages publiques boutique
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   ├── panier/
│   │   │   └── commande/
│   │   ├── api/               # Routes API (voir section 4)
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Navigation principale
│   │   │   └── Footer.tsx     # Pied de page
│   │   ├── admin/
│   │   │   └── AdminSidebar.tsx
│   │   └── sections/          # Composants de la page d'accueil
│   │       ├── HeroSection.tsx
│   │       ├── RecentResults.tsx
│   │       ├── StandingsPreview.tsx
│   │       ├── NewsPreview.tsx
│   │       ├── PartnersMarquee.tsx
│   │       ├── SocialCTA.tsx
│   │       └── CTASection.tsx
│   └── lib/
│       ├── db.ts              # Instance Prisma
│       ├── auth.ts            # Helpers JWT
│       ├── api-utils.ts       # authenticateRequest, validateRequired, sanitizeString, logAdminAction, etc.
│       ├── utils.ts           # cn() (clsx + tailwind-merge)
│       ├── cart.tsx           # Context panier (boutique)
│       ├── constants.ts
│       └── demo-products.ts
```

---

## 3. Modèle de données (Prisma)

### 3.1 Auth & Users

- **User** — `id, email, password (bcrypt), name, role`
  - Rôles : `super_admin`, `admin_billetterie`, `admin_boutique`, `editor`
- **AdminLog** — journal d'audit des actions admin (`userId, action, entity, entityId, details`)

### 3.2 Content

- **Article** — `slug, title, excerpt, content, category, imageUrl, published, publishedAt`
  - Catégories : Match, Club, Équipe, Partenaires, Hospitalités

### 3.3 Matches & Standings

- **Match** — `date, homeTeam, awayTeam, homeScore, awayScore, venue, status, isHomeGame`
  - Status : scheduled, live, finished, postponed
  - Relations : `ticketCategories[]`, `orders[]`
- **Standing** — `team (unique), rank, gp, w, l, otw, otl, gf, ga, pts`

### 3.4 Ticketing (Billetterie)

- **TicketCategory** — `matchId, name, price (cents), capacity, sold`
- **TicketOrder** — `matchId, categoryId, quantity, totalPrice, customerName/Email/Phone, status, reference`

### 3.5 Shop (Boutique)

- **Product** — `slug, name, description, price (cents), category, imageUrl, images (JSON), sizes (JSON), stock, featured, published`
  - Catégories : maillots, textile, accessoires, enfant, collectors
- **ShopOrder** — `reference, customerName/Email/Phone, shippingAddress/City/Zip, totalPrice, status`
  - Status : pending, confirmed, shipped, delivered, cancelled
- **ShopOrderItem** — `orderId, productId, quantity, size, unitPrice`

### 3.6 Partners (Partenaires)

- **Partner** — `name, logoUrl, website, category, order, visible`
  - Catégories (5 niveaux hiérarchiques) :
    1. `partenaire_principal` — Partenaires Principaux
    2. `partenaire_officiel` — Partenaires Officiels
    3. `fournisseur_officiel` — Fournisseurs Officiels
    4. `partenaire_institutionnel` — Partenaires Institutionnels
    5. `partenaire` — Partenaires

---

## 4. Routes API

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/login` | Non | Login JWT |
| POST | `/api/auth/logout` | Non | Logout |
| GET | `/api/auth/me` | Oui | Utilisateur courant |
| GET | `/api/articles` | Non | Liste articles (filtres: category, published) |
| POST | `/api/articles` | Editor+ | Créer article |
| PUT | `/api/articles/[id]` | Editor+ | Modifier article |
| DELETE | `/api/articles/[id]` | Super Admin | Supprimer article |
| GET | `/api/matches` | Non | Liste matchs |
| POST | `/api/matches` | Editor+ | Créer match |
| PUT | `/api/matches/[id]` | Editor+ | Modifier match |
| DELETE | `/api/matches/[id]` | Super Admin | Supprimer match |
| GET | `/api/standings` | Non | Classement |
| PUT | `/api/standings` | Editor+ | Mettre à jour classement |
| GET | `/api/partners` | Non | Liste partenaires (filtres: category, visible) |
| POST | `/api/partners` | Editor+ | Créer partenaire |
| PUT | `/api/partners/[id]` | Editor+ | Modifier partenaire |
| DELETE | `/api/partners/[id]` | Super Admin | Supprimer partenaire |
| POST | `/api/partners/upload` | Editor+ | Upload logo partenaire (FormData) |
| GET | `/api/products` | Non | Liste produits |
| POST | `/api/products` | Editor+ | Créer produit |
| PUT | `/api/products/[id]` | Editor+ | Modifier produit |
| DELETE | `/api/products/[id]` | Super Admin | Supprimer produit |
| GET | `/api/tickets` | Non | Catégories billets par match |
| POST | `/api/tickets` | Non | Passer commande billets |
| PUT | `/api/tickets/[id]` | Admin Billetterie+ | Modifier commande |
| GET | `/api/orders` | Non | Commandes boutique |
| POST | `/api/orders` | Non | Passer commande boutique |
| PUT | `/api/orders/[id]` | Admin Boutique+ | Modifier commande |

---

## 5. Pages construites

### 5.1 Vitrine (publiques)

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Accueil | `/` | ✅ Fait | Hero, résultats récents, classement, actu, marquee partenaires, CTA |
| Actualités | `/actualites` | ✅ Fait | Liste d'articles avec filtres par catégorie |
| Détail article | `/actualites/[slug]` | ✅ Fait | Article complet |
| Calendrier | `/calendrier` | ✅ Fait | Tous les matchs avec logos équipes |
| Classement | `/classement` | ✅ Fait | Tableau Ligue Magnus interactif |
| Histoire | `/histoire` | ✅ Fait | Timeline du club |
| Hospitalités | `/hospitalites` | ✅ Fait | Offres VIP, loges, séminaires |
| Partenaires | `/partenaires` | ✅ Fait | Logos par catégorie + section "devenir partenaire" |

### 5.2 Billetterie

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Liste matchs | `/billetterie` | ✅ Fait | Prochains matchs avec dispos |
| Réservation | `/billetterie/[matchId]` | ✅ Fait | Choix catégorie + formulaire |

### 5.3 Boutique

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Catalogue | `/boutique` | ✅ Fait | Grille produits avec filtres |
| Détail produit | `/boutique/[slug]` | ✅ Fait | Fiche produit, tailles, ajout panier |
| Panier | `/boutique/panier` | ✅ Fait | Récap panier, modifier quantités |
| Commande | `/boutique/commande` | ✅ Fait | Formulaire de commande |

### 5.4 Admin

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Login | `/admin/login` | ✅ Fait | Authentification JWT |
| Dashboard | `/admin/dashboard` | ✅ Fait | Vue d'ensemble (stats, actions rapides) |
| Matchs | `/admin/matchs` | ✅ Fait | CRUD matchs |
| Actualités | `/admin/actualites` | ✅ Fait | CRUD articles |
| Classement | `/admin/classement` | ✅ Fait | Édition du classement |
| Partenaires | `/admin/partenaires` | ✅ Fait | CRUD partenaires avec upload logo, filtres par catégorie |
| Billetterie | `/admin/billetterie` | ✅ Fait | Gestion billets par match |
| Billetterie détail | `/admin/billetterie/[matchId]` | ✅ Fait | Catégories de places + commandes |
| Boutique produits | `/admin/boutique` | ✅ Fait | Liste produits |
| Boutique détail | `/admin/boutique/produits` | ✅ Fait | CRUD produits |
| Boutique commandes | `/admin/boutique/commandes` | ✅ Fait | Gestion des commandes |

### 5.5 Composants partagés

- `Header.tsx` — Navigation responsive avec mega-menu, logo avec fallback client-side
- `Footer.tsx` — Liens, réseaux sociaux, infos club
- `AdminSidebar.tsx` — Navigation admin avec indicateurs par rôle
- `HeroSection.tsx` — Bannière animée page d'accueil
- `RecentResults.tsx` — Derniers résultats avec scores
- `StandingsPreview.tsx` — Extrait classement
- `NewsPreview.tsx` — Dernières actualités
- `PartnersMarquee.tsx` — Défilement infini logos partenaires
- `SocialCTA.tsx` — Liens réseaux sociaux
- `CTASection.tsx` — Call to action billetterie/boutique

---

## 6. Ce qui a été fait récemment

### 6.1 Refonte complète des couleurs

Toutes les pages (30+ fichiers) ont été migrées depuis l'ancienne palette (bleu marine `hormadi-navy`, or `hormadi-gold`, bleu `hormadi-blue`) vers la nouvelle palette basque (verts + rouge). Vérification grep : 0 référence restante aux anciennes couleurs.

### 6.2 Reconstruction de la page Partenaires

- Nouveau modèle Prisma : `level` → `category` avec 5 niveaux hiérarchiques
- Nouvelle API complète (CRUD + upload logos)
- Nouvelle page publique : hero, grille de logos par catégorie, section "devenir partenaire" avec stats et CTA
- Nouvelle page admin : table, modale add/edit avec upload, filtres par catégorie, toggle visibilité

### 6.3 Corrections de bugs

- Event handler `onError` dans Server Component (Footer.tsx) → supprimé
- `LogoImage` dans Header.tsx → extrait en Client Component avec `useState` fallback
- Import `NextResponse` manquant dans partners/route.ts
- Classes Tailwind dynamiques (`bg-hormadi-${color}`) → remplacées par classes complètes

---

## 7. Ce qui reste à faire

### 7.1 Prioritaire

- [ ] **Migration base de données** — L'utilisateur doit exécuter :
  ```bash
  npx prisma db push
  npx prisma db seed
  ```
  Le schema Prisma a changé (`level` → `category` dans Partner) mais la BDD SQLite locale n'a pas encore été mise à jour.

- [ ] **Logos partenaires** — Le dossier `public/images/partners/` est vide. Les logos doivent être uploadés via l'interface admin ou placés manuellement.

- [ ] **Logos équipes manquants** — Seulement 11 logos Ligue Magnus sur ~14 équipes sont présents dans `public/images/teams/`.

### 7.2 Revue page par page

Chaque page doit être revue individuellement pour vérifier le design, le responsive, et la cohérence visuelle. Seule la page `/partenaires` a été retravaillée en profondeur. Les autres pages ont reçu la migration de couleurs mais pas de revue UX/UI individuelle :

- [ ] Page d'accueil (`/`)
- [ ] Actualités (`/actualites` + `[slug]`)
- [ ] Calendrier (`/calendrier`)
- [ ] Classement (`/classement`)
- [ ] Histoire (`/histoire`)
- [ ] Hospitalités (`/hospitalites`)
- [ ] Billetterie (`/billetterie` + `[matchId]`)
- [ ] Boutique (`/boutique` + `[slug]` + panier + commande)

### 7.3 Fonctionnalités manquantes ou à améliorer

- [ ] **Paiement** — Pas d'intégration Stripe ou autre gateway. Les commandes sont créées en BDD mais aucun paiement réel n'est traité.
- [ ] **Emails transactionnels** — Pas de confirmation par email (commandes, billets).
- [ ] **SEO** — Metadata Next.js (title, description, og:image) à ajouter sur chaque page.
- [ ] **Responsive** — Tests approfondis mobile/tablet nécessaires sur toutes les pages.
- [ ] **Performance** — Aucune optimisation image (pas de Next.js `Image` optimization, pas de lazy loading systématique).
- [ ] **Sécurité** — Rate limiting, CORS, validation plus stricte des inputs, protection CSRF.
- [ ] **Tests** — Aucun test unitaire ou e2e n'est écrit.
- [ ] **CI/CD** — Pas de pipeline de déploiement configuré.
- [ ] **Production DB** — SQLite est utilisé (dev only). Migration vers PostgreSQL nécessaire pour la production.
- [ ] **Members Card** — Mentionnée dans les offres partenaires mais pas encore implémentée.
- [ ] **Recherche** — Pas de fonctionnalité de recherche globale sur le site.
- [ ] **Internationalisation** — Site uniquement en français (cohérent avec la cible locale, mais à confirmer si besoin EN/EU).
- [ ] **Analytics** — Pas d'intégration Google Analytics, Plausible ou autre.
- [ ] **Accessibilité** — Audit WCAG à faire (contrastes, navigation clavier, screen reader).
- [ ] **PWA / Notifications** — Pas de service worker, pas de push notifications pour les résultats de match.

### 7.4 Données de contenu

- [ ] Rédaction des textes définitifs (histoire du club, descriptifs hospitalités, etc.)
- [ ] Photos professionnelles (joueurs, patinoire, événements)
- [ ] Vrais tarifs billetterie et boutique
- [ ] Catalogue produits complet avec photos
- [ ] Articles d'actualité réels

---

## 8. Configuration & Lancement

### 8.1 Installation

```bash
cd hormadi-site
npm install
```

### 8.2 Environnement

Créer un fichier `.env` :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="votre-secret-jwt-ici"
```

### 8.3 Base de données

```bash
npx prisma generate
npx prisma db push
npx prisma db seed    # (ou: npm run setup pour tout en un)
```

### 8.4 Développement

```bash
npm run dev
# → http://localhost:3000
```

### 8.5 Compte admin par défaut (seed)

```
Email: admin@hormadi.fr
Mot de passe: hormadi2024!
Rôle: super_admin
```

---

## 9. Points d'attention pour un développeur reprenant le projet

1. **Server Components vs Client Components** — Next.js App Router. Les event handlers (`onClick`, `onError`, `onChange`) ne fonctionnent que dans les Client Components (`'use client'`). Attention au Header/Footer qui sont des Server Components contenant des sous-composants Client.

2. **Classes Tailwind dynamiques** — Ne PAS utiliser de template literals (`bg-hormadi-${variable}`). Tailwind ne peut pas les résoudre au build. Toujours utiliser les classes complètes.

3. **Tokens de couleur** — Tout le design utilise les tokens `hormadi-*` définis dans `tailwind.config.ts`. Ne pas utiliser de couleurs hardcodées.

4. **Authentification** — JWT stocké en cookie HTTP-only. La fonction `authenticateRequest(request, roles?)` dans `src/lib/api-utils.ts` gère l'auth et le contrôle d'accès par rôle. Elle retourne soit un `AuthUser` soit un `NextResponse` (erreur).

5. **Prix en centimes** — Tous les prix (produits, billets, commandes) sont stockés en centimes (integer). Diviser par 100 pour l'affichage.

6. **SQLite** — La BDD SQLite est un fichier `prisma/dev.db`. Pour la production, migrer vers PostgreSQL (modifier `datasource db` dans schema.prisma).

7. **Upload de fichiers** — Les logos partenaires sont uploadés dans `public/images/partners/` via FormData. Le fichier est renommé avec un slug + timestamp.

---

*Rapport généré le 29 mars 2026*
