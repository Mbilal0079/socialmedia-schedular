# PostPilot - Copilot Instructions

## Project Overview
PostPilot is a full-stack social media scheduler built with:
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Backend**: Hono (Node.js) for background worker
- **Auth**: NextAuth.js (Google, GitHub, Credentials)
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis for scheduling posts
- **File Storage**: Cloudinary

## Project Structure
```
socialmedia-schedular/
├── frontend/               # Next.js Application
│   └── src/
│       ├── app/            # Next.js App Router pages
│       │   ├── api/        # API routes (posts, upload, analytics, auth)
│       │   ├── auth/       # Auth pages (signin)
│       │   ├── dashboard/  # Protected dashboard pages
│       │   └── page.tsx    # Landing page
│       ├── components/     # React components
│       │   ├── ui/         # shadcn/ui components
│       │   ├── layout/     # Sidebar, TopBar
│       │   ├── posts/      # Post creation, list, cards
│       │   └── dashboard/  # Dashboard-specific components
│       ├── lib/            # Utilities & config
│       │   ├── auth.ts     # NextAuth config
│       │   ├── prisma.ts   # Prisma client singleton
│       │   ├── queue.ts    # BullMQ queue setup
│       │   ├── cloudinary.ts # Cloudinary upload helper
│       │   └── validations/  # Zod schemas
│       ├── store/          # Zustand stores
│       └── middleware.ts   # NextAuth middleware
├── backend/                # Hono Worker Server
│   └── src/
│       ├── server/         # Hono API server
│       ├── worker.ts       # BullMQ worker (publish processor)
│       ├── queue.ts        # BullMQ queue config
│       ├── redis.ts        # Redis client
│       └── prisma.ts       # Prisma client
├── prisma/                 # Shared database schema
│   ├── schema.prisma
│   └── seed.ts
└── package.json            # Root workspace orchestrator
```

## Key Conventions
- Use TypeScript strict mode
- Use Zod for ALL form/API validation
- Use Zustand for client state (not Redux)
- Use shadcn/ui components (not MUI/Bootstrap)
- Frontend API routes go in `frontend/src/app/api/`
- Backend worker code goes in `backend/src/`
- All database queries use Prisma
- Background jobs use BullMQ with Redis
- Files upload to Cloudinary
