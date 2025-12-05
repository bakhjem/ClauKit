---
name: dependency-manager
description: Manages dependency transitions from Lovable Vite projects to Next.js, including package.json updates, dependency removals/additions, and version compatibility. Use when migrating project dependencies and build configuration.
---

# Dependency Manager for Next.js Migration

## Purpose

Manage the transition from Vite/React dependencies to Next.js-compatible dependencies, ensuring proper package.json configuration and build tools.

## When to Use This Skill

Use when migrating from Lovable to Next.js:
- Updating package.json dependencies
- Removing Vite-specific packages
- Adding Next.js required packages
- Ensuring version compatibility
- Updating build scripts and configuration

## Dependency Analysis

### 1. Dependencies to Remove

#### Vite-Specific Dependencies
```json
{
  "remove": [
    "vite",
    "@vitejs/plugin-react",
    "@vitejs/plugin-react-swc",
    "vite-plugin-eslint",
    "vite-plugin-pwa",
    "vite-plugin-windicss"
  ]
}
```

#### React Router Dependencies
```json
{
  "remove": [
    "react-router-dom",
    "@reach/router",
    "history"
  ]
}
```

#### Development Dependencies to Remove
```json
{
  "removeDev": [
    "@vitejs/plugin-react",
    "vite-plugin-eslint",
    "vite-tsconfig-paths",
    "vite-plugin-checker"
  ]
}
```

### 2. Dependencies to Add

#### Core Next.js Dependencies
```json
{
  "add": [
    "next@^15.0.0",
    "react@^18.0.0",
    "react-dom@^18.0.0"
  ]
}
```

#### Image and Asset Optimization
```json
{
  "add": [
    "sharp",
    "@next/font"
  ]
}
```

#### Development Dependencies
```json
{
  "addDev": [
    "@next/eslint-config-next",
    "@types/node"
  ]
}
```

### 3. Dependencies to Keep

#### React Ecosystem
```json
{
  "keep": [
    "react",
    "react-dom",
    "@types/react",
    "@types/react-dom"
  ]
}
```

#### UI Libraries (Usually Compatible)
```json
{
  "keep": [
    "@mui/material",
    "@mui/icons-material",
    "@emotion/react",
    "@emotion/styled",
    "antd",
    "framer-motion",
    "styled-components"
  ]
}
```

#### State Management
```json
{
  "keep": [
    "@reduxjs/toolkit",
    "react-redux",
    "zustand",
    "jotai",
    "swr",
    "@tanstack/react-query"
  ]
}
```

## Package.json Conversion

### Before (Lovable Vite Project)
```json
{
  "name": "my-lovable-app",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@mui/material": "^5.11.0",
    "@emotion/react": "^11.10.0",
    "@emotion/styled": "^11.10.0",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@typescript-eslint/eslint-plugin": "^5.52.0",
    "@typescript-eslint/parser": "^5.52.0",
    "@vitejs/plugin-react": "^3.1.0",
    "eslint": "^8.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "typescript": "^4.9.4",
    "vite": "^4.1.0"
  }
}
```

### After (Next.js Project)
```json
{
  "name": "my-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^5.11.0",
    "@emotion/react": "^11.10.0",
    "@emotion/styled": "^11.10.0",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Version Compatibility Matrix

### React Versions
| Package | Lovable Version | Next.js Version | Compatible |
|---------|----------------|-----------------|-------------|
| React | 18.2.0+ | 18.0.0+ | ✅ Yes |
| React DOM | 18.2.0+ | 18.0.0+ | ✅ Yes |
| Next.js | N/A | 15.0.0+ | ✅ Required |

### TypeScript Versions
| Package | Lovable Version | Next.js Version | Notes |
|---------|----------------|-----------------|-------|
| TypeScript | 4.9.4+ | 5.0.0+ | Recommended upgrade |
| @types/node | N/A | 20.0.0+ | Required for Next.js |

### UI Library Compatibility
| Library | Compatible Version | Notes |
|----------|-------------------|-------|
| Material-UI | 5.0.0+ | Fully compatible |
| Ant Design | 5.0.0+ | Fully compatible |
| Chakra UI | 2.0.0+ | Fully compatible |
| Tailwind CSS | 3.0.0+ | Requires Next.js plugin |

## Environment Variable Updates

### Vite Environment Variables
```typescript
// Before (Vite)
const API_URL = import.meta.env.VITE_API_URL;
const APP_TITLE = import.meta.env.VITE_APP_TITLE;
const DEBUG = import.meta.env.DEV;
```

### Next.js Environment Variables
```typescript
// After (Next.js)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE;
const DEBUG = process.env.NODE_ENV === 'development';
```

### Environment Variable Mapping
| Vite Variable | Next.js Variable |
|----------------|------------------|
| `VITE_API_URL` | `NEXT_PUBLIC_API_URL` |
| `VITE_APP_TITLE` | `NEXT_PUBLIC_APP_TITLE` |
| `VITE_ENVIRONMENT` | `NEXT_PUBLIC_ENVIRONMENT` |
| `MODE` | `NODE_ENV` |
| `DEV` | `NODE_ENV === 'development'` |

## Build Script Updates

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "dev:turbo": "next dev --turbo"
  }
}
```

### Production Scripts
```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "start": "next start",
    "start:production": "NODE_ENV=production next start"
  }
}
```

### Linting and Type Checking
```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

## Migration Commands

### 1. Dependency Removal
```bash
# Remove Vite dependencies
npm uninstall vite @vitejs/plugin-react @vitejs/plugin-react-swc

# Remove React Router
npm uninstall react-router-dom

# Remove Vite dev dependencies
npm uninstall --save-dev vite-plugin-eslint vite-tsconfig-paths
```

### 2. Dependency Installation
```bash
# Install Next.js core
npm install next@^15.0.0 react@^18.0.0 react-dom@^18.0.0

# Install image optimization
npm install sharp @next/font

# Install Next.js ESLint config
npm install --save-dev eslint-config-next @types/node
```

### 3. TypeScript Updates
```bash
# Update TypeScript to compatible version
npm install --save-dev typescript@^5.0.0

# Update React types
npm install --save-dev @types/react@^18.0.0 @types/react-dom@^18.0.0
```

### 4. Package.json Update Script
```bash
# Interactive package.json update
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="next build"
npm pkg set scripts.start="next start"
npm pkg set scripts.lint="next lint"

# Remove private: false (Next.js requires private: true)
npm pkg set private=true

# Remove type: module (not needed for Next.js)
npm pkg delete type
```

## Configuration Updates

### 1. Update TypeScript Config
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
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
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. ESLint Configuration
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

## Common Dependency Issues

### 1. Version Conflicts
```bash
# Check for version conflicts
npm ls

# Fix conflicts
npm install --force

# Or use exact versions
npm install package-name@exact-version
```

### 2. Peer Dependencies
```bash
# Install peer dependencies
npm install --save-peer

# Check peer dependency warnings
npm install --verbose
```

### 3. Legacy Dependencies
```bash
# Update legacy dependencies
npm audit fix

# Check for outdated packages
npm outdated
```

## Validation Checklist

### Post-Migration Validation
- [ ] `npm run dev` starts successfully
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] All imports resolve correctly
- [ ] Environment variables work
- [ ] UI libraries render properly
- [ ] API calls function correctly
- [ ] Hot reload works in development

### Performance Validation
- [ ] Bundle size is reasonable
- [ ] First Contentful Paint is good
- [ ] No hydration errors
- [ ] Images optimize correctly
- [ ] CSS loads properly

## Troubleshooting

### Common Issues
1. **Missing Dependencies**: Install missing packages individually
2. **Version Conflicts**: Use `npm ls` to identify conflicts
3. **Build Errors**: Check for incompatible libraries
4. **Type Errors**: Update TypeScript configuration
5. **Environment Variables**: Update to NEXT_PUBLIC_ prefix

### Solutions
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild from scratch
npm run build
```

This skill ensures smooth dependency migration from Lovable Vite projects to Next.js with proper version compatibility and configuration.
