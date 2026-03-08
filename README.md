# PostPilot -- Social Media Scheduler

A full-stack social media scheduling platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Backend API | Hono |
| Auth | NextAuth.js (Google, GitHub, Credentials) |
| Database | PostgreSQL + Prisma |
| Queue | Redis + BullMQ |
| File Storage | Cloudinary |

## Project Structure

```
socialmedia-schedular/
  frontend/               # Next.js app (pages, API routes, components)
  backend/                # Hono worker server (BullMQ processor)
  prisma/                 # Shared database schema + seed
  .env                    # Environment variables
  package.json            # Root workspace orchestrator
```

---

## Prerequisites (Install These First)

### 1. Node.js (v20+)
- Download from https://nodejs.org/en/download
- After install, verify by running: node --version

### 2. PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- During installation:
  - Set the superuser password to "postgres" (or any password you choose)
  - Keep the default port 5432
  - When asked about pgAdmin, install it too (useful database GUI tool)
- After install, verify: open pgAdmin or run "psql -U postgres" in a terminal

### 3. Redis for Windows
- Option A (Recommended): Download Memurai from https://www.memurai.com/get-memurai
  - Memurai is a Redis-compatible server that runs natively on Windows
  - It installs as a Windows Service and starts automatically
- Option B: Download community Redis from https://github.com/tporadowski/redis/releases
- Option C: If you have WSL, run: wsl --install, then sudo apt install redis-server
- After install, verify by running: redis-cli ping (should return PONG)

---

## Setup Steps (Run These In Order)

### Step 1: Create the PostgreSQL Database

Open pgAdmin (installed with PostgreSQL) or open a terminal and run:

```
psql -U postgres
```

Then run this SQL command:

```
CREATE DATABASE socialmedia_schedular;
```

Type \q to exit psql.

### Step 2: Update .env (if needed)

The .env file is already in the project root with default values.
If you used a DIFFERENT password during PostgreSQL install, update this line:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/socialmedia_schedular?schema=public"
```

Then copy .env to both subfolders (from project root):

```
copy .env frontend\.env
copy .env backend\.env
```

### Step 3: Install Dependencies

Run these commands from the project root (d:\socialmedia-schedular):

```
cd frontend
npm install

cd ..\backend
npm install

cd ..
npm install
```

### Step 4: Generate Prisma Client and Push Schema to Database

```
npm run db:generate
npm run db:push
```

This creates all the database tables in PostgreSQL automatically.

### Step 5: Seed Demo Data (Optional but Recommended)

```
npm run db:seed
```

This creates a demo user (demo@example.com) with 6 sample posts.

### Step 6: Start the App

```
npm run dev
```

This starts both:
- Frontend (Next.js) on http://localhost:3000
- Backend worker (Hono + BullMQ) on http://localhost:4000

### Step 7: Open in Browser

Go to: http://localhost:3000

To sign in with the demo account:
- Click "Demo Account" on the sign-in page
- Email: demo@example.com
- Password: anything (demo mode accepts any password)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start both frontend + backend |
| npm run dev:frontend | Start Next.js dev server only |
| npm run dev:backend | Start Hono worker only |
| npm run build | Production build (frontend) |
| npm run db:generate | Generate Prisma client |
| npm run db:push | Push schema to database |
| npm run db:migrate | Create migration |
| npm run db:studio | Open Prisma Studio (database GUI) |
| npm run db:seed | Seed demo data |

---

## Key Features

### Post Management
- Create, edit, delete posts
- Multi-platform selection (Twitter, Facebook, LinkedIn, Instagram)
- Image/video upload via Cloudinary

### Smart Scheduling (BullMQ)
- Schedule posts for exact date and time
- Background processing with retry on failure
- Cancel/reschedule posts

### Analytics Dashboard
- Post status overview (Draft, Scheduled, Published, Failed)
- Platform performance breakdown
- Success rate tracking

### Calendar View
- Visual calendar of scheduled posts
- Day-by-day breakdown

### Authentication
- Google OAuth (optional, needs API keys)
- GitHub OAuth (optional, needs API keys)
- Demo credentials (works out of the box)
- JWT session management
- Protected routes with middleware

---

## OAuth Setup (OPTIONAL -- Demo login works without this)

### Google OAuth
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or select existing)
3. Go to "OAuth consent screen" and configure it
4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
5. Application type: Web application
6. Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
7. Copy the Client ID and Client Secret into your .env file

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Application name: PostPilot (or anything)
4. Homepage URL: http://localhost:3000
5. Authorization callback URL: http://localhost:3000/api/auth/callback/github
6. Copy the Client ID and Client Secret into your .env file

### Cloudinary (for image uploads)
1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. From your dashboard, copy Cloud Name, API Key, and API Secret into .env

---

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running (check Windows Services for "postgresql")
- Make sure the database "socialmedia_schedular" exists
- Check the password in your .env matches your PostgreSQL password

### "Cannot connect to Redis"
- Make sure Memurai/Redis is running (check Windows Services for "Memurai" or "Redis")
- Run "redis-cli ping" to verify. It should return PONG

### "NEXTAUTH_SECRET" error
- The .env already has a default secret. Just make sure .env is copied to frontend/.env

### Prisma errors
- Run: npm run db:generate
- Then: npm run db:push

## License

MIT
