# Email Portal Backend

## Overview
This is the backend API for the Email Portal application, which allows users to create and manage email accounts through DirectAdmin integration.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- DirectAdmin server with API access

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
- Set your MongoDB connection string
- Configure DirectAdmin credentials and URL
- Set a secure JWT secret
- Configure other settings as needed

4. Seed the initial admin user:
```bash
npm run seed:admin
```

Default admin credentials:
- Username: admin
- Email: admin@example.com
- Password: admin123456

**Important:** Change the admin password after first login!

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Email Management
- `GET /api/emails` - Get user's email accounts
- `POST /api/emails` - Create new email account
- `GET /api/emails/stats` - Get email statistics
- `GET /api/emails/all` - Get all emails (admin only)
- `GET /api/emails/:id` - Get single email account
- `DELETE /api/emails/:id` - Delete email account (admin only)

### Domain Management
- `GET /api/domains` - Get all domains
- `POST /api/domains` - Create domain (admin only)
- `GET /api/domains/stats` - Get domain statistics (admin only)
- `GET /api/domains/:id` - Get single domain
- `PUT /api/domains/:id` - Update domain (admin only)
- `DELETE /api/domains/:id` - Delete domain (admin only)

### User Management (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## DirectAdmin Integration
The application integrates with DirectAdmin API to:
- Create email accounts with secure passwords
- Check if email accounts exist
- Delete email accounts
- Set email quotas

Ensure your DirectAdmin server is properly configured and accessible from the backend server.

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (to be implemented)
- CORS configuration
- Helmet.js for security headers

## Error Handling
The API uses consistent error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Database Models
- **User**: System users with roles (user/admin)
- **Domain**: Available domains for email creation
- **EmailAccount**: Created email accounts with metadata