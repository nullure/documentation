---
title: Installation
description: Comprehensive installation guide for OpenMemory across different environments and platforms
---

# Installation

Comprehensive installation guide for OpenMemory across different environments and platforms.

## System Requirements

### Minimum Requirements

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB available space
- **OS**: Linux, macOS, or Windows (WSL2 recommended)

### Recommended for Production

- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 22.04 LTS or similar

## Installation Methods

### Method 1: Docker (Recommended)

Docker provides the easiest and most reliable installation method.

#### Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

#### Installation Steps

```bash
# Clone repository
git clone https://github.com/caviraoss/openmemory.git
cd openmemory

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f openmemory
```

#### Docker Compose Configuration

The default `docker-compose.yml` includes:

```yaml
version: '3.8'
services:
  openmemory:
    build: ./backend
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/openmemory
      EMBEDDING_PROVIDER: local
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: openmemory
      POSTGRES_PASSWORD: password

volumes:
  postgres_data:
```

### Method 2: From Source (Recommended for Development)

Build and run from source code.

#### Backend Setup

```bash
# Clone repository
git clone https://github.com/caviraoss/openmemory.git
cd openmemory/backend

# Install dependencies
npm install

# Set up environment variables
# Create .env file with your configuration
nano .env  # or use your preferred editor

# Build project
npm run build

# Start server
npm start
```

#### Dashboard (Optional)

```bash
cd ../dashboard

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Method 4: Python SDK Only

If you only need the client SDK:

```bash
# Install from PyPI
pip install openmemory-py

# Or from source
git clone https://github.com/caviraoss/openmemory.git
cd openmemory/sdk-py
pip install -e .
```

### Method 5: JavaScript/TypeScript SDK Only

If you only need the JavaScript SDK:

```bash
# Install from npm
npm install openmemory-js

# Or with yarn
yarn add openmemory-js

# Or from source
git clone https://github.com/caviraoss/openmemory.git
cd openmemory/sdk-js
npm install
npm run build
```

## Database Setup

### PostgreSQL Installation

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows

Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE openmemory;
CREATE USER openmemory_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE openmemory TO openmemory_user;
\q
```

### Run Migrations

```bash
cd backend

# Using npm
npm run migrate

# Or manually
psql -U openmemory_user -d openmemory -f migrations/001_initial.sql
```

## Configuration

### Environment Variables

Create `.env` in the backend directory:

```env
# === Database (Choose one) ===
# SQLite (default, no setup required)
OM_DB_TYPE=sqlite
OM_DB_PATH=./data/openmemory.sqlite

# PostgreSQL (for production)
# OM_DB_TYPE=postgres
# OM_DB_HOST=localhost
# OM_DB_PORT=5432
# OM_DB_NAME=openmemory
# OM_DB_USER=postgres
# OM_DB_PASSWORD=yourpassword
# OM_DB_SCHEMA=public
# OM_DB_TABLE=memories

# === Server ===
OM_PORT=8080
OM_HOST=0.0.0.0

# === API Key (Optional) ===
OM_API_KEY=your_secret_api_key_here

# === Embedding Provider ===
# Options: openai, gemini, voyage
OM_EMBED_PROVIDER=openai
OM_OPENAI_API_KEY=sk-...

# Or for Gemini:
# OM_EMBED_PROVIDER=gemini
# OM_GEMINI_API_KEY=...

# Or for Voyage AI:
# OM_EMBED_PROVIDER=voyage
# OM_VOYAGE_API_KEY=...

# === Memory Tier ===
# Options: fast, smart, deep, hybrid
OM_TIER=smart

# === Vector Dimensions ===
OM_VEC_DIM=1536

# === Hybrid Tier Settings (if using OM_TIER=hybrid) ===
OM_KEYWORD_BOOST=2.5
OM_KEYWORD_MIN_LENGTH=3

# === Logging ===
OM_LOG_LEVEL=info
```

## Verification

### Health Check

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{
  "ok": true,
  "version": "2.0-hsg-tiered",
  "embedding": {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "dimensions": 1536
  },
  "tier": "smart",
  "dim": 1536,
  "cache": 50,
  "expected": {
    "recall": 85,
    "qps": "500-600",
    "ram": "0.9GB/10k",
    "use": "Production servers"
  }
}
```

### Test Memory Operations

```bash
# Add a memory
curl -X POST http://localhost:8080/memory/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "content": "Test memory",
    "metadata": {"test": true}
  }'

# Query memories
curl -X POST http://localhost:8080/memory/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "query": "test",
    "k": 5
  }'
```

## Platform-Specific Notes

### Linux

- Use systemd for service management
- Consider using nginx as reverse proxy
- Enable firewall rules for port 3000

### macOS

- Use Homebrew for dependency management
- Consider using launchd for auto-start
- Allow port 3000 in firewall settings

### Windows (WSL2)

- Install Ubuntu from Microsoft Store
- Run all commands in WSL2 environment
- Access via `localhost:3000` from Windows

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start with PM2
cd backend
pm2 start npm --name openmemory -- start

# Save configuration
pm2 save

# Enable auto-start on boot
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Common Issues

**Port already in use**

```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Database connection failed**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql
# Verify connection
psql -U openmemory_user -d openmemory -c "SELECT 1;"
```

**Permission denied**

```bash
# Fix ownership
sudo chown -R $USER:$USER openmemory/
```

**Out of memory**

- Increase swap space
- Reduce chunk size in configuration
- Use external embedding provider

## Next Steps

- [Quick Start Guide](/docs/quick-start)
- [Configuration Best Practices](/docs/advanced/providers)
- [API Reference](/docs/api/add-memory)
