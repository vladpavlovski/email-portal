# Email Portal - Self-Service Email Account Management

A web application that provides a self-service portal for customers to request and manage email accounts across multiple domains, integrated with DirectAdmin control panel.

## Features

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
- **DirectAdmin Integration**: Automated email account creation via DirectAdmin API
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: Well-structured backend API
- **Modern UI**: Responsive Material-UI based interface
- **Docker Support**: Easy deployment with Docker Compose

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB for data storage
- JWT for authentication
- DirectAdmin API integration
- TypeScript support

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Query for API state management
- React Hook Form for form handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- DirectAdmin server with API access
- Docker and Docker Compose (for containerized deployment)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd email-portal
```

2. Create environment file:
```bash
cp .env.example .env
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

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

4. Start MongoDB locally

5. Seed admin user:
```bash
npm run seed:admin
```

6. Start the backend:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the frontend:
```bash
npm start
```

## Default Admin Credentials

After seeding, use these credentials:
- Username: admin
- Email: admin@example.com
- Password: admin123456

**Important:** Change the admin password immediately after first login!

## API Documentation

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

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **DirectAdmin Credentials**: Store securely and use minimal required permissions
4. **HTTPS**: Always use HTTPS in production
5. **Database Security**: Secure MongoDB with authentication and network restrictions

## Deployment

### Production Deployment with Docker

1. Update `docker-compose.yml` for production:
   - Use environment-specific configurations
   - Set up proper volumes for data persistence
   - Configure reverse proxy (nginx/traefik)

2. Use Docker secrets for sensitive data:
```bash
docker secret create directadmin_password ./secret_file
```

3. Set up SSL/TLS certificates

4. Configure backup strategies for MongoDB data

### Scaling Considerations

- Use MongoDB replica sets for high availability
- Implement Redis for session management
- Use load balancers for multiple backend instances
- Configure CDN for static assets

## Troubleshooting

### Common Issues

1. **DirectAdmin Connection Failed**
   - Verify DirectAdmin URL and credentials
   - Check network connectivity
   - Ensure DirectAdmin API is enabled

2. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string
   - Ensure proper authentication

3. **Email Creation Fails**
   - Check domain exists in DirectAdmin
   - Verify user has creation permissions
   - Check DirectAdmin quotas

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Email template management
- [ ] Bulk email creation
- [ ] Email forwarding configuration
- [ ] Quota management interface
- [ ] Multi-language support
- [ ] Advanced reporting and analytics
- [ ] API rate limiting
- [ ] Two-factor authentication