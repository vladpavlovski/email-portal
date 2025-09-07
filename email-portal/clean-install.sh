#!/bin/bash

# Clean install script for Turborepo
echo "Email Portal - Clean Install"
echo "==========================="

# Clean all node_modules and lock files
echo "Cleaning node_modules and lock files..."
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "package-lock.json" -type f -delete
find . -name "dist" -type d -prune -exec rm -rf '{}' +
find . -name "build" -type d -prune -exec rm -rf '{}' +
find . -name ".turbo" -type d -prune -exec rm -rf '{}' +

# Install dependencies
echo "Installing dependencies..."
npm install

# Build shared packages
echo "Building shared packages..."
npm run build --workspace=@email-portal/shared-types

echo ""
echo "==========================="
echo "Clean install completed!"
echo ""
echo "You can now run:"
echo "  npm run dev    - Start development servers"
echo "  npm run build  - Build all packages"
echo "  npm run lint   - Lint all packages"
echo "==========================="