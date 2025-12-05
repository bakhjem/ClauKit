---
name: route-mapper
description: Maps React Router routes from Lovable projects to Next.js App Router structure, converting dynamic parameters, nested routes, and catch-all patterns. Use when migrating routing system from React Router to Next.js file-based routing.
---

# Route Mapper for Next.js App Router

## Purpose

Convert React Router routes from Lovable projects to Next.js App Router file-based structure, preserving routing behavior and URL patterns.

## When to Use This Skill

Use when migrating from React Router to Next.js:
- Converting route definitions to file-based structure
- Mapping dynamic routes with parameters
- Handling nested routes and layouts
- Creating catch-all routes for 404 pages
- Preserving URL structure and SEO

## Route Conversion Patterns

### 1. Static Routes

#### React Router Definition
```typescript
// src/App.tsx or router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

#### Next.js App Router Equivalent
```typescript
// app/page.tsx
export default function HomePage() {
  return <div>Home Page</div>;
}

// app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>;
}

// app/contact/page.tsx
export default function ContactPage() {
  return <div>Contact Page</div>;
}
```

### 2. Dynamic Routes

#### React Router Dynamic Routes
```typescript
const router = createBrowserRouter([
  {
    path: '/blog/:id',
    element: <BlogPostPage />,
  },
  {
    path: '/users/:userId',
    element: <UserProfilePage />,
  },
  {
    path: '/products/:category/:productId',
    element: <ProductDetailPage />,
  }
]);
```

#### Next.js App Router Dynamic Routes
```typescript
// app/blog/[id]/page.tsx
interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <div>Blog Post: {params.id}</div>;
}

// app/users/[userId]/page.tsx
interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  return <div>User Profile: {params.userId}</div>;
}

// app/products/[category]/[productId]/page.tsx
interface ProductDetailPageProps {
  params: {
    category: string;
    productId: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <div>
      Product: {params.productId} in {params.category}
    </div>
  );
}
```

### 3. Nested Routes

#### React Router Nested Routes
```typescript
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'settings',
        element: <DashboardSettings />,
      },
      {
        path: 'profile',
        element: <DashboardProfile />,
      }
    ]
  }
]);
```

#### Next.js App Router Nested Routes
```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
export default function DashboardHome() {
  return <div>Dashboard Home</div>;
}

// app/dashboard/settings/page.tsx
export default function DashboardSettings() {
  return <div>Dashboard Settings</div>;
}

// app/dashboard/profile/page.tsx
export default function DashboardProfile() {
  return <div>Dashboard Profile</div>;
}
```

### 4. Catch-All Routes

#### React Router Catch-All
```typescript
const router = createBrowserRouter([
  // ... other routes
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);
```

#### Next.js App Router Catch-All
```typescript
// app/not-found.tsx
export default function NotFoundPage() {
  return <div>Page not found</div>;
}

// For catch-all dynamic routes
// app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: {
    slug: string[];
  };
}

export default function DocsPage({ params }: DocsPageProps) {
  return <div>Docs path: {params.slug.join('/')}</div>;
}
```

## Route Mapping Table

| React Router Path | Next.js App Router File | Parameters |
|-------------------|------------------------|-------------|
| `/` | `app/page.tsx` | None |
| `/about` | `app/about/page.tsx` | None |
| `/blog/:id` | `app/blog/[id]/page.tsx | `params.id` |
| `/users/:userId/posts/:postId` | `app/users/[userId]/posts/[postId]/page.tsx` | `params.userId`, `params.postId` |
| `/dashboard/*` | `app/dashboard/[...slug]/page.tsx` | `params.slug` (array) |
| `*` (404) | `app/not-found.tsx` | None |

## Navigation Conversion

### React Router Navigation
```typescript
// Hook-based navigation
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    navigate('/about');
  };

  const handleNavigateWithState = () => {
    navigate('/profile', { state: { from: location.pathname } });
  };

  const handleReplace = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <button onClick={handleNavigate}>Go to About</button>
      <button onClick={handleNavigateWithState}>Go to Profile</button>
      <button onClick={handleReplace}>Replace with Login</button>
    </div>
  );
}

// Link component
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about" state={{ from: 'nav' }}>About</Link>
      <Link to="/blog/123">Blog Post</Link>
    </nav>
  );
}
```

### Next.js Navigation
```typescript
// Hook-based navigation
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleNavigate = () => {
    router.push('/about');
  };

  const handleNavigateWithQuery = () => {
    router.push('/profile?from=' + encodeURIComponent(pathname));
  };

  const handleReplace = () => {
    router.replace('/login');
  };

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div>
      <button onClick={handleNavigate}>Go to About</button>
      <button onClick={handleNavigateWithQuery}>Go to Profile</button>
      <button onClick={handleReplace}>Replace with Login</button>
      <button onClick={handleBack}>Go Back</button>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}

// Link component
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about?from=nav">About</Link>
      <Link href="/blog/123">Blog Post</Link>
      <Link 
        href="/search" 
        scroll={false}
        replace={false}
        prefetch={true}
      >
        Advanced Search
      </Link>
    </nav>
  );
}
```

## Layout Migration

### React Router Layout Pattern
```typescript
// Common layout wrapper
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ]
  }
]);
```

### Next.js Layout Pattern
```typescript
// app/layout.tsx (Root Layout)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx (Nested Layout)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <DashboardNav />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}
```

## Route Groups and Parallel Routes

### Next.js Advanced Patterns

#### Route Groups
```typescript
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing">
      <MarketingNav />
      {children}
    </div>
  );
}

// app/(marketing)/page.tsx -> /
// app/(marketing)/about/page.tsx -> /about
```

#### Parallel Routes
```typescript
// app/@modal/login/page.tsx
export default function LoginModal() {
  return <div>Login Modal</div>;
}

// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

## Route Protection and Middleware

### React Router Protected Routes
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### Next.js Route Protection
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};

// app/dashboard/page.tsx
import { headers } from 'next/headers';

export default function DashboardPage() {
  const headersList = headers();
  const isAuthenticated = headersList.get('x-user-authenticated');

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <div>Dashboard</div>;
}
```

## Migration Commands

### 1. File Structure Analysis
```bash
# Find React Router usage
grep -r "createBrowserRouter\|Routes\|Route" src/ --include="*.tsx" --include="*.ts"

# Find dynamic routes
grep -r "path.*:" src/ --include="*.tsx" --include="*.ts"

# Find nested routes
grep -r "children.*:" src/ --include="*.tsx" --include="*.ts"
```

### 2. Directory Creation Script
```bash
# Create Next.js app directory structure
mkdir -p app/{dashboard,blog,users,products}

# Create dynamic route directories
mkdir -p app/blog/{\[id\],\[slug\],\[category\]/\[productId\]

# Create layout directories
mkdir -p app/{dashboard,profile}/layout
```

### 3. Route File Generation
```typescript
// Script to generate route files from React Router config
function generateNextRoutes(reactRouterConfig) {
  const routeMap = [];
  
  function processRoute(route, basePath = '') {
    const path = basePath + route.path;
    
    if (route.children) {
      // Create layout file
      routeMap.push({
        path: `${path}/layout.tsx`,
        content: generateLayout(route)
      });
      
      route.children.forEach(child => processRoute(child, path));
    } else {
      // Create page file
      const nextPath = convertToNextPath(path);
      routeMap.push({
        path: nextPath,
        content: generatePage(route)
      });
    }
  }
  
  reactRouterConfig.forEach(route => processRoute(route));
  return routeMap;
}
```

## Migration Checklist

### For Each Route:
- [ ] Convert static routes to page.tsx files
- [ ] Convert dynamic routes to [param]/page.tsx files
- [ ] Create layout.tsx for nested routes
- [ ] Update navigation hooks and components
- [ ] Handle route parameters correctly
- [ ] Preserve query parameters
- [ ] Handle 404/not-found pages
- [ ] Update protected routes logic
- [ ] Test URL structure matches original

### File Structure Validation:
- [ ] All routes have corresponding files
- [ ] Dynamic parameters use brackets [param]
- [ ] Nested routes have proper layouts
- [ ] Catch-all routes exist for 404s
- [ ] Parallel routes configured if needed
- [ ] Middleware configured for protected routes

## Common Migration Issues

### 1. Parameter Access
```typescript
// React Router
const { id } = useParams();
const location = useLocation();
const searchParams = new URLSearchParams(location.search);

// Next.js
const { id } = useParams();
const searchParams = useSearchParams();
const query = searchParams.get('query');
```

### 2. Route State
```typescript
// React Router
const navigate = useNavigate();
navigate('/target', { state: { from: 'current' } });
const location = useLocation();
const state = location.state;

// Next.js (alternative approaches)
const router = useRouter();
router.push('/target?from=current');
const searchParams = useSearchParams();
const from = searchParams.get('from');
```

### 3. Index Routes
```typescript
// React Router
{ index: true, element: <HomePage /> }

// Next.js
// app/page.tsx (for root)
// app/dashboard/page.tsx (for dashboard index)
```

This skill ensures complete and accurate migration from React Router to Next.js App Router while preserving all routing functionality.
