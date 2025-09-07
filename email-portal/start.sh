#!/bin/bash

# Email Portal Quick Start Script

echo "Email Portal - Quick Start"
echo "========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit the .env file and add your DirectAdmin credentials!"
    echo "Press Enter to continue after updating .env file..."
    read
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Seed admin user
echo "Seeding admin user..."
docker-compose exec backend sh -c "cd /app && npm run seed:admin"

echo ""
echo "========================="
echo "Email Portal is now running!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo "Default admin credentials:"
echo "Username: admin"
echo "Email: admin@example.com"
echo "Password: admin123456"
echo ""
echo "IMPORTANT: Change the admin password after first login!"
echo "========================="