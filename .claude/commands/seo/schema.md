---
description: Generate JSON-LD schema markup
argument-hint: <schema-type> [parameters]
---

# Schema Generation: $ARGUMENTS

Use the seo-specialist agent to generate JSON-LD schema markup.

## Workflow

1. **Parse the request** - identify schema type and parameters
2. **Gather information** - extract details from context or prompt
3. **Generate schema** - create proper JSON-LD structure
4. **Provide implementation** - code + where to add it

## Supported Schema Types

| Type | Use Case | Example |
|------|----------|---------|
| **Product** | E-commerce products | Pricing, reviews |
| **Pricing** | Pricing plans | SaaS pricing, subscriptions |
| **Article** | Blog posts, news | Articles, guides |
| **FAQ** | FAQ sections | Q&A content |
| **HowTo** | Tutorial content | Step-by-step guides |
| **LocalBusiness** | Local businesses | Store, restaurant |
| **Organization** | Company info | Brand, contact |
| **Event** | Events | Webinars, conferences |
| **Course** | Educational content | Training, courses |
| **Review** | Product reviews | Ratings, testimonials |

## Schema Templates

### Product Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://example.com/image.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  }
}
```

### Pricing Schema (with multiple plans)
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Description",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "name": "Pro Plan",
      "price": "29",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "name": "Enterprise Plan",
      "price": "99",
      "priceCurrency": "USD"
    }
  ]
}
```

### FAQ Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question 1?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer 1..."
      }
    }
  ]
}
```

### Article Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "Article",
  "headline": "Article Title",
  "image": "https://example.com/image.jpg",
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-15",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name"
  },
  "description": "Article description..."
}
```

### HowTo Schema
```json
{
  "@context": "https://schema.org/",
  "@type": "HowTo",
  "name": "How to Do Something",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1",
      "text": "Do this first...",
      "url": "https://example.com/page#step1"
    }
  ]
}
```

## Implementation Guide

### Where to Add
Add the JSON-LD script tag to your HTML `<head>` or before `</body>`:

```html
<script type="application/ld+json">
{...schema content...}
</script>
```

### Validation Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### Benefits
- Rich snippets in search results
- Enhanced click-through rate (+15-30%)
- Better AI citation potential
- Improved structured data visibility

## Examples

**Generate Product schema:**
```
/seo schema product "My SaaS Product"
```

**Generate Pricing schema:**
```
/seo schema pricing "SaaS Platform"
```

**Generate FAQ schema:**
```
/seo schema faq
```

**Generate Article schema:**
```
/seo schema article "Blog Post Title" --image https://example.com/img.jpg --author "John"
```

**Generate HowTo schema:**
```
/seo schema howto "How to Install Software"
```

## Output Format

```
# Schema: [Type]
Generated: [Date]

## JSON-LD Code
```json
{...}
```

## Implementation

Add this script tag to your HTML:
```html
<script type="application/ld+json">
{...}
</script>
```

## Benefits
✓ Rich snippets in search results
✓ [Benefit 1]
✓ [Benefit 2]

## Validation
Test at: https://search.google.com/test/rich-results

## Next Steps
/seo audit [url]  # Verify schema is present
/content [type] [title]  # Create content with this schema
```
