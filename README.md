# E-commerce Report Generator (PoC)

A Proof of Concept for an e-commerce report generator that allows store owners to create and manage reports using natural language queries or predefined templates.

## Features

- **JWT Authentication** - Secure login with token-based authentication
- **Multi-tenancy with RLS** - Each store owner sees only their own data
- **Natural Language Reports** - Generate reports by describing what you need in plain English
- **Report Templates** - Pre-built reports for common use cases (Sales Summary, Top Products, Orders List, Revenue by Period)
- **Interactive Visualizations** - Charts (bar, line, pie) and sortable data tables
- **CSV Export** - Download report data for further analysis
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Database | SQLite + Sequelize ORM |
| Authentication | JWT (jsonwebtoken + bcrypt) |
| AI/NLP | OpenAI API |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| Charts | Recharts |

## Project Structure

```
nlp-commerce-analytics/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js    # Sequelize SQLite configuration
│   │   │   └── seed.js        # Database seeding
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT verification
│   │   ├── models/
│   │   │   ├── Store.js
│   │   │   ├── User.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   └── index.js       # Model associations
│   │   ├── routes/
│   │   │   ├── auth.js        # Login endpoint
│   │   │   ├── stores.js      # Store data (RLS)
│   │   │   ├── orders.js      # Orders + stats (RLS)
│   │   │   └── reports.js     # Report generation
│   │   ├── services/
│   │   │   └── openai.js      # NLP to SQL translation
│   │   └── index.js           # Express app entry
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReportChart.jsx
│   │   │   ├── ReportStats.jsx
│   │   │   └── ReportTable.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx    # Auth context
│   │   │   └── useToast.js    # Toast notifications
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios instance
│   │   ├── lib/
│   │   │   └── utils.js       # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- OpenAI API key (optional - required only for natural language queries)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd nlp-commerce-analytics
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and configure:
- `JWT_SECRET` - Change to a secure random string for production
- `OPENAI_API_KEY` - Add your OpenAI API key (optional)

### 3. Setup Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

The default `VITE_API_URL` points to `http://localhost:3000/api` which works for local development.

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`. On first run, it will:
- Create the SQLite database (`database.sqlite`)
- Create all tables
- Seed sample data (2 stores, 2 users, sample orders)

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Test Accounts

The database is seeded with two test accounts, each belonging to a different store:

| Username | Password | Store |
|----------|----------|-------|
| owner_a | password123 | Store A |
| owner_b | password123 | Store B |

Each user can only see data from their own store (Row-Level Security).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password, returns JWT

### Protected Routes (require JWT)
- `GET /api/stores` - Get current user's store
- `GET /api/orders` - Get orders for current user's store
- `GET /api/orders/stats` - Get order statistics
- `POST /api/reports/generate` - Generate a report

### Report Generation

**Template-based:**
```json
{
  "type": "template",
  "templateId": "sales_summary",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31"
}
```

Available templates: `sales_summary`, `top_products`, `orders_list`, `revenue_by_period`

**Natural Language (requires OpenAI API key):**
```json
{
  "type": "nlp",
  "query": "Show me top 5 products by revenue",
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31"
}
```

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 3000) | No |
| JWT_SECRET | Secret for signing JWT tokens | Yes |
| OPENAI_API_KEY | OpenAI API key for NLP queries | No* |
| NODE_ENV | Environment (development/production) | No |

*Natural language queries will not work without an OpenAI API key. Template-based reports work without it.

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## Development Notes

- The SQLite database file (`database.sqlite`) is created in the backend directory
- Database is automatically seeded on first run if tables are empty
- JWT tokens expire after 24 hours
- All API routes (except login) require a valid JWT token in the Authorization header