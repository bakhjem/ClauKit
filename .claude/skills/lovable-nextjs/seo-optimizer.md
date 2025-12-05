---
name: seo-optimizer
description: Optimizes SEO for Next.js migration, including metadata API, sitemaps, robots.txt, and structured data. Use when implementing SEO best practices for Next.js applications.
---

# SEO Optimizer for Next.js Migration

## Purpose

Implement comprehensive SEO optimization for Next.js applications, including metadata management, sitemap generation, and structured data implementation.

## When to Use This Skill

Use when optimizing Next.js applications for search engines:
- Implementing Next.js metadata API
- Creating dynamic sitemaps
- Setting up robots.txt
- Adding structured data (JSON-LD)
- Optimizing Core Web Vitals
- Setting up social media metadata

## Metadata Implementation

### 1. Static Metadata

#### Root Layout Metadata
```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: 'My Application',
    template: '%s | My Application',
  },
  description: 'Built with Next.js 15 and modern web technologies',
  
  // Keywords and author
  keywords: ['nextjs', 'react', 'typescript', 'web development'],
  authors: [{ name: 'John Doe', url: 'https://johndoe.com' }],
  creator: 'John Doe',
  publisher: 'My Company',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myapp.com',
    title: 'My Application',
    description: 'Built with Next.js 15 and modern web technologies',
    siteName: 'My Application',
    images: [
      {
        url: 'https://myapp.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Application',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'My Application',
    description: 'Built with Next.js 15 and modern web technologies',
    images: ['https://myapp.com/twitter-image.jpg'],
    creator: '@johndoe',
  },
  
  // Verification and indexing
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  
  // Additional metadata
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};
```

### 2. Dynamic Metadata

#### Dynamic Page Metadata
```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { getBlogPost } from '@/lib/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      url: `https://myapp.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `https://myapp.com/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // Component implementation
}
```

### 3. Route-Specific Metadata

#### E-commerce Product Metadata
```typescript
// app/products/[id]/page.tsx
import type { Metadata } from 'next';
import { getProduct } from '@/lib/products';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: `${product.name} - My Store`,
    description: product.description,
    keywords: product.tags.join(', '),
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'product',
      images: product.images.map((img, index) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: `${product.name} - Image ${index + 1}`,
      })),
      url: `https://mystore.com/products/${product.id}`,
      product: {
        price: {
          currency: 'USD',
          value: product.price.toString(),
        },
        availability: product.inStock ? 'in stock' : 'out of stock',
        condition: 'new',
        brand: product.brand,
        category: product.category,
      },
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  // Component implementation
}
```

## Sitemap Generation

### 1. Static Sitemap

#### app/sitemap.ts
```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://myapp.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://myapp.com/about',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://myapp.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://myapp.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
```

### 2. Dynamic Sitemap

#### Dynamic Blog Sitemap
```typescript
import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts();
  const baseUrl = 'https://myapp.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
```

### 3. Multilingual Sitemap

#### app/[lang]/sitemap.ts
```typescript
import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const locales = ['en', 'es', 'fr'];
const defaultLocale = 'en';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const baseUrl = 'https://myapp.com';
  
  const sitemap: MetadataRoute.Sitemap = [];
  
  // Add root pages for each locale
  locales.forEach(locale => {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map(altLocale => [
            altLocale,
            `${baseUrl}/${altLocale}`,
          ])
        ),
      },
    });
  });
  
  // Add blog posts for each locale
  posts.forEach(post => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(altLocale => [
              altLocale,
              `${baseUrl}/${altLocale}/blog/${post.slug}`,
            ])
          ),
        },
      });
    });
  });
  
  return sitemap;
}
```

## Robots.txt Configuration

### 1. Basic Robots.txt

#### app/robots.ts
```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/private/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://myapp.com/sitemap.xml',
    host: 'https://myapp.com',
  };
}
```

### 2. Advanced Robots Configuration

#### Environment-Specific Robots
```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = 'https://myapp.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: isProduction ? '/' : '/public/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/temp/',
          ...(isProduction ? [] : ['/']),
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/private/', '/temp/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

## Structured Data (JSON-LD)

### 1. Website Schema

#### app/layout.tsx
```typescript
import type { Metadata } from 'next';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My Application',
  url: 'https://myapp.com',
  description: 'Built with Next.js 15 and modern web technologies',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://myapp.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'My Company',
    logo: {
      '@type': 'ImageObject',
      url: 'https://myapp.com/logo.png',
      width: 512,
      height: 512,
    },
  },
};

export const metadata: Metadata = {
  other: {
    'application/ld+json': JSON.stringify(websiteSchema),
  },
};
```

### 2. Blog Article Schema

#### app/blog/[slug]/page.tsx
```typescript
// Component implementation with structured data
export default function BlogPostPage({ post }: { post: BlogPost }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Company',
      logo: {
        '@type': 'ImageObject',
        url: 'https://myapp.com/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://myapp.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <article>
        {/* Blog post content */}
      </article>
    </>
  );
}
```

### 3. Product Schema

#### app/products/[id]/page.tsx
```typescript
export default function ProductPage({ product }: { product: Product }) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.url),
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'My Store',
      },
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <div>
        {/* Product content */}
      </div>
    </>
  );
}
```

## Performance Optimization

### 1. Core Web Vitals

#### app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  // ... other metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### app/analytics/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Send to analytics service
  await sendToAnalytics(body);
  
  return NextResponse.json({ success: true });
}
```

### 2. Image SEO Optimization

#### Optimized Images Component
```typescript
// app/components/SEOImage.tsx
import Image from 'next/image';

interface SEOImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function SEOImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: SEOImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### 3. Lazy Loading and Prefetching

#### SEO-Optimized Navigation
```typescript
// app/components/Navigation.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationItem {
  href: string;
  label: string;
  prefetch?: boolean;
}

export function Navigation() {
  const router = useRouter();
  
  const navItems: NavigationItem[] = [
    { href: '/', label: 'Home', prefetch: true },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog', prefetch: true },
    { href: '/contact', label: 'Contact' },
  ];
  
  return (
    <nav>
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={item.prefetch}
          scroll={true}
          replace={false}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

## Social Media Optimization

### 1. Open Graph Images

#### Dynamic OG Image Generation
```typescript
// app/api/og/route.ts
import { ImageResponse } from 'next/og';
import { getProduct } from '@/lib/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  
  const product = await getProduct(id);
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 48,
          fontWeight: 'bold',
          padding: 40,
        }}
      >
        <div style={{ fontSize: 60 }}>{product.name}</div>
        <div style={{ fontSize: 24, marginTop: 20 }}>
          ${product.price}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

### 2. Twitter Card Optimization

#### Twitter Metadata Component
```typescript
// app/components/TwitterMetadata.tsx
import Head from 'next/head';

interface TwitterMetadataProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

export function TwitterMetadata({
  title,
  description,
  image,
  imageAlt,
  cardType = 'summary_large_image',
}: TwitterMetadataProps) {
  return (
    <Head>
      <meta name="twitter:card" content={cardType} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Head>
  );
}
```

## SEO Analytics and Monitoring

### 1. Search Console Integration

#### SEO Analytics Component
```typescript
// app/components/SEOAnalytics.tsx
'use client';

import { useEffect } from 'react';

export function SEOAnalytics() {
  useEffect(() => {
    // Google Search Console verification
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      document.head.appendChild(script);
      
      // Bing Webmaster Tools
      const meta = document.createElement('meta');
      meta.name = 'msvalidate.01';
      meta.content = 'your-bing-verification-code';
      document.head.appendChild(meta);
    }
  }, []);
  
  return null; // This component doesn't render anything
}
```

### 2. Performance Monitoring

#### SEO Performance Tracking
```typescript
// app/lib/seo-tracking.ts
export function trackSEOEvent(eventName: string, data: Record<string, any>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', eventName, {
      event_category: 'SEO',
      ...data,
    });
  }
}

export function trackPageView(url: string, title: string) {
  trackSEOEvent('page_view', {
    page_location: url,
    page_title: title,
  });
}

export function trackSearch(query: string, results: number) {
  trackSEOEvent('search', {
    search_term: query,
    results_count: results,
  });
}
```

## Migration Scripts

### 1. SEO Migration Script

```bash
#!/bin/bash
# migrate-seo.sh

echo "Migrating SEO configuration to Next.js..."

# Create sitemap file
cat > app/sitemap.ts << 'EOF'
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://myapp.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}
EOF

# Create robots file
cat > app/robots.ts << 'EOF'
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
    ],
    sitemap: 'https://myapp.com/sitemap.xml',
  };
}
EOF

echo "SEO migration complete!"
```

### 2. Metadata Validation Script

```typescript
// scripts/validate-seo.ts
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface SEOValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSEO(): SEOValidationResult {
  const result: SEOValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };
  
  // Check if sitemap exists
  try {
    require('../app/sitemap.ts');
  } catch {
    result.errors.push('sitemap.ts not found in app directory');
    result.valid = false;
  }
  
  // Check if robots exists
  try {
    require('../app/robots.ts');
  } catch {
    result.errors.push('robots.ts not found in app directory');
    result.valid = false;
  }
  
  // Check metadata in layout
  const layoutContent = readFileSync('app/layout.tsx', 'utf-8');
  if (!layoutContent.includes('metadata:')) {
    result.warnings.push('No metadata found in layout.tsx');
  }
  
  return result;
}
```

## Migration Checklist

### Basic SEO Setup:
- [ ] Create metadata in app/layout.tsx
- [ ] Set up dynamic metadata for pages
- [ ] Generate sitemap.ts
- [ ] Create robots.ts
- [ ] Add structured data (JSON-LD)
- [ ] Optimize images with next/image

### Advanced SEO:
- [ ] Implement dynamic OG image generation
- [ ] Set up multilingual sitemaps
- [ ] Add Core Web Vitals monitoring
- [ ] Configure social media metadata
- [ ] Set up SEO analytics tracking

### Performance:
- [ ] Optimize image loading
- [ ] Implement proper caching headers
- [ ] Set up lazy loading
- [ ] Configure prefetching strategies
- [ ] Monitor Core Web Vitals

### Validation:
- [ ] Test sitemap accessibility
- [ ] Validate robots.txt syntax
- [ ] Check structured data with Google's tool
- [ ] Test social media cards
- [ ] Run SEO audit with Lighthouse

This skill ensures comprehensive SEO implementation for Next.js applications with modern best practices and optimization techniques.
