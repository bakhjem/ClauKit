---
name: testing-helper
description: Sets up testing framework for Next.js migration, including Jest, Playwright, and component testing configurations. Use when implementing comprehensive testing strategy for Next.js applications.
---

# Testing Helper for Next.js Migration

## Purpose

Set up comprehensive testing framework for Next.js applications, including unit tests, integration tests, E2E tests, and component testing.

## When to Use This Skill

Use when implementing testing for Next.js applications:
- Setting up Jest and React Testing Library
- Configuring Playwright for E2E testing
- Setting up component testing
- Implementing API route testing
- Configuring test utilities and mocks
- Setting up CI/CD testing pipelines

## Testing Framework Setup

### 1. Jest Configuration

#### jest.config.js
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js specific options
  dir: './',
  nextConfig: require('./next.config.js'),
});

const customJestConfig = {
  // Jest configuration options
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
  ],
  collectCoverageFrom: [
    'app/**/*.(ts|tsx)',
    'lib/**/*.(ts|tsx)',
    '!app/**/*.d.ts',
    '!lib/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### 2. Jest Setup File

#### jest.setup.js
```javascript
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';

// Setup MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 3. Playwright Configuration

#### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
};

export default config;
```

## Component Testing

### 1. Basic Component Test

#### Button Component Test
```typescript
// app/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('btn-primary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
  });
});
```

### 2. Page Component Test

#### Home Page Test
```typescript
// app/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />);
    
    expect(
      screen.getByRole('heading', { name: /welcome/i })
    ).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Home />);
    
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('has correct page title', () => {
    render(<Home />);
    
    expect(document.title).toBe('Home | My App');
  });
});
```

### 3. Dynamic Route Test

#### Blog Post Page Test
```typescript
// app/blog/[slug]/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import BlogPostPage from '../page';
import { getBlogPost } from '@/lib/blog';

// Mock the blog post API
jest.mock('@/lib/blog', () => ({
  getBlogPost: jest.fn(),
}));

const mockGetBlogPost = getBlogPost as jest.MockedFunction<typeof getBlogPost>;

describe('BlogPostPage', () => {
  const mockPost = {
    id: '1',
    title: 'Test Blog Post',
    content: 'This is a test blog post',
    slug: 'test-blog-post',
  };

  it('renders blog post when found', async () => {
    mockGetBlogPost.mockResolvedValue(mockPost);
    
    render(await BlogPostPage({ params: { slug: 'test-blog-post' } }));
    
    expect(screen.getByRole('heading', { name: mockPost.title })).toBeInTheDocument();
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
  });

  it('calls notFound when post does not exist', async () => {
    mockGetBlogPost.mockResolvedValue(null);
    
    await BlogPostPage({ params: { slug: 'non-existent' } });
    
    expect(notFound).toHaveBeenCalled();
  });

  it('uses correct slug to fetch post', async () => {
    mockGetBlogPost.mockResolvedValue(mockPost);
    
    await BlogPostPage({ params: { slug: 'test-slug' } });
    
    expect(mockGetBlogPost).toHaveBeenCalledWith('test-slug');
  });
});
```

## API Route Testing

### 1. Basic API Route Test

#### Users API Test
```typescript
// app/api/users/__tests__/route.test.ts
import { createMocks } from 'node-mocks-http';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '../route';

describe('/api/users', () => {
  describe('GET', () => {
    it('returns list of users', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/users',
      });
      
      const response = await GET(req as NextRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('users');
      expect(Array.isArray(data.users)).toBe(true);
    });
  });

  describe('POST', () => {
    it('creates a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      
      const { req } = createMocks({
        method: 'POST',
        url: '/api/users',
        body: userData,
      });
      
      const response = await POST(req as NextRequest);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.user).toMatchObject(userData);
    });

    it('validates required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        // Missing email
      };
      
      const { req } = createMocks({
        method: 'POST',
        url: '/api/users',
        body: invalidData,
      });
      
      const response = await POST(req as NextRequest);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toContain('email is required');
    });
  });
});
```

### 2. Dynamic API Route Test

#### User by ID API Test
```typescript
// app/api/users/[id]/__tests__/route.test.ts
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '../route';
import { getUserById, updateUser, deleteUser } from '@/lib/users';

// Mock user service
jest.mock('@/lib/users', () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

describe('/api/users/[id]', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  describe('GET', () => {
    it('returns user when found', async () => {
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      
      const { req } = createMocks({
        method: 'GET',
        url: '/api/users/1',
        query: { id: '1' },
      });
      
      const response = await GET(req as NextRequest, { params: { id: '1' } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
    });

    it('returns 404 when user not found', async () => {
      (getUserById as jest.Mock).mockResolvedValue(null);
      
      const { req } = createMocks({
        method: 'GET',
        url: '/api/users/999',
        query: { id: '999' },
      });
      
      const response = await GET(req as NextRequest, { params: { id: '999' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toContain('User not found');
    });
  });

  describe('PUT', () => {
    it('updates user successfully', async () => {
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      (updateUser as jest.Mock).mockResolvedValue(updatedUser);
      
      const updateData = { name: 'Jane Doe' };
      const { req } = createMocks({
        method: 'PUT',
        url: '/api/users/1',
        body: updateData,
        query: { id: '1' },
      });
      
      const response = await PUT(req as NextRequest, { params: { id: '1' } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.user).toEqual(updatedUser);
    });
  });

  describe('DELETE', () => {
    it('deletes user successfully', async () => {
      (deleteUser as jest.Mock).mockResolvedValue(true);
      
      const { req } = createMocks({
        method: 'DELETE',
        url: '/api/users/1',
        query: { id: '1' },
      });
      
      const response = await DELETE(req as NextRequest, { params: { id: '1' } });
      
      expect(response.status).toBe(200);
    });
  });
});
```

## End-to-End Testing

### 1. Basic E2E Test

#### Navigation E2E Test
```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to About page
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1')).toContainText('About Us');
    
    // Navigate back to Home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should handle mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Navigate using mobile menu
    await page.click('text=Blog');
    await expect(page).toHaveURL(/\/blog/);
  });
});
```

### 2. Form E2E Test

#### Contact Form E2E Test
```typescript
// tests/e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form fields
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="message-input"]', 'This is a test message');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Check for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Message sent successfully'
    );
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form
    await page.click('[data-testid="submit-button"]');
    
    // Check for validation errors
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-error"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('/api/contact', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });
    
    await page.goto('/contact');
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="message-input"]', 'Test message');
    
    await page.click('[data-testid="submit-button"]');
    
    // Check for error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

### 3. Authentication E2E Test

#### Login Flow E2E Test
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Check for successful redirect
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('test@example.com');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Check for error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid credentials'
    );
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Check for redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
```

## Test Utilities and Mocks

### 1. Test Utilities

#### utils/test-utils.tsx
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Add your providers here */}
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';
```

### 2. Mock Server Setup

#### mocks/server.ts
```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  // Mock API routes
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        users: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
        ],
      })
    );
  }),

  rest.post('/api/contact', (req, res, ctx) => {
    return res(ctx.json({ success: true, message: 'Contact form submitted' }));
  }),

  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    if (id === '1') {
      return res(
        ctx.json({
          user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        })
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({ error: 'User not found' })
    );
  }),
);
```

### 3. Test Data Factory

#### utils/factory.ts
```typescript
// Factory for creating test data
export const createUser = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createBlogPost = (overrides = {}) => ({
  id: '1',
  title: 'Test Blog Post',
  content: 'This is test content',
  slug: 'test-blog-post',
  publishedAt: new Date().toISOString(),
  author: createUser(),
  ...overrides,
});

export const createProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  inStock: true,
  category: 'Test Category',
  ...overrides,
});
```

## Configuration Files

### 1. Package.json Test Scripts

#### Test Scripts in package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test && npm run test:e2e",
    "test:coverage:ui": "jest --coverage --watchAll=false"
  }
}
```

### 2. ESLint Test Configuration

#### .eslintrc.json Test Rules
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "overrides": [
    {
      "files": ["**/*.test.(ts|tsx)", "**/__tests__/**/*.(ts|tsx)"],
      "env": {
        "jest": true
      },
      "plugins": ["testing-library"],
      "extends": [
        "plugin:testing-library/react",
        "plugin:testing-library/dom"
      ],
      "rules": {
        "testing-library/prefer-screen-queries": "error",
        "testing-library/no-debugging-utils": "warn",
        "testing-library/no-dom-import": "error"
      }
    },
    {
      "files": ["**/*.spec.ts"],
      "env": {
        "playwright/test": true
      },
      "extends": ["plugin:playwright/recommended"],
      "rules": {
        "playwright/expect-expect": "error",
        "playwright/no-useless-await": "error"
      }
    }
  ]
}
```

### 3. GitHub Actions Test Workflow

#### .github/workflows/test.yml
```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Migration Scripts

### 1. Testing Setup Script

```bash
#!/bin/bash
# setup-testing.sh

echo "Setting up testing framework for Next.js..."

# Install testing dependencies
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  @types/jest \
  msw \
  node-mocks-http \
  @playwright/test

# Install Jest Next.js integration
npm install --save-dev \
  @next/jest

# Install ESLint testing plugins
npm install --save-dev \
  eslint-plugin-testing-library \
  eslint-plugin-playwright

echo "Testing setup complete!"
```

### 2. Test File Generation Script

```typescript
// scripts/generate-test-files.ts
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

function generateTestFile(componentPath: string, componentName: string) {
  const testContent = `
import { render, screen } from '@testing-library/react';
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
  });
});
`;

  const testDir = join(componentPath, '__tests__');
  
  try {
    mkdirSync(testDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const testFilePath = join(testDir, `${componentName}.test.tsx`);
  writeFileSync(testFilePath, testContent);
  
  console.log(`Generated test file: ${testFilePath}`);
}

// Usage
generateTestFile('app/components', 'Button');
generateTestFile('app/components', 'Navigation');
```

## Migration Checklist

### Unit Testing Setup:
- [ ] Install Jest and React Testing Library
- [ ] Configure Jest for Next.js
- [ ] Set up test utilities and mocks
- [ ] Create test data factories
- [ ] Configure ESLint test rules

### Component Testing:
- [ ] Test component rendering
- [ ] Test component interactions
- [ ] Test component props
- [ ] Test component accessibility
- [ ] Set up visual regression testing

### API Route Testing:
- [ ] Test GET requests
- [ ] Test POST requests
- [ ] Test PUT/PATCH requests
- [ ] Test DELETE requests
- [ ] Test error handling
- [ ] Test request validation

### E2E Testing:
- [ ] Set up Playwright configuration
- [ ] Test user workflows
- [ ] Test form submissions
- [ ] Test authentication flows
- [ ] Test responsive design

### CI/CD Integration:
- [ ] Set up GitHub Actions workflow
- [ ] Configure test reporting
- [ ] Set up coverage reporting
- [ ] Configure E2E test execution
- [ ] Set up test artifact uploads

## Best Practices

### Test Organization:
- Place tests next to components (`__tests__` directories)
- Use descriptive test names
- Group related tests in `describe` blocks
- Use test data factories for consistent test data

### Mocking Strategy:
- Mock external APIs and services
- Use MSW for API mocking
- Mock Next.js router and navigation
- Clean up mocks between tests

### Coverage Goals:
- Aim for 80%+ code coverage
- Focus on critical paths and components
- Monitor coverage trends
- Exclude test files from coverage

This skill ensures comprehensive testing setup for Next.js applications with modern testing frameworks and best practices.
