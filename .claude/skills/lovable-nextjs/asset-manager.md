---
name: asset-manager
description: Manages static assets migration from Lovable projects to Next.js, including images, fonts, CSS files, and public folder structure. Use when migrating assets and configuring Next.js image optimization.
---

# Asset Manager for Next.js Migration

## Purpose

Manage the migration of static assets from Lovable projects to Next.js, ensuring proper optimization and configuration for images, fonts, CSS, and other static files.

## When to Use This Skill

Use when migrating assets to Next.js:
- Moving static files to public directory
- Configuring Next.js image optimization
- Handling font imports and optimization
- Migrating CSS and styling files
- Setting up asset path references
- Configuring asset caching strategies

## Asset Directory Structure

### Next.js Public Directory Structure
```
public/
├── images/              # Static images
│   ├── logos/
│   ├── icons/
│   ├── banners/
│   └── products/
├── fonts/               # Font files
│   ├── inter/
│   └── custom/
├── icons/               # Favicon and app icons
│   ├── favicon.ico
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── apple-icon.png
├── files/               # Downloadable files
│   ├── pdfs/
│   ├── documents/
│   └── media/
├── robots.txt          # SEO robots file
├── sitemap.xml        # SEO sitemap
├── manifest.json      # PWA manifest
└── _next/            # Next.js static files (auto-generated)
```

## Image Asset Migration

### 1. Static Image Migration

#### Before (Lovable Vite)
```typescript
// src/assets/images/logo.svg
import logo from '@/assets/images/logo.svg';

function Header() {
  return (
    <img 
      src={logo} 
      alt="Company Logo"
      className="logo"
    />
  );
}
```

#### After (Next.js)
```typescript
// Place logo.svg in public/images/logo.svg
import Image from 'next/image';

function Header() {
  return (
    <Image
      src="/images/logo.svg"
      alt="Company Logo"
      width={120}
      height={40}
      className="logo"
      priority
    />
  );
}
```

### 2. Dynamic Image Migration

#### Before (Lovable)
```typescript
// src/components/ProductImage.tsx
interface ProductImageProps {
  imagePath: string;
  alt: string;
}

function ProductImage({ imagePath, alt }: ProductImageProps) {
  return (
    <img 
      src={imagePath} 
      alt={alt}
      className="product-image"
    />
  );
}

// Usage
<ProductImage 
  imagePath="/api/images/product-123.jpg"
  alt="Product Name"
/>
```

#### After (Next.js)
```typescript
// app/components/ProductImage.tsx
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

function ProductImage({ 
  src, 
  alt, 
  width = 300, 
  height = 300 
}: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="product-image"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  );
}

// Usage
<ProductImage 
  src="/images/products/product-123.jpg"
  alt="Product Name"
  width={400}
  height={400}
/>
```

### 3. Remote Image Configuration

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['assets.example.com'], // Legacy option
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
```

## Font Asset Migration

### 1. Local Font Migration

#### Before (Lovable)
```typescript
// src/styles/fonts.css
@font-face {
  font-family: 'Inter';
  src: url('@/assets/fonts/Inter-Regular.woff2') format('woff2'),
       url('@/assets/fonts/Inter-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

// src/App.tsx
import '@/styles/fonts.css';
```

#### After (Next.js)
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Google Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Local Font
const customFont = localFont({
  src: [
    {
      path: '../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${customFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Font CSS Migration

#### Global Font CSS
```css
/* app/globals.css */
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom-font.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: var(--font-inter), 'Custom Font', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-custom), var(--font-inter), sans-serif;
}
```

## CSS and Styling Migration

### 1. Global CSS Migration

#### Before (Lovable)
```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### After (Next.js)
```typescript
// app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 2. CSS Module Migration

#### Before (Lovable)
```typescript
// src/components/Button.module.css
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

// src/components/Button.tsx
import styles from './Button.module.css';

function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.button}>{children}</button>;
}
```

#### After (Next.js)
```typescript
// app/components/Button.module.css (Same as before)
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

// app/components/Button.tsx (Same as before)
import styles from './Button.module.css';

function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.button}>{children}</button>;
}
```

### 3. Tailwind CSS Migration

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
};

module.exports = nextConfig;
```

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Asset Optimization Configuration

### 1. Image Optimization

#### next.config.js with Advanced Image Config
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable sharp for better performance
    formats: ['image/webp', 'image/avif'],
    
    // Device and image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Quality settings
    quality: 75,
    minimumCacheTTL: 60,
    
    // Security
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

### 2. Asset Caching

#### Static Asset Caching
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.(woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Migration Scripts

### 1. Asset Migration Script

```bash
#!/bin/bash
# migrate-assets.sh

echo "Migrating assets to Next.js public directory..."

# Create public directory structure
mkdir -p public/{images,fonts,icons,files}
mkdir -p public/images/{logos,icons,banners,products}
mkdir -p public/fonts/{inter,custom}
mkdir -p public/files/{pdfs,documents,media}

# Copy images from src/assets to public/images
if [ -d "src/assets/images" ]; then
  cp -r src/assets/images/* public/images/
  echo "Copied images to public/images/"
fi

# Copy fonts from src/assets to public/fonts
if [ -d "src/assets/fonts" ]; then
  cp -r src/assets/fonts/* public/fonts/
  echo "Copied fonts to public/fonts/"
fi

# Copy other static files
if [ -f "src/assets/favicon.ico" ]; then
  cp src/assets/favicon.ico public/icons/favicon.ico
fi

if [ -f "src/assets/manifest.json" ]; then
  cp src/assets/manifest.json public/manifest.json
fi

# Update image imports in TypeScript files
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from "@/assets/images/|from "/images/|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|import.*from.*@/assets/images/||g'

echo "Asset migration complete!"
```

### 2. Image Import Conversion Script

```typescript
// scripts/convert-image-imports.ts
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface AssetMapping {
  [key: string]: string;
}

function convertImageImports(directory: string): void {
  const files = readdirSync(directory, { recursive: true });
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = join(directory, file);
      let content = readFileSync(filePath, 'utf-8');
      
      // Convert import statements
      content = content.replace(
        /import\s+(\w+)\s+from\s+['"@\/assets\/images\/(.+?)['"]/g,
        '// Image import removed: $1 from /images/$2'
      );
      
      // Convert img src attributes
      content = content.replace(
        /src=\{(\w+)\}/g,
        'src="/images/placeholder.jpg"'
      );
      
      // Convert static image imports
      content = content.replace(
        /src=['"@\/assets\/images\/(.+?)['"]/g,
        'src="/images/$1"'
      );
      
      writeFileSync(filePath, content);
    }
  });
}

// Usage
convertImageImports('./src');
```

## Asset Path Updates

### 1. Import Path Conversion

#### Before (Lovable)
```typescript
// Various import patterns in Lovable
import logo from '@/assets/images/logo.svg';
import banner from '@/assets/images/banners/home-banner.jpg';
import iconUser from '@/assets/images/icons/user-icon.png';
import fontInter from '@/assets/fonts/Inter-Regular.woff2';
```

#### After (Next.js)
```typescript
// Converted patterns for Next.js
import Image from 'next/image';
import logo from '/images/logo.svg'; // Static import
import banner from '/images/banners/home-banner.jpg';
import iconUser from '/images/icons/user-icon.png';

// Or with Image component
<Image src="/images/logo.svg" alt="Logo" width={120} height={40} />
<Image src="/images/banners/home-banner.jpg" alt="Banner" fill />
<Image src="/images/icons/user-icon.png" alt="User" width={24} height={24} />
```

### 2. CSS Asset Path Updates

#### Before (Lovable)
```css
/* src/styles/components.css */
.hero-section {
  background-image: url('@/assets/images/hero-bg.jpg');
}

.icon-button::before {
  background-image: url('@/assets/images/icons/arrow-right.svg');
}

@font-face {
  font-family: 'Custom';
  src: url('@/assets/fonts/custom-font.woff2') format('woff2');
}
```

#### After (Next.js)
```css
/* app/styles/components.css */
.hero-section {
  background-image: url('/images/hero-bg.jpg');
}

.icon-button::before {
  background-image: url('/images/icons/arrow-right.svg');
}

@font-face {
  font-family: 'Custom';
  src: url('/fonts/custom-font.woff2') format('woff2');
}
```

## Performance Optimization

### 1. Image Optimization Best Practices

#### Lazy Loading Images
```typescript
// app/components/ImageGallery.tsx
import Image from 'next/image';

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={index < 4 ? 'eager' : 'lazy'}
            priority={index === 0}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,..."
          />
        </div>
      ))}
    </div>
  );
}
```

#### Responsive Images
```typescript
// app/components/ResponsiveImage.tsx
import Image from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' 
}: ResponsiveImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      fill
      style={{ objectFit: 'cover' }}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

### 2. Font Optimization

#### Font Loading Strategy
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Optimized Google Font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
  variable: '--font-inter',
});

// Optimized Local Font
const customFont = localFont({
  src: [
    {
      path: '../public/fonts/Inter-400.woff2',
      weight: '400',
      style: 'normal',
      display: 'swap',
    },
  ],
  variable: '--font-custom',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${customFont.variable}`}
    >
      <body className={`${inter.className} ${customFont.className}`}>
        {children}
      </body>
    </html>
  );
}
```

## Migration Checklist

### For Static Assets:
- [ ] Copy all images to public/images/
- [ ] Copy all fonts to public/fonts/
- [ ] Copy icons to public/icons/
- [ ] Update image imports to use public paths
- [ ] Configure Next.js Image component
- [ ] Set up remote image patterns if needed
- [ ] Configure image optimization settings

### For Fonts:
- [ ] Migrate local fonts to public/fonts/
- [ ] Set up Google Fonts imports if used
- [ ] Configure font display strategies
- [ ] Update CSS font references
- [ ] Test font loading performance

### For CSS:
- [ ] Move global CSS to app/globals.css
- [ ] Update CSS asset paths
- [ ] Configure CSS modules if used
- [ ] Set up Tailwind CSS if applicable
- [ ] Test CSS loading and caching

### For Performance:
- [ ] Configure image optimization
- [ ] Set up proper caching headers
- [ ] Implement lazy loading for images
- [ ] Configure responsive image loading
- [ ] Test Core Web Vitals

## Common Issues and Solutions

### 1. Image Not Loading
```typescript
// Problem: Image path incorrect
<Image src="/images/logo.png" /> // ✅ Correct
<Image src="images/logo.png" />  // ❌ Missing leading slash
<Image src="@/images/logo.png" /> // ❌ Vite alias
```

### 2. Font Not Loading
```css
/* Problem: Font path incorrect */
@font-face {
  src: url('/fonts/custom-font.woff2'); /* ✅ Correct */
  src: url('fonts/custom-font.woff2'); /* ❌ Missing leading slash */
}
```

### 3. CSS Asset Paths
```css
/* Problem: CSS path references */
 background-image: url('/images/bg.jpg');    /* ✅ Correct */
 background-image: url('./bg.jpg');       /* ❌ Relative path */
 background-image: url('@/assets/bg.jpg'); /* ❌ Vite alias */
```

This skill ensures comprehensive asset migration from Lovable to Next.js with proper optimization and performance considerations.
