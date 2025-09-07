# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "canCreateEmails": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### GET /auth/profile
Get current user profile. Requires authentication.

### PUT /auth/profile
Update current user profile. Requires authentication.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST /auth/change-password
Change user password. Requires authentication.

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Email Accounts

### GET /email-accounts/my-accounts
Get all email accounts for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "john@example.com",
    "domainId": "domain-uuid",
    "domain": {
      "id": "domain-uuid",
      "name": "example.com",
      "isActive": true
    },
    "userId": "user-uuid",
    "quota": 1024,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST /email-accounts
Create a new email account. Requires authentication and email creation permission.

**Request Body:**
```json
{
  "username": "john.doe",
  "domainId": "domain-uuid"
}
```

**Response:**
```json
{
  "email": "john.doe@example.com",
  "password": "generated-secure-password",
  "account": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "domainId": "domain-uuid",
    "userId": "user-uuid",
    "quota": 1024,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /email-accounts
Get all email accounts (Admin only).

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `domainId` (optional): Filter by domain ID

### GET /email-accounts/:id
Get a specific email account by ID.

## Domains

### GET /domains
Get all domains.

**Query Parameters:**
- `activeOnly` (optional): If true, only return active domains

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "example.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST /domains
Create a new domain (Admin only).

**Request Body:**
```json
{
  "name": "newdomain.com",
  "isActive": true
}
```

### PUT /domains/:id
Update a domain (Admin only).

**Request Body:**
```json
{
  "name": "updateddomain.com",
  "isActive": false
}
```

### DELETE /domains/:id
Delete a domain (Admin only). This will also delete all associated email accounts.

## User Management (Admin Only)

### GET /users
Get all users.

**Query Parameters:**
- `role` (optional): Filter by role (user, admin)
- `isActive` (optional): Filter by active status

### GET /users/:id
Get a specific user by ID.

### PUT /users/:id
Update a user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "canCreateEmails": false
}
```

### POST /users/:id/toggle-status
Toggle user active status.

### POST /users/:id/toggle-email-permission
Toggle user's email creation permission.

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "details": {} // Optional, for validation errors
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict (e.g., email already exists)
- 500: Internal Server Error