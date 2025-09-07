# MailPortal - Email Self-Service Portal

MailPortal is a modern web application that allows users to create and manage email accounts through a self-service portal integrated with DirectAdmin. Built as a monorepo using Turborepo, it features a React frontend and Node.js/Express backend with PostgreSQL database.

## Features

### User Features
- **Self-Service Email Creation**: Users can create email accounts on pre-approved domains
- **Email Account Management**: View all created email accounts with metadata
- **Secure Password Generation**: Automatically generates strong passwords for new accounts
- **User Dashboard**: Clean, responsive interface for managing email accounts

### Admin Features
- **User Management**: Enable/disable user accounts and email creation permissions
- **Domain Management**: Add, edit, and manage available domains for email creation
- **Comprehensive Overview**: View all email accounts across the system
- **Role-Based Access Control**: Secure admin-only features

### Technical Features
- **DirectAdmin Integration**: Automated email account creation via DirectAdmin API
- **JWT Authentication**: Secure token-based authentication
- **Docker Support**: Ready for deployment with Docker and Docker Compose
- **Monorepo Architecture**: Organized codebase using Turborepo
- **TypeScript**: Full type safety across frontend and backend
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, React Query
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Authentication**: JWT tokens with role-based access control
- **Monorepo**: Turborepo for efficient builds and development
- **Deployment**: Docker, Docker Compose, optimized for Coolify

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mailportal
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your DirectAdmin credentials
   ```

3. **Initialize database with admin user**
   ```bash
   ./scripts/init-db.sh
   # This will create the database and generate admin credentials
   ```

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Manual Setup

See [docs/SETUP.md](docs/SETUP.md) for detailed manual setup instructions.

## Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment options
- [API Documentation](docs/API.md) - Complete API reference

## Project Structure

```
mailportal/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # React application
├── packages/
│   ├── shared/          # Shared types and schemas
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── scripts/             # Utility scripts
├── docs/               # Documentation
├── docker-compose.yml   # Development Docker setup
└── docker-compose.prod.yml # Production Docker setup
```

## Default Login

After running `./scripts/init-db.sh`, you'll receive admin credentials. The default admin email is:
- Email: `admin@mailportal.local`
- Password: (generated during setup)

## Security Notes

- Always change default passwords in production
- Use strong JWT secrets (generate with `openssl rand -base64 32`)
- Enable HTTPS in production environments
- Keep DirectAdmin credentials secure
- Regular security updates recommended

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.