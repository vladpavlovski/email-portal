# Email Portal - Self-Service Email Account Management

A modern monorepo application built with Turborepo that provides a self-service portal for customers to request and manage email accounts across multiple domains, integrated with DirectAdmin control panel.

## 🚀 Features

### User Features
- **Self-Service Email Creation**: Users can create email accounts on pre-approved domains
- **Email Management**: View and manage all created email accounts
- **Secure Password Generation**: Automatic generation of strong passwords for new accounts
- **User Dashboard**: Clean interface to manage email requests and view statistics

### Admin Features
- **User Management**: Enable/disable users, grant/revoke email creation permissions
- **Domain Management**: Add, edit, and manage available domains for email creation
- **Comprehensive Dashboard**: View system-wide statistics and usage metrics
- **Role-Based Access Control**: Separate permissions for users and administrators

### Technical Features
- **Turborepo Monorepo**: Efficient builds and development with Turborepo
- **Shared Packages**: Shared types, ESLint, and TypeScript configurations
- **DirectAdmin Integration**: Automated email account creation via DirectAdmin API
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: Well-structured backend API
- **Modern UI**: Responsive Material-UI based interface
- **Docker Support**: Easy deployment with Docker Compose

## 📦 What's Inside?

This Turborepo includes the following packages/apps:

### Apps
- `apps/backend`: Node.js Express API server
- `apps/frontend`: React TypeScript web application

### Packages
- `@email-portal/shared-types`: Shared TypeScript type definitions
- `@email-portal/eslint-config`: Shared ESLint configurations
- `@email-portal/tsconfig`: Shared TypeScript configurations

## 🛠 Technology Stack

### Backend
- Node.js with Express.js
- MongoDB for data storage
- JWT for authentication
- DirectAdmin API integration

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Query for API state management
- React Hook Form for form handling

### Build System
- Turborepo for monorepo management
- npm workspaces for dependency management
- Docker for containerization

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher) - required for workspaces
- MongoDB (v4.4 or higher)
- DirectAdmin server with API access
- Docker and Docker Compose (for containerized deployment)

## 🚀 Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd email-portal
```

2. Create environment file:
```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
```

3. Configure your DirectAdmin credentials in `.env`:
```env
DIRECTADMIN_URL=https://your-directadmin-server.com:2222
DIRECTADMIN_USERNAME=admin
DIRECTADMIN_PASSWORD=your-password
JWT_SECRET=your-secret-key
```

4. Start the application:
```bash
docker-compose up -d
```

5. Seed the admin user:
```bash
docker-compose exec backend npm run seed:admin
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment files:
```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

3. Configure environment variables

4. Build shared packages:
```bash
npm run build --workspace=@email-portal/shared-types
```

5. Start MongoDB locally

6. Seed admin user:
```bash
npm run seed:admin
```

7. Start development servers:
```bash
npm run dev
```

## 🏗 Development

### Available Scripts

In the project root:

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps and packages
- `npm run lint` - Lint all apps and packages
- `npm run test` - Run tests in all apps and packages
- `npm run clean` - Clean all build artifacts

### Working with Turborepo

To run commands for specific apps:
```bash
# Run only the backend
npm run dev --filter=backend

# Build only the frontend
npm run build --filter=frontend

# Run a specific script in a workspace
npm run seed:admin
```

### Adding Dependencies

To add dependencies to specific workspaces:
```bash
# Add to backend
npm install express --workspace=@email-portal/backend

# Add to frontend
npm install axios --workspace=@email-portal/frontend

# Add to shared-types
npm install typescript --workspace=@email-portal/shared-types --save-dev
```

## 🐳 Docker Deployment

The project includes Docker configuration optimized for Turborepo:

1. Build and start containers:
```bash
docker-compose up -d --build
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop containers:
```bash
docker-compose down
```

### Production Deployment

For production deployment:

1. Update environment variables for production
2. Use Docker Swarm or Kubernetes for orchestration
3. Set up proper SSL/TLS certificates
4. Configure reverse proxy (nginx/traefik)
5. Set up MongoDB replica sets for high availability

## 📁 Project Structure

```
email-portal/
├── apps/
│   ├── backend/          # Express.js API server
│   └── frontend/         # React application
├── packages/
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── shared-types/     # Shared TypeScript types
│   └── tsconfig/         # Shared TypeScript configuration
├── docker-compose.yml    # Docker Compose configuration
├── turbo.json           # Turborepo configuration
├── package.json         # Root package.json with workspaces
└── README.md           # This file
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **DirectAdmin Credentials**: Store securely and use minimal required permissions
4. **HTTPS**: Always use HTTPS in production
5. **Database Security**: Secure MongoDB with authentication and network restrictions

## 🧪 Testing

Run tests across all packages:
```bash
npm run test
```

Run tests for specific app:
```bash
npm run test --filter=backend
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatepassword` - Update password

### Email Management
- `GET /api/emails` - Get user's emails
- `POST /api/emails` - Create new email
- `GET /api/emails/:id` - Get specific email
- `DELETE /api/emails/:id` - Delete email (admin only)

### Domain Management (Admin)
- `GET /api/domains` - List domains
- `POST /api/domains` - Create domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain

### User Management (Admin)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♀️ Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺 Roadmap

- [ ] Email template management
- [ ] Bulk email creation
- [ ] Email forwarding configuration
- [ ] Quota management interface
- [ ] Multi-language support
- [ ] Advanced reporting and analytics
- [ ] API rate limiting
- [ ] Two-factor authentication
- [ ] Webhook support for email events
- [ ] Email account suspension/reactivation