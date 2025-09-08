# Deployment Guide

## Production Deployment with Docker

### 1. Prepare environment
```bash
cp .env.example .env.production
# Edit .env.production with production values
```

### 2. Build and run with production compose file
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. SSL/TLS Configuration
For production, you should use a reverse proxy like Nginx or Traefik to handle SSL certificates. Here's an example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Deployment to Coolify

### 1. Create a new application in Coolify
- Choose "Docker Compose" as the deployment method
- Use the `docker-compose.prod.yml` file

### 2. Configure environment variables in Coolify
Set all required environment variables through the Coolify interface:
- `DOMAIN`: Your application domain
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (use a strong, random string)
- `DIRECTADMIN_URL`, `DIRECTADMIN_USERNAME`, `DIRECTADMIN_PASSWORD`
- `CORS_ORIGIN`: Your frontend URL

### 3. Deploy
Coolify will handle the build and deployment process automatically

## Manual VPS Deployment

### 1. Install Docker and Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone the repository
```bash
git clone <repository-url> /opt/mailportal
cd /opt/mailportal
```

### 3. Set up environment
```bash
cp .env.example .env
# Edit .env with production values
```

### 4. Start the application
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Set up systemd service (optional)
Create `/etc/systemd/system/mailportal.service`:

```ini
[Unit]
Description=MailPortal Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/mailportal
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable mailportal
sudo systemctl start mailportal
```

## Health Checks and Monitoring

### Application Health Check
The backend provides a health endpoint at `/health`:
```bash
curl http://localhost:5000/health
```

### Database Health Check
```bash
docker exec mailportal_db pg_isready -U postgres
```

### Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

## Backup and Restore

### Database Backup
```bash
# Create backup
docker exec mailportal_db pg_dump -U postgres mailportal > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backups with cron
0 2 * * * docker exec mailportal_db pg_dump -U postgres mailportal > /backups/mailportal_$(date +\%Y\%m\%d).sql
```

### Database Restore
```bash
docker exec -i mailportal_db psql -U postgres mailportal < backup.sql
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong, unique JWT secret
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up firewall rules (only expose necessary ports)
- [ ] Enable automatic security updates
- [ ] Configure backup retention policy
- [ ] Monitor application logs for suspicious activity
- [ ] Keep Docker images updated
- [ ] Use environment-specific .env files
- [ ] Restrict database access to application only