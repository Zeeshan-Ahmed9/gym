# Gym Management System

A production-ready, full-stack web application foundation engineered for gym and fitness club management. Built as a single responsive application supporting two distinct roles:
- **ADMIN / OWNER**: Management of members, memberships, payments, attendance, and analytics.
- **MEMBER / CLIENT**: Self-service portal for QR check-in, attendance logs, and workout/body progress tracking.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with centralized CSS custom property tokens
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/) (Normalized schema & type-safe queries)
- **Authentication**: [Auth.js / NextAuth v5](https://authjs.dev/) (Role-based access control with JWT)
- **Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with `@hookform/resolvers`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Dates**: [date-fns](https://date-fns.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **QR Codes**: `qrcode` (generator) & `html5-qrcode` (scanner)
- **Code Quality**: ESLint, Prettier with `prettier-plugin-tailwindcss`

---

## Project Structure

```
Gym/
├── prisma/
│   └── schema.prisma         # Core PostgreSQL entity models
├── prisma.config.ts          # Prisma configuration
├── public/                   # Static assets & robots.txt
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication route group & layout
│   │   ├── (admin)/          # Protected admin route group with RBAC layout
│   │   ├── (member)/         # Protected member route group with RBAC layout
│   │   ├── api/
│   │   │   └── auth/         # NextAuth route handler endpoint
│   │   ├── layout.tsx        # Root HTML layout with Plus Jakarta Sans font
│   │   ├── page.tsx          # Initial foundation status page
│   │   └── globals.css       # Global design tokens and theme variables
│   │
│   ├── components/
│   │   ├── ui/               # 11 foundational reusable UI components
│   │   ├── layout/           # Navbar, Sidebar, and shell navigation
│   │   ├── admin/            # Admin-specific component foundations
│   │   ├── member/           # Member-specific component foundations
│   │   └── shared/           # Cross-role components (QR badges, etc.)
│   │
│   ├── lib/
│   │   ├── auth/             # NextAuth v5 configuration & route guards
│   │   ├── db/               # Prisma singleton client instance
│   │   ├── validations/      # Zod validation schemas
│   │   ├── utils/            # Utility helpers (cn, formatting)
│   │   └── qr/               # QR code generation & scanning helpers
│   │
│   ├── server/
│   │   ├── actions/          # Server actions with typed error handling
│   │   └── services/         # Domain database services
│   │
│   ├── types/                # Shared TypeScript types & NextAuth extensions
│   │
│   └── config/               # Site configuration and system constants
│
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier formatting configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and npm scripts
└── tsconfig.json             # TypeScript configuration with @/* path alias
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and supply your PostgreSQL connection string and auth secret:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection URL (e.g., `postgresql://postgres:postgres@localhost:5432/gym_management?schema=public`)
- `AUTH_SECRET`: Strong secret key for signing session tokens (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL`: Base URL (default: `http://localhost:3000`)

### 3. Run Prisma

Generate Prisma Client:
```bash
npm run db:generate
```

Push schema to your PostgreSQL database:
```bash
npm run db:push
```

Validate Prisma schema at any time:
```bash
npx prisma validate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Design System & Brand Palette

The design tokens are centralized in `src/app/globals.css`:

- **Background**: `#0B0D0F`
- **Cards**: `#15191D`
- **Primary**: `#B7F34A` (Electric Lime)
- **Main Text**: `#F5F7F2`
- **Muted Text**: `#8B9299`
- **Borders**: `#232930`
- **Success**: `#4ADE80`
- **Warning**: `#FBBF24`
- **Danger**: `#F87171`
- **Typography**: Plus Jakarta Sans (Headings: 700-800, Body: 400-500, Buttons: 600)

---

## Role-Based Access Control (RBAC)

The application enforces a dual-role authorization model:
- `/admin/*`: Strictly accessible only to users with the `ADMIN` role. Members are redirected to `/member`.
- `/member/*`: Accessible to authenticated users (`MEMBER` or `ADMIN`).
- Enforcement happens both at the Next.js Edge middleware level (`src/middleware.ts`) and at the Server Component layout level (`src/app/(admin)/layout.tsx`).
