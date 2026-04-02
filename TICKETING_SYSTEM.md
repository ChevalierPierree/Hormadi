# Hormadi Anglet Hockey - Ticketing System

Complete ticketing system built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

## Design System

**Colors (Hormadi Dark Theme):**
- Primary Background: `#0A1628` (hormadi-dark)
- Secondary Background: `#1E3A5F` (hormadi-navy)
- Accent Color: `#E63946` (hormadi-red)
- Surface: `#111827` (hormadi-surface)
- Border: `#1F2937` (hormadi-border)
- Muted Text: `#94A3B8` (hormadi-muted)

**CSS Utilities Used:**
- `glass` - Glassmorphism effect
- `glass-hover` - Glassmorphism with hover state
- `card` - Card container styling
- `card-glass` - Glass card variant
- `btn-primary` - Primary button (red)
- `btn-secondary` - Secondary button (navy)
- `section-padding` - Standard section padding
- `input` - Input field styling
- `badge-win` - Success badge
- `badge-loss` - Danger badge

## Public Pages

### `/billetterie` - Main Ticketing Page
**File:** `src/app/billetterie/page.tsx`

Features:
- Hero banner with "Billetterie" title
- Filter buttons: "Tous les matchs", "Domicile", "Extérieur"
- Match cards grid showing:
  - Date and time
  - Home vs Away team (colored circles)
  - Venue
  - Tickets remaining progress bar
  - Price from X€
  - "Réserver" CTA button (disabled if sold out)
- "Complet" badge for sold-out matches
- Demo data with 5 upcoming matches
- Fully client-side with useState

### `/billetterie/[matchId]` - Match Booking Page
**File:** `src/app/billetterie/[matchId]/page.tsx`

Features:
- Breadcrumb navigation
- Match header (teams, date, venue)
- Interactive arena map (SVG) with sections:
  - Tribune Est (300 places, 18€)
  - Tribune Ouest (300 places, 18€)
  - Virage Nord (250 places, 15€)
  - Virage Sud (250 places, 15€)
  - VIP (100 places, 35€)
- Click to select section, shows:
  - Price per ticket
  - Available seats
  - Real-time total calculation
  - Quantity selector (1-10)
- Cart summary sidebar with:
  - Selected sections and quantities
  - Running total
  - Remove items button
- Two-step checkout:
  1. Form (Prénom, Nom, Email, Téléphone)
  2. Confirmation with order reference
- Success modal with order reference (format: HRM-XXXXXX)
- Client-side with React hooks

## Admin Pages

### `/admin/billetterie` - Ticketing Dashboard
**File:** `src/app/admin/billetterie/page.tsx`

Features:
- Stats cards:
  - Total tickets sold
  - Total revenue
  - Average fill rate percentage
  - Number of upcoming matches
- Matches table with:
  - Date
  - Opponent name
  - Venue
  - Sold/Capacity
  - Revenue generated
  - Fill rate progress bar
- "Ajouter un match" button with modal form
- Click match row to view details
- All state management with useState

### `/admin/billetterie/[matchId]` - Match Detail & Management
**File:** `src/app/admin/billetterie/[matchId]/page.tsx`

Features:
- Match header (date, time, teams, venue)
- Stats cards (sold, revenue, fill rate, remaining)
- Ticket categories table:
  - Category name
  - Price per ticket
  - Capacity
  - Sold count
  - Remaining seats
  - Revenue generated
  - Inline edit buttons
- Reservations list:
  - Reference number (HRM-XXXXXX format)
  - Customer name and email
  - Quantity purchased
  - Amount paid
  - Status badges (confirmed/pending/cancelled)
- "Vente directe" (box office) quick form:
  - Customer name, email
  - Category selector
  - Quantity selector
  - Auto-adds to reservations table
- "Export CSV" button:
  - Exports all categories and reservations
  - Filename: `billetterie-YYYY-MM-DD.csv`
- Full CRUD operations with state management

### `/admin/matchs` - Match Management
**File:** `src/app/admin/matchs/page.tsx`

Features:
- All matches table (past + upcoming):
  - Date and time
  - Home vs Away teams
  - Score (for finished matches)
  - Venue
  - Status badge:
    - "Terminé" (finished) - gray
    - "À venir" (upcoming) - blue
    - "En direct" (live) - red
    - "Reporté" (postponed) - yellow
- Inline score editing for finished matches
- "Ajouter un match" button with form:
  - Date and time inputs
  - Away team name
  - Venue (auto-filled)
  - Status selector
  - Score fields (only for finished)
- Edit and delete actions per match
- Confirmation dialog on delete
- All state management with useState

## API Routes

### `GET /api/tickets` - List Orders (Admin)
**File:** `src/app/api/tickets/route.ts`

Query Parameters:
- `matchId` - Filter by match ID
- `status` - Filter by status (confirmed/pending/cancelled)
- `page` - Pagination page (default: 1)
- `limit` - Items per page (default: 20)

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

Requires: `Authorization: Bearer admin`

### `POST /api/tickets` - Create Order (Public)
**File:** `src/app/api/tickets/route.ts`

Request Body:
```json
{
  "matchId": "1",
  "customerName": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33612345678",
  "tickets": [
    {
      "sectionId": "tribune-est",
      "sectionName": "Tribune Est",
      "quantity": 2,
      "price": 18
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "order": {
    "id": "order-1234567890",
    "reference": "HRM-123456",
    "matchId": "1",
    "customerName": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+33612345678",
    "tickets": [...],
    "totalAmount": 36,
    "status": "confirmed",
    "createdAt": "2026-04-01T20:00:00.000Z"
  }
}
```

### `GET /api/tickets/[id]` - Get Order
**File:** `src/app/api/tickets/[id]/route.ts`

Parameters:
- `id` - Order ID or Reference number (e.g., HRM-123456)

Response: Single order object

### `PUT /api/tickets/[id]` - Update Order (Admin)
**File:** `src/app/api/tickets/[id]/route.ts`

Request Body:
```json
{
  "status": "confirmed" | "pending" | "cancelled"
}
```

Requires: `Authorization: Bearer admin`

## Data Structure

### Match Object
```typescript
interface Match {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  homeTeam: string;
  awayTeam: string;
  venue: string;
  capacity: number;
  sold: number;
  basePrice: number;
  isSoldOut: boolean;
  status?: 'upcoming' | 'live' | 'finished' | 'postponed';
  score?: { home: number; away: number };
}
```

### Ticket Category Object
```typescript
interface TicketCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
}
```

### Order Object
```typescript
interface Order {
  id: string;
  reference: string; // HRM-XXXXXX format
  matchId: string;
  customerName: string;
  email: string;
  phone: string;
  tickets: {
    sectionId: string;
    sectionName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string; // ISO timestamp
  updatedAt?: string;
}
```

## Features Summary

### Public Ticketing
- Browse upcoming matches
- Filter by match type (all, home, away)
- Interactive arena map visualization
- Section selection with real-time pricing
- Multi-section cart system
- Two-step checkout process
- Order confirmation with reference number

### Admin Management
- Dashboard with key metrics (sales, revenue, fill rate)
- Match lifecycle management (create, update, delete)
- Real-time status tracking (upcoming, live, finished, postponed)
- Score management for finished matches
- Ticket category management with inline editing
- Reservation tracking and history
- Box office sales integration
- CSV export functionality

### Technical Features
- Server-side API with basic auth checking
- Client-side state management with React hooks
- Form validation on all inputs
- Real-time calculations (totals, availability)
- Responsive design (mobile-first)
- Dark mode (Hormadi theme)
- SVG arena map with interactive sections
- Type-safe with TypeScript

## Demo Data

- 5 upcoming matches for Hormadi Anglet home games
- 5 ticket categories per match (different sections)
- Sample reservations showing various statuses
- Order reference format: HRM-XXXXXX (6 digits)

## Next Steps for Production

1. Connect to actual database (PostgreSQL, MongoDB, etc.)
2. Implement proper JWT authentication
3. Add payment gateway integration (Stripe, PayPal)
4. Set up email notifications for order confirmations
5. Implement inventory management system
6. Add user accounts and order history
7. Set up admin authentication/authorization
8. Add analytics and reporting
9. Implement seat selection (assign specific seats)
10. Add discount codes and promo functionality
