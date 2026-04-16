# Harmony Frontend

Next.js 14+ application for the Harmony search-engine-indexable chat platform.

## Tech Stack

This project uses the canonical tech stack from the Harmony dev specs (Section 8):

- **T1**: TypeScript 5.3+ - Primary language with strict mode
- **T2**: React 18.2+ - UI framework
- **T3**: Next.js 14.0+ - SSR/SSG framework (SEO-critical for public pages)
- **T4**: Node.js 20 LTS - Server runtime
- **Tailwind CSS** - Styling framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 20 LTS or later
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`.

### Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
harmony-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Route group for public pages (future)
│   │   ├── (authenticated)/   # Route group for authenticated pages (future)
│   │   ├── api/               # API routes (future)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Basic UI components (Button, Card, etc.)
│   │   ├── channel/          # Channel-specific components
│   │   ├── server/           # Server-specific components
│   │   └── shared/           # Shared components across domains
│   ├── lib/                   # Core utilities and configurations
│   │   ├── utils.ts          # Helper functions (cn, formatDate, etc.)
│   │   ├── constants.ts      # App constants and enums
│   │   └── api-client.ts     # Configured Axios client
│   ├── services/              # Business logic & API calls
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   │   ├── channel.ts        # Channel types
│   │   ├── message.ts        # Message types
│   │   └── server.ts         # Server types
│   ├── context/               # React Context providers
│   ├── layouts/               # Layout components
│   ├── mocks/                 # Mock data for development/testing
│   └── assets/                # Static assets (images, fonts, etc.)
├── public/                    # Public static files
└── .env.example               # Environment variables template
```

### Directory Purpose

- **`app/`** - Next.js 14 App Router with pages, layouts, and routing
- **`components/`** - Reusable UI components organized by domain (see
  [components/README.md](src/components/README.md))
- **`lib/`** - Shared utilities, constants, and configurations
- **`services/`** - API service layer and business logic
- **`types/`** - TypeScript type definitions aligned with dev spec data schemas
- **`hooks/`** - Custom React hooks for shared logic
- **`context/`** - React Context providers for global state
- **`layouts/`** - Shared layout components
- **`mocks/`** - Mock data for development and testing

## Path Aliases

TypeScript is configured with path aliases for cleaner imports:

```typescript
// Instead of: import { Button } from '../../../components/ui/Button'
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
```

The `@/` alias maps to `src/`.

## Example Components

The project includes example components demonstrating the architecture:

- **UI Components**: `Button`, `Card` - Basic reusable components
- **Channel Components**: `MessageCard`, `MessageList`, `GuestPromoBanner` - From dev spec M1
- **Server Components**: `ServerSidebar` - Server navigation component

These components align with the dev spec class diagrams (C1.3, C1.4, C1.5, C1.6).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required runtime values:

- `NEXT_PUBLIC_BASE_URL`: canonical frontend origin used for absolute public URLs, `metadataBase`,
  `robots.txt`, and sitemap entrypoints
- `NEXT_PUBLIC_API_URL`: public backend API origin used by browser code and server-side frontend
  fetches

Per `docs/deployment/deployment-architecture.md`, the frontend apex domain owns the public SEO
contract. The frontend hosts canonical URLs, `metadataBase`, `robots.txt`, and sitemap entrypoints,
while backend sitemap routes remain internal/transitional XML sources.

## Deployment (Vercel)

The frontend is deployed on Vercel at `https://harmony-dun-omega.vercel.app`. Project settings,
required environment variables for preview vs production, and the verification checklist live in
[`docs/deployment/vercel-setup.md`](../docs/deployment/vercel-setup.md).

## Code Quality

- **Linting**: `npm run lint`
- **TypeScript**: Strict mode enabled in `tsconfig.json`

## Development Specifications

This frontend implementation is based on the following dev specs in the repository root:

- `docs/dev-spec-channel-visibility-toggle.md`
- `docs/dev-spec-guest-public-channel-view.md`
- `docs/dev-spec-seo-meta-tag-generation.md`

All specs specify **Next.js 14.0+ (T3)** for SSR/SSG capabilities required for SEO optimization.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Harmony Project](https://github.com/acabrera04/Harmony) - main repository
