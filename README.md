This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# artist-compare-app

## Setup and Installation

This application uses Docker for local development. Follow these steps to get the app running:

### Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Install [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

1. Create a `.env.local` file in the root directory with the following variables:

Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres?schema=public
API Keys
NEXT_PUBLIC_SPOTIFY_ID=your_spotify_id
NEXT_PUBLIC_SPOTIFY_SECRET=your_spotify_secret
NEXT_PUBLIC_YOUTUBE_API=your_youtube_api_key
NEXT_PUBLIC_LASTFM_API_KEY=your_lastfm_api_key
NEXT_PUBLIC_LASTFM_SECRET=your_lastfm_secret
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GEMINI_API_KEY=your_gemini_key

### Starting the Application

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the Docker containers:
```bash
docker-compose up -d
```

This will start:
- Next.js application (http://localhost:3000)
- Postgres database with pgvector extension (port 5432)
- Supabase Studio (http://localhost:3001)
- Kong API Gateway (ports 8000, 8443)
- Postgres Meta service

3. The application will be available at:
- Frontend: http://localhost:3000
- Supabase Studio: http://localhost:3001
- Database: postgresql://postgres:postgres@localhost:5432/postgres

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f web

# Stop all containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Remove volumes (will delete database data)
docker-compose down -v
```

### Database Initialization

The database is automatically initialized with required extensions and roles through the `init.sql` file. This includes:
- pgvector extension for vector operations
- pg_stat_statements extension
- Required Supabase roles and permissions

### Development

The application runs in development mode with hot-reloading enabled. Any changes to the source code will automatically trigger a rebuild.

### Troubleshooting

1. If the web service fails to start, check the logs:
```bash
docker-compose logs web
```

2. If you need to reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

3. If environment variables aren't being recognized:
- Ensure your `.env.local` file is properly formatted
- Rebuild the containers: `docker-compose up -d --build`

4. If you get permission errors with the database:
- Ensure the database is properly initialized
- Check the database logs: `docker-compose logs postgres`
```

This README section provides a comprehensive guide for setting up and running your application with Docker. Would you like me to add or modify any sections?
