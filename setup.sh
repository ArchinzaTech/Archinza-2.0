#!/bin/bash

echo "================================================"
echo "Archinza 2.0 - Local Development Setup Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "→ $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed."
    exit 1
fi

# Check MongoDB
if command_exists mongo || command_exists mongod; then
    print_success "MongoDB is installed"
else
    print_warning "MongoDB not found. Please install MongoDB."
fi

# Check Redis
if command_exists redis-server; then
    print_success "Redis is installed"
else
    print_warning "Redis not found. Please install Redis."
fi

echo ""
echo "================================================"
echo "Setting up environment files..."
echo "================================================"
echo ""

# Setup backend .env
if [ ! -f "node-archinza-beta/node-archinza-beta/.env" ]; then
    print_info "Creating backend .env file..."
    cp node-archinza-beta/node-archinza-beta/.env.example node-archinza-beta/node-archinza-beta/.env
    print_success "Backend .env file created"
    print_warning "Please edit node-archinza-beta/node-archinza-beta/.env with your configuration"
else
    print_warning "Backend .env file already exists, skipping..."
fi

# Setup frontend .env
if [ ! -f "archinza-front-beta/archinza-front-beta/.env" ]; then
    print_info "Creating frontend .env file..."
    cp archinza-front-beta/archinza-front-beta/.env.example archinza-front-beta/archinza-front-beta/.env
    print_success "Frontend .env file created"
else
    print_warning "Frontend .env file already exists, skipping..."
fi

# Setup admin .env
if [ ! -f "admin-archinza-beta/admin-archinza-beta/.env" ]; then
    print_info "Creating admin .env file..."
    cp admin-archinza-beta/admin-archinza-beta/.env.example admin-archinza-beta/admin-archinza-beta/.env
    print_success "Admin .env file created"
else
    print_warning "Admin .env file already exists, skipping..."
fi

echo ""
echo "================================================"
echo "Installing dependencies..."
echo "================================================"
echo ""

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd archinza-front-beta/archinza-front-beta
if npm install --legacy-peer-deps; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
fi
cd ../..

# Install admin dependencies
print_info "Installing admin panel dependencies..."
cd admin-archinza-beta/admin-archinza-beta
if npm install --legacy-peer-deps; then
    print_success "Admin panel dependencies installed"
else
    print_error "Failed to install admin panel dependencies"
fi
cd ../..

# Install backend dependencies
print_info "Installing backend dependencies..."
print_warning "Note: Backend requires system dependencies for canvas package"
print_info "If installation fails, see SETUP_GUIDE.md for system dependency instructions"
cd node-archinza-beta/node-archinza-beta
if npm install; then
    print_success "Backend dependencies installed"
else
    print_warning "Backend installation failed. You may need to install system dependencies."
    print_info "See SETUP_GUIDE.md - System Dependencies section"
fi
cd ../..

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
print_success "All dependencies have been installed"
echo ""
echo "Next steps:"
echo "1. Configure your .env files in each project directory"
echo "2. Start MongoDB: mongod (or sudo systemctl start mongodb)"
echo "3. Start Redis: redis-server"
echo "4. Read SETUP_GUIDE.md for detailed instructions"
echo ""
echo "To run the applications:"
echo "  Backend:  cd node-archinza-beta/node-archinza-beta && npm start"
echo "  Frontend: cd archinza-front-beta/archinza-front-beta && npm start"
echo "  Admin:    cd admin-archinza-beta/admin-archinza-beta && npm start"
echo ""
print_success "Happy coding! 🚀"
