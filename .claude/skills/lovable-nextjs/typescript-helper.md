---
name: typescript-helper
description: Generates and configures TypeScript files for Next.js migration, including tsconfig.json, type definitions, and path aliases. Use when setting up TypeScript configuration for Next.js App Router projects.
---

# TypeScript Helper for Next.js Migration

## Purpose

Generate and configure TypeScript files specifically for Next.js App Router, ensuring proper type safety and optimal development experience.

## When to Use This Skill

Use when migrating to Next.js with TypeScript:
- Creating or updating tsconfig.json for Next.js
- Setting up path aliases for imports
- Creating type definitions for Next.js features
- Configuring strict type checking
- Setting up type-safe environment variables

## TypeScript Configuration

### 1. Next.js tsconfig.json

#### Complete Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/styles/*": ["./src/styles/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "dist",
    "build"
  ]
}
```

### 2. Environment Types

#### next-env.d.ts
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

#### types/env.d.ts
```typescript
// Environment variable types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      
      // Public environment variables (accessible in browser)
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_APP_VERSION: string;
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
      NEXT_PUBLIC_SENTRY_DSN?: string;
      
      // Server-only environment variables
      DATABASE_URL: string;
      JWT_SECRET: string;
      EMAIL_FROM: string;
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: string;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      
      // Next.js specific
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
    }
  }
}

export {};
```

### 3. Next.js Type Definitions

#### types/next-types.d.ts
```typescript
import type { Metadata, Viewport } from 'next';

// Extend Next.js types
declare global {
  // Custom metadata types
  interface CustomMetadata extends Metadata {
    customField?: string;
  }
  
  // Custom layout types
  interface LayoutProps {
    children: React.ReactNode;
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
  
  // Custom page types
  interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}

export {};
```

#### types/app-router.d.ts
```typescript
// App Router specific types
export interface AppRouterParams {
  [key: string]: string | string[];
}

export interface AppRouterSearchParams {
  [key: string]: string | string[] | undefined;
}

export interface RouteSegmentConfig {
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'static';
  dynamicParams?: 'auto' | 'error' | 'strict';
  revalidate?: false | number | 'force-dynamic';
  runtime?: 'nodejs' | 'edge';
  preferredRegion?: string;
  tags?: string[];
}

// Layout and page component types
export type LayoutComponent = React.ComponentType<{
  children: React.ReactNode;
  params?: AppRouterParams;
  searchParams?: AppRouterSearchParams;
}>;

export type PageComponent<T = {}> = React.ComponentType<T & {
  params?: AppRouterParams;
  searchParams?: AppRouterSearchParams;
}>;
```

## Type Templates

### 1. Page Component Types

#### Static Page Type
```typescript
// app/page.tsx
import type { PageComponent } from '@/types/app-router';

interface HomePageProps {
  // No props for static pages
}

export default function HomePage({}: HomePageProps) {
  return <div>Home Page</div>;
}

export const metadata = {
  title: 'Home',
  description: 'Welcome to our application',
};
```

#### Dynamic Page Type
```typescript
// app/blog/[id]/page.tsx
import type { PageComponent } from '@/types/app-router';

interface BlogPostPageProps {
  params: {
    id: string;
  };
  searchParams: {
    comment?: string;
  };
}

export default function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  return (
    <div>
      <h1>Blog Post: {params.id}</h1>
      {searchParams.comment && <p>Comment: {searchParams.comment}</p>}
    </div>
  );
}
```

### 2. Layout Component Types

#### Root Layout Type
```typescript
// app/layout.tsx
import type { LayoutComponent } from '@/types/app-router';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Built with Next.js',
};

export default function RootLayout({ children }: LayoutComponent) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

#### Nested Layout Type
```typescript
// app/dashboard/layout.tsx
import type { LayoutComponent } from '@/types/app-router';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    organization: string;
  };
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  return (
    <div className="dashboard">
      <aside>
        <h2>{params.organization} Dashboard</h2>
        <nav>{/* Navigation */}</nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

### 3. API Route Types

#### GET API Route Type
```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface GetUserParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: GetUserParams }
) {
  try {
    const userId = params.id;
    
    // Fetch user from database
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### POST API Route Type
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface CreateUserRequest {
  name: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();
    
    // Validate input
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await createUser(body);
    
    return NextResponse.json(
      { user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Utility Types

### 1. Component Props Types

#### types/components.ts
```typescript
import type { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Form component props
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: unknown) => void;
  defaultValues?: Record<string, unknown>;
  validation?: Record<string, (value: unknown) => string | undefined>;
}
```

### 2. API Types

#### types/api.ts
```typescript
// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  avatar?: string;
}
```

### 3. Navigation Types

#### types/navigation.ts
```typescript
// Navigation utilities
export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Route protection types
export interface ProtectedRouteOptions {
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
  requiresAuth?: boolean;
  roles?: string[];
}
```

## Configuration Scripts

### 1. TypeScript Setup Script

```bash
#!/bin/bash
# setup-typescript.sh

echo "Setting up TypeScript for Next.js..."

# Create necessary directories
mkdir -p types
mkdir -p src/{components,lib,utils,hooks,types}

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./src/*"]
    },
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next"
  ]
}
EOF

# Create next-env.d.ts
cat > next-env.d.ts << 'EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
EOF

echo "TypeScript setup complete!"
```

### 2. Type Generation Script

```typescript
// scripts/generate-types.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function generateTypes() {
  // Generate API types from OpenAPI schema
  const apiTypes = generateApiTypes();
  await writeFile(join('types', 'api.ts'), apiTypes);
  
  // Generate component prop types
  const componentTypes = generateComponentTypes();
  await writeFile(join('types', 'components.ts'), componentTypes);
  
  // Generate navigation types
  const navigationTypes = generateNavigationTypes();
  await writeFile(join('types', 'navigation.ts'), navigationTypes);
  
  console.log('Type generation complete!');
}

generateTypes().catch(console.error);
```

## Migration Commands

### 1. TypeScript Installation
```bash
# Install TypeScript and Next.js types
npm install --save-dev typescript@^5.0.0 @types/node@^20.0.0

# Install React types
npm install --save-dev @types/react@^18.0.0 @types/react-dom@^18.0.0
```

### 2. Configuration Validation
```bash
# Validate TypeScript configuration
npx tsc --noEmit

# Check for type errors
npx tsc --strict

# Generate type information
npx tsc --declaration --emitDeclarationOnly --outDir types
```

### 3. Type Checking in CI/CD
```yaml
# .github/workflows/typescript.yml
name: TypeScript Check

on: [push, pull_request]

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run type-check
```

## Best Practices

### 1. Type Safety Rules
- Always enable strict mode
- Use `noUncheckedIndexedAccess` for array/object safety
- Use `exactOptionalPropertyTypes` for precise optional types
- Avoid `any` type when possible
- Use `unknown` instead of `any` for dynamic data

### 2. Path Aliases
- Use consistent alias patterns (`@/` for src)
- Document all path mappings in tsconfig.json
- Use aliases for clean imports across the project
- Ensure aliases match file structure

### 3. Environment Variables
- Type all environment variables
- Separate public and server-only variables
- Use `NEXT_PUBLIC_` prefix for browser-accessible variables
- Validate environment variables at runtime

## Common Issues and Solutions

### 1. Module Resolution Errors
```json
// Fix: Ensure proper moduleResolution
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. Next.js Type Errors
```typescript
// Fix: Import Next.js types properly
import type { Metadata } from 'next';
import type { NextRequest } from 'next/server';

// Fix: Use proper component types
export default function Page({ params }: { params: { id: string } }) {
  // Component implementation
}
```

### 3. Build Type Errors
```bash
# Clear Next.js type cache
rm -rf .next/types

# Rebuild with type checking
npm run build

# Check generated types
ls -la .next/types/
```

This skill ensures comprehensive TypeScript setup for Next.js migration with proper type safety and developer experience.
