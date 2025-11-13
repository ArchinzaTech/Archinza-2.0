# Archinza 2.0 - Local Development Setup Guide

Welcome to the Archinza 2.0 setup guide! This document will walk you through setting up the project on your local machine.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [System Dependencies](#system-dependencies)
4. [Installation Steps](#installation-steps)
5. [Configuration](#configuration)
6. [Running the Applications](#running-the-applications)
7. [PyCharm Setup](#pycharm-setup)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview

Archinza 2.0 is a full-stack application consisting of three main components:

1. **node-archinza-beta** - Backend API (Node.js/Express)
2. **archinza-front-beta** - Frontend Application (React)
3. **admin-archinza-beta** - Admin Panel (React)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Current version in use: v22.21.1
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Current version in use: 10.9.4
   - Verify installation: `npm --version`

3. **MongoDB** (Database)
   - Download from: https://www.mongodb.com/try/download/community
   - Required for the backend API
   - Default connection: `mongodb://localhost:27017`

4. **Redis** (Caching/Session Store)
   - Download from: https://redis.io/download
   - Required for the backend API
   - Default connection: `localhost:6379`

5. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

### Optional but Recommended

- **PyCharm Professional** or **WebStorm** (for JavaScript development)
  - Download from: https://www.jetbrains.com/
  - PyCharm Professional includes JavaScript/Node.js support
  - WebStorm is specialized for JavaScript development

---

## System Dependencies

The backend uses the `canvas` package which requires system-level dependencies:

### For Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### For macOS:
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### For Windows:
Follow the Windows installation guide at: https://github.com/Automattic/node-canvas/wiki/Installation:-Windows

---

## Installation Steps

### 1. Clone the Repository

If you haven't already cloned the repository:

```bash
git clone <repository-url>
cd Archinza-2.0
```

### 2. Install Dependencies

#### Frontend Application
```bash
cd archinza-front-beta/archinza-front-beta
npm install --legacy-peer-deps
cd ../..
```

#### Admin Panel
```bash
cd admin-archinza-beta/admin-archinza-beta
npm install --legacy-peer-deps
cd ../..
```

#### Backend API
First, ensure system dependencies are installed (see [System Dependencies](#system-dependencies)), then:

```bash
cd node-archinza-beta/node-archinza-beta
npm install
cd ../..
```

Note: Use `--legacy-peer-deps` if you encounter peer dependency issues.

---

## Configuration

### 1. Backend Configuration

Create a `.env` file in `node-archinza-beta/node-archinza-beta/`:

```bash
cd node-archinza-beta/node-archinza-beta
cp .env.example .env
```

Edit the `.env` file and configure the following essential variables:

```env
# Database
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=archinza
DB_HOST=localhost
DB_PORT=27017

# JWT
JWT_SECRET=your_secure_random_string_here
SESSION_SECRET=your_session_secret_here
JWT_EXPIRE_TIME=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Application URLs
BASE_URL=http://localhost:5000
REACT_APP_URL=http://localhost:3000
APP_MODE=development
```

### 2. Frontend Configuration

Create a `.env` file in `archinza-front-beta/archinza-front-beta/`:

```bash
cd archinza-front-beta/archinza-front-beta
cp .env.example .env
```

Edit the `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_MODE=development
```

### 3. Admin Panel Configuration

Create a `.env` file in `admin-archinza-beta/admin-archinza-beta/`:

```bash
cd admin-archinza-beta/admin-archinza-beta
cp .env.example .env
```

Edit the `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Running the Applications

### Start Services First

1. **Start MongoDB:**
   ```bash
   # macOS/Linux
   sudo systemctl start mongodb
   # or
   mongod

   # Windows
   net start MongoDB
   ```

2. **Start Redis:**
   ```bash
   # macOS/Linux
   redis-server

   # Windows
   redis-server.exe
   ```

### Run the Applications

Open three separate terminal windows/tabs:

#### Terminal 1 - Backend API
```bash
cd node-archinza-beta/node-archinza-beta
npm start
```
The API will run on: http://localhost:5000

#### Terminal 2 - Frontend Application
```bash
cd archinza-front-beta/archinza-front-beta
npm start
```
The frontend will run on: http://localhost:3000

#### Terminal 3 - Admin Panel
```bash
cd admin-archinza-beta/admin-archinza-beta
npm start
```
The admin panel will run on: http://localhost:3001

---

## PyCharm Setup

### Opening the Project in PyCharm

1. **Open PyCharm Professional**

2. **Open the Project:**
   - File → Open
   - Navigate to the `Archinza-2.0` folder
   - Click "Open"

3. **Configure Node.js Interpreter:**
   - Go to: Settings/Preferences → Languages & Frameworks → Node.js
   - Set Node interpreter to your Node.js installation path
   - Apply changes

### Setting Up Run Configurations

#### Backend API Configuration

1. Click "Add Configuration" (top right)
2. Click "+" → npm
3. Configure:
   - **Name:** Backend API
   - **Package.json:** `node-archinza-beta/node-archinza-beta/package.json`
   - **Command:** run
   - **Scripts:** start
4. Click "Apply"

#### Frontend Configuration

1. Click "Add Configuration"
2. Click "+" → npm
3. Configure:
   - **Name:** Frontend
   - **Package.json:** `archinza-front-beta/archinza-front-beta/package.json`
   - **Command:** run
   - **Scripts:** start
4. Click "Apply"

#### Admin Panel Configuration

1. Click "Add Configuration"
2. Click "+" → npm
3. Configure:
   - **Name:** Admin Panel
   - **Package.json:** `admin-archinza-beta/admin-archinza-beta/package.json`
   - **Command:** run
   - **Scripts:** start
4. Click "Apply"

### Running All Services in PyCharm

You can now run each service by:
1. Selecting the configuration from the dropdown
2. Clicking the green Run button

Or run all three simultaneously:
1. Create a "Compound" configuration
2. Add all three npm configurations
3. Run the compound configuration

### Using the PyCharm Terminal

PyCharm has an integrated terminal at the bottom of the window. You can use it to:
- Run npm commands
- Manage git operations
- Execute scripts

Split the terminal into multiple tabs for running different services.

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Port 3000/5000 is already in use`

**Solution:**
```bash
# Find and kill the process using the port
# Linux/macOS
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 2. Canvas Installation Fails

**Error:** `gyp ERR! find Python`

**Solution:**
- Install system dependencies (see [System Dependencies](#system-dependencies))
- Ensure you have Python installed
- On Windows, you may need to install Windows Build Tools:
  ```bash
  npm install --global windows-build-tools
  ```

#### 3. MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check your MongoDB connection string in `.env`
- Verify MongoDB is listening on the correct port (default: 27017)

#### 4. Redis Connection Error

**Error:** `Error: Redis connection refused`

**Solution:**
- Ensure Redis is running
- Check Redis configuration in `.env`
- Test Redis connection: `redis-cli ping` (should return PONG)

#### 5. Peer Dependency Conflicts

**Error:** `ERESOLVE unable to resolve dependency tree`

**Solution:**
```bash
npm install --legacy-peer-deps
```

#### 6. Module Not Found Errors

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Getting Help

If you encounter issues not covered here:
1. Check the application logs in the terminal
2. Review the `.env` configuration files
3. Ensure all prerequisites are properly installed
4. Check if MongoDB and Redis services are running

---

## Additional Notes

### Environment Variables

The `.env.example` files contain all possible configuration options. For local development, you typically only need:
- Database credentials
- JWT secrets
- Redis connection
- API URLs

### Production Deployment

For production deployment:
1. Update `APP_MODE` to `production`
2. Configure production database and Redis instances
3. Set up proper AWS/GCP credentials if using cloud storage
4. Configure email services (SMTP/SendGrid)
5. Set up payment gateways (Razorpay)

### API Documentation

Once the backend is running, you can access:
- API Base: http://localhost:5000/api
- Health Check: http://localhost:5000/health (if configured)

### Development Tips

1. Use `npm start` for development (includes hot reload)
2. Use `npm run build` to create production builds
3. Enable browser DevTools for debugging React applications
4. Use PyCharm debugger for Node.js backend debugging

---

## Quick Start Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed and running
- [ ] Redis installed and running
- [ ] System dependencies for canvas installed (backend only)
- [ ] Repository cloned
- [ ] Dependencies installed for all three projects
- [ ] `.env` files created and configured
- [ ] Backend API running on port 5000
- [ ] Frontend running on port 3000
- [ ] Admin panel running on port 3001
- [ ] PyCharm configured with run configurations

---

Happy coding! 🚀
