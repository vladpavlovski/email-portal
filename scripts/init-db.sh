#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}MailPortal Database Initialization${NC}"
echo "===================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${RED}! Please edit .env with your configuration before continuing${NC}"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if docker-compose ps | grep -q "postgres.*Up"; then
    echo -e "${GREEN}✓ PostgreSQL container is running${NC}"
else
    echo -e "${YELLOW}Starting PostgreSQL container...${NC}"
    docker-compose up -d postgres
    sleep 5
fi

# Initialize database
echo -e "${YELLOW}Initializing database schema...${NC}"
docker exec -i mailportal_db psql -U $DB_USER -d $DB_NAME < apps/backend/src/db/schema.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database schema initialized${NC}"
else
    echo -e "${YELLOW}Database already initialized or error occurred${NC}"
fi

# Generate admin password
echo -e "\n${YELLOW}Generating admin password...${NC}"
ADMIN_PASSWORD=$(openssl rand -base64 12)
ADMIN_HASH=$(docker run --rm node:20-alpine node -e "const bcrypt = require('bcrypt'); bcrypt.hash('$ADMIN_PASSWORD', 10).then(console.log)" 2>/dev/null | tail -n 1)

# Update admin password
echo -e "${YELLOW}Setting admin password...${NC}"
docker exec -i mailportal_db psql -U $DB_USER -d $DB_NAME -c "UPDATE users SET password_hash = '$ADMIN_HASH' WHERE email = 'admin@mailportal.local';" >/dev/null 2>&1

echo -e "\n${GREEN}Database initialization complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Admin credentials:"
echo -e "Email: ${YELLOW}admin@mailportal.local${NC}"
echo -e "Password: ${YELLOW}$ADMIN_PASSWORD${NC}"
echo -e "\n${RED}! Save these credentials securely. The password won't be shown again.${NC}"