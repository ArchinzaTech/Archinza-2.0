# React Guide for Archinza 2.0

## Table of Contents
1. [Overview](#overview)
2. [Version & Setup](#version--setup)
3. [Project Structure](#project-structure)
4. [Core Concepts Used](#core-concepts-used)
5. [Routing](#routing)
6. [State Management](#state-management)
7. [Component Libraries](#component-libraries)
8. [HTTP Client & API Integration](#http-client--api-integration)
9. [Forms & Validation](#forms--validation)
10. [Authentication](#authentication)
11. [UI/UX Enhancements](#uiux-enhancements)
12. [Performance Optimization](#performance-optimization)
13. [Testing](#testing)
14. [Build & Deployment](#build--deployment)
15. [Best Practices](#best-practices)
16. [Common Patterns in Archinza](#common-patterns-in-archinza)
17. [Troubleshooting](#troubleshooting)

---

## Overview

React is the core frontend framework used in **Archinza 2.0** for both the customer-facing application and the admin dashboard. It provides a component-based architecture for building interactive user interfaces.

### Where React is Used

1. **Customer Frontend** (`archinza-front-beta/`)
   - Version: React 18.2.0
   - Purpose: Main customer-facing application
   - Port: 3000 (development)

2. **Admin Dashboard** (`admin-archinza-beta/`)
   - Version: React 18.3.1
   - Purpose: Administrative interface for managing users, content, and business operations
   - Port: 3001 (development)

---

## Version & Setup

### Frontend Application

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1"
}
```

### Admin Application

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-scripts": "5.0.1"
}
```

### Installation

```bash
# Frontend
cd archinza-front-beta/archinza-front-beta
npm install

# Admin
cd admin-archinza-beta/admin-archinza-beta
npm install
```

### Running Development Servers

```bash
# Frontend (Port 3000)
npm start

# Admin (Port 3001)
npm start
```

---

## Project Structure

### Frontend (`archinza-front-beta`)

```
src/
├── components/           # Legacy React components
├── componentsV2/        # Updated/refactored components
├── pages/               # Page-level components (routes)
├── context/             # React Context for global state
├── config/              # API endpoints & configuration
├── helpers/             # Utility functions & HTTP client
├── Animations/          # Animation components (GSAP, AOS)
├── db/                  # Client-side storage/cache
├── App.js               # Root component
└── index.js             # Entry point
```

### Admin (`admin-archinza-beta`)

```
src/
├── pages/               # Admin page components
│   ├── Auth/           # Login/authentication pages
│   ├── User/           # User management pages
│   ├── Roles/          # Role management
│   ├── Content/        # Content management
│   ├── Feedback/       # Feedback handling
│   ├── Logs/           # Activity logs viewer
│   ├── BusinessAccountUsers/
│   └── NewsletterSubscriptions/
├── components/          # Shared/reusable components
├── config/              # API configuration & permissions
├── helpers/             # Utility functions
├── models/              # Data models/types
├── App.js
└── index.js
```

---

## Core Concepts Used

### 1. Functional Components

Archinza uses **functional components** exclusively (no class components).

```javascript
// Example from Archinza
const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### 2. React Hooks

**Core Hooks Used:**
- `useState` - Local component state
- `useEffect` - Side effects (API calls, subscriptions)
- `useContext` - Global state via Context API
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized computed values
- `useRef` - DOM references & mutable values
- `useNavigate` - Programmatic navigation (React Router v6)
- `useParams` - URL parameters
- `useLocation` - Current location object

**Custom Hooks:**
- `useIntersectionObserver` (from react-intersection-observer)
- Custom hooks in `react-use` library

### 3. JSX & Rendering

```javascript
// Conditional rendering
{isAuthenticated ? <Dashboard /> : <Login />}

// List rendering
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// Fragment usage
<>
  <Header />
  <Content />
</>
```

---

## Routing

### React Router DOM v6

**Frontend Version:** 6.14.1
**Admin Version:** 6.23.1

### Basic Setup

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation

```javascript
import { useNavigate, Link } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
    // or with state
    navigate('/profile', { state: { userId: 123 } });
  };

  return (
    <>
      <Link to="/about">About</Link>
      <button onClick={handleClick}>Go to Dashboard</button>
    </>
  );
}
```

### Route Parameters

```javascript
import { useParams, useLocation } from 'react-router-dom';

function Profile() {
  const { userId } = useParams();
  const location = useLocation();
  const stateData = location.state;

  return <div>User ID: {userId}</div>;
}
```

### Protected Routes

```javascript
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## State Management

### 1. Context API

Archinza uses **React Context** for global state management (no Redux).

```javascript
// context/UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

**Usage:**

```javascript
// App.js
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* routes */}
      </Routes>
    </UserProvider>
  );
}

// Component
import { useUser } from './context/UserContext';

function Header() {
  const { user, logout } = useUser();

  return (
    <div>
      <span>Welcome, {user?.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Local State with useState

```javascript
function FormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      {/* other fields */}
    </form>
  );
}
```

---

## Component Libraries

### 1. Material-UI (MUI) - Frontend

**Version:** 5.14.8

```javascript
import {
  Button,
  TextField,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { AccountCircle, Email } from '@mui/icons-material';

function MyForm() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <Email />
          }}
        />
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Container>
  );
}
```

### 2. Ant Design - Frontend & Admin

**Frontend:** 5.20.0
**Admin:** 5.18.3

```javascript
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin
} from 'antd';

function UserTable() {
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      loading={loading}
      rowKey="id"
    />
  );
}
```

### 3. React Bootstrap

**Version:** 2.10.2

```javascript
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

function Dashboard() {
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Stats</Card.Title>
              <Card.Text>1,234 users</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
```

---

## HTTP Client & API Integration

### Axios Configuration

**Version:** 0.27.2 (Frontend), 1.7.2 (Admin)

```javascript
// helpers/http.js
import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3020',
  withCredentials: true,  // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
```

### API Calls

```javascript
import httpClient from './helpers/http';

// GET request
const fetchUsers = async () => {
  try {
    const response = await httpClient.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// POST request
const createUser = async (userData) => {
  try {
    const response = await httpClient.post('/personal/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// PUT request
const updateUser = async (userId, updates) => {
  try {
    const response = await httpClient.put(`/personal/${userId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// DELETE request
const deleteUser = async (userId) => {
  try {
    await httpClient.delete(`/admin/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
```

### Using API Calls in Components

```javascript
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <Spin />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

## Forms & Validation

### 1. Joi Validation

**Version:** 17.13.1

```javascript
import Joi from 'joi';

// Define schema
const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

// Validate data
function validateForm(data) {
  const { error, value } = userSchema.validate(data, { abortEarly: false });

  if (error) {
    const errors = {};
    error.details.forEach(detail => {
      errors[detail.path[0]] = detail.message;
    });
    return { valid: false, errors };
  }

  return { valid: true, value };
}

// Usage in component
function RegistrationForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Submit form
    submitRegistration(validation.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      {/* other fields */}
    </form>
  );
}
```

### 2. Phone Number Validation

```javascript
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

function validatePhone(phoneNumber, country = 'IN') {
  try {
    const phoneNum = parsePhoneNumber(phoneNumber, country);
    return phoneNum.isValid();
  } catch (error) {
    return false;
  }
}

// Format phone number
function formatPhone(phoneNumber, country = 'IN') {
  try {
    const phoneNum = parsePhoneNumber(phoneNumber, country);
    return phoneNum.formatInternational();
  } catch (error) {
    return phoneNumber;
  }
}
```

### 3. OTP Input

```javascript
import OtpInput from 'react-otp-input';

function OTPVerification() {
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length === 6) {
      await verifyOTP(otp);
    }
  };

  return (
    <div>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
```

### 4. Multi-Step Forms

```javascript
import StepWizard from 'react-step-wizard';

function RegistrationWizard() {
  return (
    <StepWizard>
      <Step1 />
      <Step2 />
      <Step3 />
    </StepWizard>
  );
}

function Step1({ nextStep }) {
  return (
    <div>
      <h2>Personal Information</h2>
      {/* form fields */}
      <button onClick={nextStep}>Next</button>
    </div>
  );
}
```

---

## Authentication

### JWT Token Management

```javascript
import { jwtDecode } from 'jwt-decode';

// Store token after login
const handleLogin = async (credentials) => {
  const response = await httpClient.post('/auth/login', credentials);
  const { token } = response.data;

  localStorage.setItem('token', token);

  // Decode token to get user info
  const decoded = jwtDecode(token);
  console.log('User ID:', decoded.userId);
  console.log('Expires:', new Date(decoded.exp * 1000));
};

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Auto-logout on token expiry
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    logout();
  }
}, []);
```

### Device Fingerprinting

```javascript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const getDeviceFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};

// Use during login
const handleLogin = async (credentials) => {
  const deviceId = await getDeviceFingerprint();

  const response = await httpClient.post('/auth/login', {
    ...credentials,
    deviceId
  });
};
```

---

## UI/UX Enhancements

### 1. Notifications (React Toastify)

```javascript
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* app content */}
    </>
  );
}

// Usage in components
const handleSave = async () => {
  try {
    await saveData();
    toast.success('Data saved successfully!');
  } catch (error) {
    toast.error('Failed to save data');
  }
};
```

### 2. Animations (GSAP)

```javascript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function AnimatedCard() {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, []);

  return <div ref={cardRef}>Animated Content</div>;
}
```

### 3. Scroll Animations (AOS)

```javascript
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div>
      <div data-aos="fade-up">Fade Up</div>
      <div data-aos="zoom-in">Zoom In</div>
    </div>
  );
}
```

### 4. Carousel/Slider (Swiper)

```javascript
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function ImageSlider({ images }) {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img src={img} alt={`Slide ${index}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

### 5. Icons

```javascript
import { FaUser, FaHome, FaCog } from 'react-icons/fa';
import { Mail, Phone, Calendar } from 'lucide-react';

function Navigation() {
  return (
    <nav>
      <FaHome /> Home
      <FaUser /> Profile
      <Mail /> Contact
    </nav>
  );
}
```

---

## Performance Optimization

### 1. Code Splitting & Lazy Loading

```javascript
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Memoization

```javascript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data, onUpdate }) {
  // Memoize expensive computation
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item)
    }));
  }, [data]);

  // Memoize callback
  const handleClick = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.calculated}
        </div>
      ))}
    </div>
  );
}
```

### 3. Virtual Scrolling

```javascript
import { List } from 'react-virtualized';

function VirtualList({ items }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );

  return (
    <List
      width={800}
      height={600}
      rowCount={items.length}
      rowHeight={50}
      rowRenderer={rowRenderer}
    />
  );
}
```

### 4. Intersection Observer (Lazy Load Images)

```javascript
import { useInView } from 'react-intersection-observer';

function LazyImage({ src, alt }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref}>
      {inView ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder">Loading...</div>
      )}
    </div>
  );
}
```

---

## Testing

### Testing Setup

Archinza uses **Jest** and **React Testing Library** (included with React Scripts).

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe } from '@jest/globals';

describe('LoginForm', () => {
  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('shows error for invalid email', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## Build & Deployment

### Development Build

```bash
npm start
```

This starts the development server with:
- Hot module replacement
- Source maps
- Development warnings
- Port 3000 (frontend) or 3001 (admin)

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory:
- Minified JavaScript and CSS
- Optimized images
- Code splitting
- Tree shaking

### Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=https://api.archinza.com
REACT_APP_ENV=production
REACT_APP_GOOGLE_PLACES_KEY=your-key-here
```

Access in code:

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

### Deployment to S3 (via GitHub Actions)

Archinza deploys to AWS S3 automatically on push to `main` or `develop` branches.

See `.github/workflows/deploy_s3_prod.yml` and `deploy_s3_dev.yml`

---

## Best Practices

### 1. Component Organization

```javascript
// ✅ Good: Single responsibility
function UserCard({ user }) {
  return (
    <Card>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </Card>
  );
}

function UserList({ users }) {
  return users.map(user => <UserCard key={user.id} user={user} />);
}

// ❌ Bad: Too many responsibilities
function UserManagement() {
  // Handles fetching, filtering, sorting, rendering...
}
```

### 2. Prop Types & TypeScript

While Archinza currently uses JavaScript, consider adding PropTypes:

```javascript
import PropTypes from 'prop-types';

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};
```

### 3. Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 4. Clean useEffect

```javascript
// ✅ Good: Cleanup function
useEffect(() => {
  const subscription = dataStream.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);

// ✅ Good: Dependency array
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchUserData(userId);
}, []); // userId should be in dependencies
```

### 5. Avoid Inline Functions in Render

```javascript
// ❌ Bad: Creates new function on every render
<Button onClick={() => handleClick(item.id)}>Click</Button>

// ✅ Good: Memoized callback
const handleItemClick = useCallback((id) => {
  handleClick(id);
}, []);

<Button onClick={() => handleItemClick(item.id)}>Click</Button>
```

---

## Common Patterns in Archinza

### 1. API Call Pattern

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get('/api/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### 2. Form Handling Pattern

```javascript
const [formData, setFormData] = useState(initialState);
const [errors, setErrors] = useState({});
const [submitting, setSubmitting] = useState(false);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
  // Clear error for this field
  if (errors[e.target.name]) {
    setErrors({
      ...errors,
      [e.target.name]: null
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const validation = validateForm(formData);
  if (!validation.valid) {
    setErrors(validation.errors);
    return;
  }

  setSubmitting(true);
  try {
    await submitData(formData);
    toast.success('Submitted successfully!');
  } catch (error) {
    toast.error('Submission failed');
  } finally {
    setSubmitting(false);
  }
};
```

### 3. Modal Pattern

```javascript
const [modalVisible, setModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const handleEdit = (item) => {
  setSelectedItem(item);
  setModalVisible(true);
};

const handleModalClose = () => {
  setModalVisible(false);
  setSelectedItem(null);
};

return (
  <>
    <Button onClick={() => handleEdit(item)}>Edit</Button>

    <Modal
      visible={modalVisible}
      onCancel={handleModalClose}
    >
      <EditForm
        item={selectedItem}
        onSave={handleModalClose}
      />
    </Modal>
  </>
);
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `withCredentials: true` in Axios config
   - Backend must allow credentials in CORS settings

2. **Token Not Sent**
   - Check Axios interceptor is configured
   - Verify token is stored in localStorage

3. **Component Not Re-rendering**
   - Check state updates are immutable
   - Verify dependency arrays in useEffect

4. **Memory Leaks**
   - Add cleanup functions to useEffect
   - Cancel pending requests on unmount

5. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Clear build cache: `npm run build -- --reset-cache`

### Performance Issues

1. **Slow Initial Load**
   - Implement code splitting
   - Lazy load routes and heavy components

2. **Slow List Rendering**
   - Use virtualization (react-virtualized)
   - Implement pagination

3. **Excessive Re-renders**
   - Use React DevTools Profiler
   - Add memoization with useMemo/useCallback

---

## Additional Resources

- [React Official Docs](https://react.dev)
- [React Router v6 Guide](https://reactrouter.com/en/main)
- [Material-UI Documentation](https://mui.com)
- [Ant Design Documentation](https://ant.design)
- [Axios Documentation](https://axios-http.com)
- [Jest Documentation](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)

---

## Summary

React is the foundation of Archinza's frontend architecture, providing:
- **Component-based UI** for maintainability
- **Declarative rendering** for predictable updates
- **Rich ecosystem** of libraries and tools
- **Strong community support** and documentation

The combination of React with Material-UI, Ant Design, React Router, and Axios provides a robust, scalable frontend solution for both customer-facing and administrative interfaces.
