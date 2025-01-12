# Artist Compare App

A full-stack application that allows users to compare music artists across multiple platforms, visualizing their social media presence, streaming statistics, and overall influence in the music industry.

## Features
- Compare artist statistics across multiple platforms (Spotify, YouTube, Instagram, etc.)
- Interactive data visualizations and charts
- Real-time analytics tracking
- Artist profile management
- Cross-platform social media metrics

## Technology Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase, PostgreSQL with pgvector
- **Infrastructure**: Docker, Docker Compose
- **APIs**: Spotify, YouTube, LastFM, Instagram
- **AI Integration**: OpenAI, Anthropic Claude, Google Gemini

## Setup and Installation

### Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Install [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres?schema=public

# API Keys
NEXT_PUBLIC_SPOTIFY_ID=your_spotify_id
NEXT_PUBLIC_SPOTIFY_SECRET=your_spotify_secret
NEXT_PUBLIC_YOUTUBE_API=your_youtube_api_key
NEXT_PUBLIC_LASTFM_API_KEY=your_lastfm_api_key
NEXT_PUBLIC_LASTFM_SECRET=your_lastfm_secret
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GEMINI_API_KEY=your_gemini_key
```

### Project Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── features/    # Feature-specific components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions
├── types/           # TypeScript types
└── store/           # State management
```

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

### Development Environment

The application will be available at:
- Frontend: http://localhost:3000
- Supabase Studio: http://localhost:3001
- Database: postgresql://postgres:postgres@localhost:5432/postgres

### Database Initialization

The database is automatically initialized with required extensions and roles through the `init.sql` file. This includes:
- pgvector extension for vector operations
- pg_stat_statements extension
- Required Supabase roles and permissions

### Useful Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web

# Stop all containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Remove volumes (will delete database data)
docker-compose down -v
```

## API Integration

### Required API Keys
To fully utilize the application, you'll need to obtain API keys from:
- [Spotify Developer Portal](https://developer.spotify.com/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [LastFM API](https://www.last.fm/api)
- [OpenAI](https://platform.openai.com/)
- [Anthropic](https://www.anthropic.com/)
- [Google AI Studio](https://makersuite.google.com/)

## Troubleshooting

### Common Issues

1. If the web service fails to start:
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]
