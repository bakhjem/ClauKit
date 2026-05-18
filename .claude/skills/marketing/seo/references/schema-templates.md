# JSON-LD Schema Templates — Canonical Reference

Single source of truth for `/ck:seo:schema` command. Defines schema-type taxonomy + JSON-LD templates + implementation guide.

## Supported Schema Types

| Type | Use Case | Example |
|---|---|---|
| `Product` | E-commerce products | Pricing, reviews |
| `Pricing` | Pricing plans | SaaS, subscriptions |
| `Article` | Blog posts, news | Articles, guides |
| `FAQ` (FAQPage) | FAQ sections | Q&A content |
| `HowTo` | Tutorial content | Step-by-step guides |
| `LocalBusiness` | Local businesses | Store, restaurant |
| `Organization` | Company info | Brand, contact |
| `Event` | Events | Webinars, conferences |
| `Course` | Educational content | Training, courses |
| `Review` | Product reviews | Ratings, testimonials |
| `Person` | Author/creator | Bio, credentials |
| `WebSite` | Website | Search functionality |
| `WebPage` | Generic pages | All page types |
| `VideoObject` | Video content | YouTube, embedded |
| `BreadcrumbList` | Breadcrumbs | Navigation paths |

## Variant Flags

| Flag | Effect |
|---|---|
| `--auto <url>` | Auto-generate schema from URL content (extract title, description, images, dates, author, pricing/offers, FAQ, ratings) |
| `--validate` | Validate existing schema on a URL (syntax, required props, format, Rich Results eligibility, schema.org compliance) |
| `--nested` | Create connected schemas with `@graph` nesting |
| `--extract` | Extract and enhance existing schema |

### Supported Nested Combinations
- `Organization` + `LocalBusiness` + `OpeningHoursSpecification`
- `Product` + `Offer` + `AggregateRating`
- `Article` + `Author` + `Organization` + `Publisher`
- `Event` + `Offer` + `Location` + `Organization`

## JSON-LD Templates

### Product
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://example.com/image.jpg",
  "brand": { "@type": "Brand", "name": "Brand Name" },
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

### Nested Organization + LocalBusiness
```json
{
  "@context": "https://schema.org/",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Company Name",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png"
    },
    {
      "@type": "LocalBusiness",
      "parentOrganization": { "name": "Company Name" },
      "name": "Store Location",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main St",
        "addressLocality": "City",
        "addressCountry": "US"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  ]
}
```

### FAQ (FAQPage)
```json
{
  "@context": "https://schema.org/",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question 1?",
      "acceptedAnswer": { "@type": "Answer", "text": "Answer 1..." }
    }
  ]
}
```

### Article
```json
{
  "@context": "https://schema.org/",
  "@type": "Article",
  "headline": "Article Title",
  "image": "https://example.com/image.jpg",
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-15",
  "author": { "@type": "Person", "name": "Author Name" },
  "publisher": { "@type": "Organization", "name": "Publisher Name" },
  "description": "Article description..."
}
```

### HowTo
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
Add JSON-LD `<script>` tag to HTML `<head>` (preferred) or before `</body>`:

```html
<script type="application/ld+json">
{...schema content...}
</script>
```

### Validation Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Bing Webmaster Tools](https://bing.com/webmasters)

### Benefits
- Rich snippets in search results
- Enhanced CTR (+15–30%)
- Better AI citation potential
- Improved structured-data visibility

## Output Template

```markdown
# Schema: [Type]
Generated: [Date]

## Auto-Extracted Content (--auto)
- Title · Description · Images · Author · Date

## JSON-LD Code
```json
{...}
```

## Validation Results (--validate)
- Syntax: Valid · Required Properties: Present · Rich Results: Eligible
- Warnings: [if any]

## Nested Schemas (--nested)
- [Schema 1] → [Schema 2] (relationship)

## Implementation
Add to HTML:
```html
<script type="application/ld+json">{...}</script>
```

## Validation
Test at: https://search.google.com/test/rich-results

## Next Steps
/ck:seo:audit [url]  # Verify schema is present
/ck:content [type] [title]  # Create content with this schema
```
