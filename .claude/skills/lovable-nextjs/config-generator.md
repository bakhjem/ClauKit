---
name: config-generator
description: Generates Next.js configuration files from Lovable Vite setup, including next.config.js, .gitignore, and build settings. Use when creating Next.js project configuration.
---

# Configuration Generator for Next.js Migration

## Purpose

Generate Next.js configuration files from Lovable Vite setup, ensuring proper build settings, optimization, and development environment configuration.

## When to Use This Skill

Use when migrating from Vite to Next.js:
- Converting vite.config.ts to next.config.js
- Creating Next.js .gitignore
- Setting up build and development scripts
- Configuring environment variables
- Setting up deployment configuration
- Creating ESLint and Prettier configurations

## Core Configuration Files

### 1. Next.js Configuration

#### Before (Vite Config)
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
```

#### After (Next.js Config)
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for Next.js 15
  experimental: {
    // Enable any experimental features you need
    // ppr: true, // Partial Prerendering
    // turbopack: {
    //   loaders: ['css-loader', 'ts-loader'],
    // },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack configuration for custom loaders
  webpack: (config, { isServer }) => {
    // Custom webpack configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },

  // Output configuration
  output: 'standalone',
  
  // Compression
  compress: true,
  
  // Power headers for better caching
  powerByHeader: true,
  
  // Standalone output for deployment
  output: 'standalone',
};

module.exports = nextConfig;
```

### 2. TypeScript Next.js Config

#### next.config.ts (TypeScript)
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Enable experimental features
    ppr: true,
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
        ],
      },
    ];
  },

  env: {
    CUSTOM_API_URL: process.env.CUSTOM_API_URL,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
};

export default nextConfig;
```

### 3. Git Configuration

#### .gitignore for Next.js
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
.next/
out/
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
.env

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output

# Misc
*.tgz
*.tar.gz

# Vercel
.vercel

# Turbo
.turbo

# Next.js specific
.next/
out/

# Storybook
storybook-static/

# Temporary files
*.tmp
*.temp
```

### 4. ESLint Configuration

#### .eslintrc.json (Next.js)
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@next/next/no-img-element": "error",
    "@next/next/no-page-custom-font": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  },
  "overrides": [
    {
      "files": ["*.js", "*.jsx"],
      "parser": "@babel/eslint-parser"
    }
  ],
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "out/",
    "build/"
  ]
}
```

### 5. Prettier Configuration

#### .prettierrc.json
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "embeddedLanguageFormatting": "auto"
}
```

#### .prettierignore
```
# Dependencies
node_modules

# Build outputs
.next
out
build
dist

# Generated files
*.min.js
*.min.css

# Config files that shouldn't be formatted
package-lock.json
yarn.lock
pnpm-lock.yaml

# Logs
*.log

# Coverage
coverage

# Temporary files
*.tmp
```

## Environment Configuration

### 1. Environment Variables

#### .env.example
```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_URL_NON_POOLING=postgresql://username:password@localhost:5432/database_name

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret

# External APIs
API_URL=https://api.example.com
NEXT_PUBLIC_API_URL=https://api.example.com

# Third-party services
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Email
EMAIL_FROM=noreply@example.com
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# File storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Sentry (error tracking)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Feature flags
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
ENABLE_PERFORMANCE_MONITORING=true
```

#### .env.local.example
```env
# Local development overrides
DATABASE_URL=postgresql://devuser:devpass@localhost:5432/devdb
REDIS_URL=redis://localhost:6379/0

# Development-specific settings
DEBUG=true
LOG_LEVEL=debug

# Local API overrides
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Package.json Scripts

#### Complete package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "dev:turbo": "next dev --turbo",
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:export": "next build && next export",
    "start": "next start",
    "start:production": "NODE_ENV=production next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "lint:quiet": "next lint --quiet",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:debug": "playwright test --debug",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "postinstall": "prisma generate",
    "clean": "rm -rf .next out dist build",
    "clean:full": "npm run clean && rm -rf node_modules && npm install"
  }
}
```

## Deployment Configuration

### 1. Vercel Configuration

#### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

### 2. Docker Configuration

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build application
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Development Configuration

### 1. VS Code Configuration

#### .vscode/settings.json
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

#### .vscode/extensions.json
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### 2. Husky Configuration

#### .husky/pre-commit
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### .husky/pre-push
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npm run test
```

#### lint-staged.config.js
```javascript
module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{json,css,md}': [
    'prettier --write',
    'git add'
  ],
  '*.{js,jsx,ts,tsx}': 'eslint --fix',
  '*.{js,jsx,ts,tsx,css,md}': 'prettier --write'
};
```

## Configuration Migration Scripts

### 1. Vite to Next.js Migration Script

```bash
#!/bin/bash
# migrate-config.sh

echo "Migrating Vite configuration to Next.js..."

# Create Next.js config from Vite config
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Add experimental features as needed
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [],
  },
  
  async redirects() {
    return [];
  },
  
  async rewrites() {
    return [];
  },
  
  env: {
    // Add environment variables
  },
};

module.exports = nextConfig;
EOF

# Create Next.js .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Production build
.next/
out/
build/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
EOF

echo "Configuration migration complete!"
```

### 2. TypeScript Config Update Script

```bash
#!/bin/bash
# update-typescript-config.sh

echo "Updating TypeScript configuration for Next.js..."

# Update tsconfig.json for Next.js
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

echo "TypeScript configuration updated!"
```

## Validation Scripts

### 1. Configuration Validation

```bash
#!/bin/bash
# validate-config.sh

echo "Validating Next.js configuration..."

# Check if next.config.js exists
if [ ! -f "next.config.js" ]; then
  echo "❌ next.config.js not found"
  exit 1
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
  echo "❌ .gitignore not found"
  exit 1
fi

# Validate Next.js config syntax
node -c next.config.js
if [ $? -eq 0 ]; then
  echo "✅ next.config.js syntax is valid"
else
  echo "❌ next.config.js has syntax errors"
  exit 1
fi

# Check TypeScript configuration
npx tsc --noEmit
if [ $? -eq 0 ]; then
  echo "✅ TypeScript configuration is valid"
else
  echo "❌ TypeScript configuration has errors"
  exit 1
fi

echo "Configuration validation complete!"
```

### 2. Build Validation Script

```bash
#!/bin/bash
# validate-build.sh

echo "Validating Next.js build..."

# Clean previous build
rm -rf .next

# Run type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type check failed"
  exit 1
fi

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint check failed"
  exit 1
fi

# Run build
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build validation successful!"
```

## Migration Checklist

### Configuration Files:
- [ ] Create next.config.js from vite.config.ts
- [ ] Update .gitignore for Next.js
- [ ] Configure ESLint for Next.js
- [ ] Set up Prettier configuration
- [ ] Create environment variable templates
- [ ] Update package.json scripts
- [ ] Configure deployment settings

### Development Setup:
- [ ] Set up VS Code configuration
- [ ] Configure Husky git hooks
- [ ] Set up lint-staged configuration
- [ ] Create Docker configuration if needed
- [ ] Configure CI/CD pipelines

### Validation:
- [ ] Validate configuration syntax
- [ ] Test build process
- [ ] Verify linting works
- [ ] Check TypeScript compilation
- [ ] Test development server
- [ ] Validate deployment setup

## Common Configuration Issues

### 1. Module Resolution Errors
```javascript
// Problem: Incorrect module resolution
{
  "compilerOptions": {
    "moduleResolution": "node" // ❌ Incorrect for Next.js
  }
}

// Solution: Use bundler resolution
{
  "compilerOptions": {
    "moduleResolution": "bundler" // ✅ Correct for Next.js
  }
}
```

### 2. Image Configuration Issues
```javascript
// Problem: Using deprecated domains option
{
  images: {
    domains: ['example.com'] // ❌ Deprecated
  }
}

// Solution: Use remotePatterns
{
  images: {
    remotePatterns: [ // ✅ Recommended
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      }
    ]
  }
}
```

### 3. Environment Variable Issues
```javascript
// Problem: Incorrect environment variable access
const apiUrl = import.meta.env.VITE_API_URL; // ❌ Vite syntax

// Solution: Use Next.js syntax
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ Next.js syntax
```

This skill ensures comprehensive configuration migration from Vite to Next.js with proper build optimization and development setup.
