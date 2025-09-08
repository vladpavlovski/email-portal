# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Docker and Docker Compose (for containerized deployment)
- DirectAdmin server with API access

## Development Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd mailportal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
```

### 4. Configure your environment
Edit the `.env` files with your configuration:
- Database credentials
- JWT secret (generate a secure random string)
- DirectAdmin API credentials
- CORS origin for frontend

### 5. Set up the database
```bash
# If using local PostgreSQL
psql -U postgres < apps/backend/src/db/schema.sql

# Or use Docker
docker-compose up -d postgres
docker exec -i mailportal_db psql -U postgres mailportal < apps/backend/src/db/schema.sql
```

### 6. Update admin password
The database includes a default admin user. Generate a bcrypt hash for your password:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(console.log)"
```

Update the admin user in the database:
```sql
UPDATE users SET password_hash = 'your-generated-hash' WHERE email = 'admin@mailportal.local';
```

### 7. Start development servers
```bash
npm run dev
```

This will start:
- Backend API at http://localhost:5000
- Frontend at http://localhost:5173

## Docker Development

### 1. Start all services with Docker Compose
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend API at http://localhost:5000
- Frontend at http://localhost

### 2. View logs
```bash
docker-compose logs -f
```

### 3. Stop services
```bash
docker-compose down
```

## Environment Variables

### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mailportal
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# DirectAdmin Configuration
DIRECTADMIN_URL=https://your-directadmin-server.com:2222
DIRECTADMIN_USERNAME=admin
DIRECTADMIN_PASSWORD=your-directadmin-password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Root Environment Variables (for Docker)

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=mailportal
DB_USER=postgres
DB_PASSWORD=your-secure-database-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# DirectAdmin Configuration
DIRECTADMIN_URL=https://your-directadmin-server.com:2222
DIRECTADMIN_USERNAME=admin
DIRECTADMIN_PASSWORD=your-directadmin-password

# CORS Configuration (for production, use your domain)
CORS_ORIGIN=http://localhost
```