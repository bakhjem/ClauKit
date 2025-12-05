---
name: code-converter
description: Converts React components from Lovable projects to Next.js format with proper "use client" directives and server/client component optimization. Use when migrating components to ensure proper Next.js compatibility.
---

# React Component Converter for Next.js

## Purpose

Convert React components from Lovable projects to Next.js format, ensuring proper server/client component separation and adding necessary directives.

## When to Use This Skill

Use when migrating React components to Next.js:
- Converting page components to Next.js App Router format
- Adding "use client" directives to interactive components
- Optimizing components for server-side rendering
- Ensuring proper component architecture for Next.js

## Conversion Rules

### 1. Client Component Detection

**Add "use client" directive when component uses:**
- React hooks: `useState`, `useEffect`, `useContext`, `useReducer`
- Event handlers: `onClick`, `onChange`, `onSubmit`, etc.
- Browser APIs: `window`, `document`, `localStorage`, `navigator`
- Form libraries: React Hook Form, Formik
- State management: Redux, Zustand with client-side features
- Animation libraries: Framer Motion, React Spring

**Keep as Server Component when:**
- Only renders static content
- Uses no hooks or event handlers
- No browser APIs
- Pure presentational component

### 2. Component Conversion Patterns

#### Lovable Component (Client-Side)
```typescript
// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { getUser } from '../api/users';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);

  const handleEdit = () => {
    // Edit logic
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  );
}
```

#### Next.js Equivalent (Client Component)
```typescript
// app/components/UserProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { getUser } from '../api/users';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);

  const handleEdit = () => {
    // Edit logic
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  );
}
```

#### Lovable Component (Server-Compatible)
```typescript
// src/components/UserCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface UserCardProps {
  user: {
    name: string;
    email: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </CardContent>
    </Card>
  );
}
```

#### Next.js Equivalent (Server Component)
```typescript
// app/components/UserCard.tsx
import { Card, CardContent, Typography } from '@mui/material';

interface UserCardProps {
  user: {
    name: string;
    email: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </CardContent>
    </Card>
  );
}
```

### 3. Page Component Conversion

#### Lovable Page with React Router
```typescript
// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../api/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>This is the home page</p>
    </div>
  );
}
```

#### Next.js App Router Page
```typescript
// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserData } from '../lib/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push('/login');
    } else {
      setUser(userData);
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>This is the home page</p>
    </div>
  );
}
```

### 4. Import Statement Updates

#### React Router to Next.js Navigation
```typescript
// Before (React Router)
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// After (Next.js)
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
```

#### Link Component Updates
```typescript
// Before (React Router)
import { Link } from 'react-router-dom';

// After (Next.js)
import Link from 'next/link';
```

### 5. API Route Updates

#### Client-Side API Calls
```typescript
// Before (Vite environment)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// After (Next.js)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

## Conversion Checklist

### For Each Component:
- [ ] Identify hooks usage (`useState`, `useEffect`, etc.)
- [ ] Check for event handlers (`onClick`, `onChange`, etc.)
- [ ] Look for browser APIs (`window`, `localStorage`, etc.)
- [ ] Determine if "use client" directive is needed
- [ ] Update React Router imports to Next.js navigation
- [ ] Update environment variable references
- [ ] Update API endpoint paths if needed
- [ ] Ensure proper TypeScript types
- [ ] Test component functionality

### Import Path Updates:
```typescript
// Relative imports (usually work as-is)
import { Button } from './Button';
import { utils } from '../utils/helpers';

// Absolute imports (may need updates)
import { api } from '@/lib/api';     // Update to Next.js path aliases
import { types } from '~/types/user'; // Update to Next.js path aliases
```

## Common Conversion Scenarios

### 1. Data Fetching Components
```typescript
// Lovable (Client-side only)
'use client'; // Add this

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/data').then(response => {
      setData(response.data);
    });
  }, []);

  return <div>{data?.name}</div>;
}
```

### 2. Form Components
```typescript
// Lovable Form
'use client'; // Add this

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Layout Components
```typescript
// Lovable Layout (can stay as Server Component)
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

## Best Practices

### 1. Component Architecture
- **Server Components First**: Default to Server Components unless client features needed
- **Minimal Client Boundaries**: Keep client components as small as possible
- **Data Fetching**: Use Server Components for initial data when possible

### 2. Performance Optimization
- **Lazy Loading**: Use `React.lazy()` for heavy client components
- **Code Splitting**: Split client components appropriately
- **Bundle Analysis**: Monitor client-side bundle size

### 3. SEO Considerations
- **Server Components**: Better for SEO and initial page load
- **Metadata**: Use Next.js metadata API in Server Components
- **Structured Data**: Ensure proper rendering on server

## Testing After Conversion

### 1. Functionality Testing
```bash
# Test component rendering
npm run dev

# Test client-side interactions
# Click buttons, fill forms, check state changes

# Test navigation
# Verify routing works correctly
```

### 2. Build Testing
```bash
# Test production build
npm run build

# Check for hydration errors
npm run start
```

### 3. Bundle Analysis
```bash
# Analyze client bundle
npm run build
npx @next/bundle-analyzer
```

## Troubleshooting

### Common Issues:
1. **Missing "use client" directive**: Components with hooks will fail
2. **Window object errors**: Browser APIs in Server Components
3. **Import path issues**: Update path aliases for Next.js
4. **Environment variables**: Use `NEXT_PUBLIC_` prefix for client access

### Solutions:
1. Add `'use client';` at top of component file
2. Move browser logic to client components
3. Update `tsconfig.json` paths and `next.config.js`
4. Prefix environment variables appropriately

## Migration Commands

### Batch Conversion Script:
```bash
# Find components needing "use client"
grep -r "useState\|useEffect\|onClick\|onChange" src/components/ --include="*.tsx" --include="*.jsx"

# Find components using browser APIs
grep -r "window\|localStorage\|document\|navigator" src/components/ --include="*.tsx" --include="*.jsx"

# Add "use client" to identified files
# (Manual review recommended)
```

This skill ensures all React components are properly converted for Next.js App Router compatibility while maintaining functionality and performance.
