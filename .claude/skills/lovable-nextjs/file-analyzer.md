---
name: file-analyzer
description: Analyzes Lovable project structure to identify components, routes, dependencies, and configuration for Next.js migration. Use when scanning React/Vite projects to understand architecture and plan migration strategy.
---

# Lovable Project File Analyzer

## Purpose

Analyze Lovable React/Vite project structure to identify all components, routes, dependencies, and configuration files needed for Next.js migration planning.

## When to Use This Skill

Use when starting a Lovable to Next.js migration project:
- Initial project scanning and analysis
- Identifying React components and pages
- Mapping routing structure
- Analyzing dependencies and configuration
- Planning migration strategy

## Analysis Process

### 1. Project Structure Scan

**Key Directories to Analyze:**
```
src/
├── components/          # React components
├── pages/              # React Router pages
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
├── styles/             # CSS/styling files
├── assets/             # Static assets
└── App.tsx            # Main app component
```

**Configuration Files:**
- `vite.config.ts` - Vite configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` files - Environment variables

### 2. Component Analysis

**Component Identification:**
- Scan all `.tsx/.jsx` files in `src/components/`
- Identify component names and props interfaces
- Detect component usage patterns
- Note components using specific libraries (UI libraries, data fetching)

**Component Classification:**
- **Page Components**: Components rendered by React Router
- **Reusable Components**: Generic UI components
- **Layout Components**: Header, footer, navigation
- **Feature Components**: Business logic components

### 3. Route Analysis

**React Router Detection:**
- Find `createBrowserRouter`, `Routes`, `Route` usage
- Extract route patterns and parameters
- Identify nested routes and layouts
- Map route paths to component files

**Route Pattern Examples:**
```typescript
// Static routes
<Route path="/about" element={<AboutPage />} />

// Dynamic routes
<Route path="/blog/:id" element={<BlogPost />} />

// Nested routes
<Route path="/products" element={<ProductsLayout />}>
  <Route path=":id" element={<ProductDetail />} />
</Route>

// Catch-all routes
<Route path="*" element={<NotFound />} />
```

### 4. Dependency Analysis

**Dependencies to Identify:**
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "vite": "^4.0.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

**Library Categories:**
- **UI Libraries**: Material-UI, Ant Design, Chakra UI
- **State Management**: Redux, Zustand, React Query
- **Styling**: Styled-components, Emotion, Tailwind
- **Form Handling**: React Hook Form, Formik
- **Data Fetching**: Axios, Fetch API, GraphQL clients

### 5. Configuration Analysis

**Vite Configuration:**
- Build settings and optimization
- Plugin configurations
- Path aliases and resolutions
- Environment variable handling

**TypeScript Configuration:**
- Compiler options and strictness
- Path mappings
- Include/exclude patterns
- Custom type declarations

## Output Format

### 1. Project Summary
```yaml
project:
  name: "project-name"
  type: "React/Vite SPA"
  total_files: 150
  components_count: 25
  pages_count: 8
  dependencies_count: 45
```

### 2. Component Inventory
```yaml
components:
  pages:
    - file: "src/pages/Home.tsx"
      name: "HomePage"
      uses_hooks: ["useState", "useEffect"]
      dependencies: ["axios", "react-query"]
  layouts:
    - file: "src/components/Layout/MainLayout.tsx"
      name: "MainLayout"
      children: ["Header", "Footer", "Navigation"]
  reusable:
    - file: "src/components/UI/Button.tsx"
      name: "Button"
      props_interface: "ButtonProps"
```

### 3. Route Mapping
```yaml
routes:
  static:
    - path: "/home"
      component: "src/pages/Home.tsx"
      next_path: "app/page.tsx"
  dynamic:
    - path: "/blog/:id"
      component: "src/pages/BlogPost.tsx"
      next_path: "app/blog/[id]/page.tsx"
  nested:
    - path: "/products"
      layout: "src/pages/ProductsLayout.tsx"
      children:
        - path: "/products/:id"
          component: "src/pages/ProductDetail.tsx"
          next_path: "app/products/[id]/page.tsx"
```

### 4. Dependency Report
```yaml
dependencies:
  remove:
    - "vite"
    - "@vitejs/plugin-react"
    - "react-router-dom"
  keep:
    - "react"
    - "react-dom"
    - "@mui/material"
  add:
    - "next"
    - "@next/font"
    - "sharp"
```

## Migration Recommendations

### 1. Complexity Assessment
- **Simple**: Static pages, basic components
- **Medium**: Dynamic routes, state management
- **Complex**: Advanced routing, server integration

### 2. Migration Strategy
- **Phased Approach**: Components → Routes → Configuration
- **Parallel Development**: Keep original running while migrating
- **Testing Strategy**: Component testing, integration testing

### 3. Potential Challenges
- **Client-side Features**: Browser APIs, localStorage
- **Third-party Libraries**: SSR compatibility
- **Build Optimization**: Next.js specific optimizations

## Commands for Analysis

### File System Scan
```bash
# Find all React components
find src -name "*.tsx" -o -name "*.jsx" | head -20

# Analyze directory structure
tree src -I node_modules

# Find configuration files
find . -name "vite.config.*" -o -name "package.json" -o -name "tsconfig.*"
```

### Dependency Analysis
```bash
# List production dependencies
npm list --prod --depth=0

# Find React Router usage
grep -r "createBrowserRouter\|Routes\|Route" src/ --include="*.tsx" --include="*.ts"
```

### Component Analysis
```bash
# Find components using hooks
grep -r "useState\|useEffect\|useContext" src/components/ --include="*.tsx"

# Find components with browser APIs
grep -r "window\|localStorage\|document" src/components/ --include="*.tsx"
```

## Next Steps

After analysis completion:
1. **Review component inventory** for migration priority
2. **Plan route conversion strategy**
3. **Identify dependency updates needed**
4. **Create migration timeline**
5. **Setup Next.js project structure**
