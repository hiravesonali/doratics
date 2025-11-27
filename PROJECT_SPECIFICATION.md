# Handyman Website Builder - MVP Specification

## 1. Product Summary

A vertical SaaS website builder for handymen and local service businesses (electricians, plumbers, cleaners, painters, gardeners).

**Core Features:**
- Non-technical users can build websites in minutes
- Predefined legal pages (Impressum & Datenschutz)
- Pre-built industry templates
- Live preview
- One-click publish
- Subdomains + custom domains
- SEO-optimized public rendering

**Architecture:** Single Nuxt 3 application with Admin/Builder Mode and Public Renderer Mode

---

## 2. Core Technical Stack

### Framework & Runtime
- **Nuxt 3** with SSR enabled
- **Vue 3** with TypeScript
- **Drizzle ORM** for database operations

### Hosting & Infrastructure
- **Cloudflare Pages** (Nuxt deployment)
- **Cloudflare Workers** (middleware & domain resolution)
- **Cloudflare D1** (primary database) - *Currently using SQLite for development*
- **Cloudflare R2** (image/file storage)

### Authentication
- **Clerk** or equivalent passwordless auth *(MVP using demo tokens)*

### Payments
- **Stripe** subscription-based SaaS *(MVP-ready but optional toggle)*

---

## 3. Domain & Routing Architecture

### Supported Domains
- **Free subdomains:** `project-slug.yourapp.com`
- **Paid custom domains:** `www.customer-domain.com` → CNAME → `yourapp.com`

### Domain Resolution Logic
For every request:
1. Read request host header
2. Match against:
   - `projects.custom_domain = host` OR
   - `projects.subdomain = subdomain(host)`
3. Load project context
4. Load page layout JSON
5. Render with SSR
6. Cache at edge

**Implementation:** See `server/middleware/domain-resolver.ts`

---

## 4. Application Modes

### 4.1 Admin / Builder Mode
- **Access:** `app.yourapp.com`
- **Routes:**
  - `/admin/login`
  - `/admin/projects`
  - `/admin/projects/[id]`
  - `/admin/projects/[id]/pages/[pageId]` - Page Builder
  - `/admin/design`
  - `/admin/settings`
  - `/admin/publish`

### 4.2 Public Rendering Mode
- **Access:** `*.yourapp.com` or custom domains
- **Routes:**
  - `/` → Home
  - `/services` → Services
  - `/about` → About
  - `/contact` → Contact
  - `/impressum` → Legal
  - `/privacy` → Legal

---

## 5. Page Builder System

### Editor Engine
Using: **[@myissue/vue-website-page-builder](https://github.com/myissue-studio/vue-website-page-builder)** (v3.4.87)

**Initialization:** Plugin at `plugins/page-builder.client.ts`

### Block System
Each page consists of JSON blocks:
- Hero
- Image + Text
- Service Grid
- Testimonial Slider
- Contact Form
- Google Map
- CTA Banner

**Storage:** `pages.layout_json` (JSON field)

---

## 6. Themes System

### Requirements
- User selects one header theme and one footer theme
- Themes shared across all pages
- Themes stored as JSON layouts
- Not editable at component level

**Storage:** `projects.theme_header_id` and `projects.theme_footer_id`

---

## 7. Legal Page Generator (Germany-First)

### Mandatory Non-Removable Pages
- `/impressum`
- `/privacy`

### Input Fields
- Company name
- Owner name
- Address
- Email
- Phone
- VAT ID (optional)

### Implementation
- Static text templates with dynamic data injection
- Must block publishing if legal fields incomplete
- See: `server/utils/legal-templates.ts`

---

## 8. SEO System

### Per-Page SEO Fields
- Custom title
- Meta description
- Slug control
- Canonical URLs
- OpenGraph tags
- JSON-LD for LocalBusiness

### Auto-Generated Files
- `/sitemap.xml` - See: `server/routes/sitemap.xml.ts`
- `/robots.txt` - See: `server/routes/robots.txt.ts`

**Requirement:** SSR output must be fully crawlable HTML

---

## 9. Publishing Workflow

1. User edits page
2. JSON saved as draft
3. User previews on `preview.yourapp.com/{slug}`
4. User clicks Publish
5. Draft promoted to live
6. Cache invalidated
7. Live domain instantly updated

**Status Field:** `pages.status` (draft | published)

---

## 10. Image & Asset Handling

- Uploaded via R2
- Returned as public CDN URLs
- Stored only as URLs inside block JSON
- No local disk storage

**Endpoint:** `server/api/upload/image.post.ts`

---

## 11. Database Schema

### Current Implementation
Located in: `server/database/schema/`

#### users
```typescript
- id (text, primary key)
- email (text, unique, not null)
- createdAt (integer, not null)
```

#### projects
```typescript
- id (text, primary key)
- userId (text, not null, references users)
- name (text, not null)
- industryType (text)
- subdomain (text, unique)
- customDomain (text)
- themeHeaderId (text)
- themeFooterId (text)
- published (integer, boolean)
- createdAt (integer, not null)
- updatedAt (integer, not null)
```

#### pages
```typescript
- id (text, primary key)
- projectId (text, not null, references projects)
- title (text, not null)
- slug (text, not null)
- layoutJson (text, JSON)
- seoTitle (text)
- seoDescription (text)
- status (text, default: 'draft')
- createdAt (integer, not null)
- updatedAt (integer, not null)
- unique(projectId, slug)
```

#### themes
```typescript
- id (text, primary key)
- name (text, not null)
- type (text, not null) // 'header' | 'footer'
- layoutJson (text, JSON)
- createdAt (integer, not null)
```

#### legal_profiles
```typescript
- id (text, primary key)
- projectId (text, unique, not null, references projects)
- companyName (text, not null)
- ownerName (text, not null)
- address (text, not null)
- email (text, not null)
- phone (text, not null)
- vatId (text)
- createdAt (integer, not null)
- updatedAt (integer, not null)
```

---

## 12. Multi-Tenancy & Security Rules

- Host-based resolution is the only access key
- No project data may render unless host matches `project.domain`
- Admin routes blocked on all customer domains
- Every DB query must be scoped by `project_id`

**Implementation:** `server/middleware/domain-resolver.ts`

---

## 13. Payments & Plans

### Plans (MVP-Ready but Toggleable)
- **Free:** Subdomain only
- **Pro:** Custom domain
- **Agency:** Up to 10 websites

### Payment Gates
- Custom domain activation
- Extra projects

---

## 14. Performance Targets

- Public page TTFB < 200ms
- First contentful paint < 1s (EU region)
- Full page load < 2s

---

## 15. Non-Goals for MVP

❌ Multi-language support
❌ Blogging system
❌ User comments
❌ Ecommerce
❌ Booking system

---

## 16. Current Implementation Status

### ✅ Completed
- [x] Nuxt 3 project structure
- [x] Database schema with Drizzle ORM
- [x] Domain-based routing middleware
- [x] Projects CRUD API
- [x] Pages CRUD API
- [x] Legal profile API
- [x] Page Builder UI integration (`@myissue/vue-website-page-builder`)
- [x] Page Builder plugin initialization
- [x] Public page rendering API
- [x] SEO: Sitemap.xml generation
- [x] SEO: Robots.txt generation
- [x] Image upload endpoint (R2 ready)
- [x] Legal page templates

### 🚧 In Progress / Pending
- [ ] Full domain resolution in production
- [ ] Theme system implementation
- [ ] Publishing workflow (draft → published)
- [ ] Cache invalidation
- [ ] Preview mode
- [ ] Clerk authentication integration
- [ ] Stripe payment integration
- [ ] Custom domain setup UI
- [ ] Legal validation before publish
- [ ] Complete public renderer with SSR

---

## 17. API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project

### Pages
- `GET /api/pages/[projectId]` - List pages for project
- `POST /api/pages/[projectId]` - Create page
- `GET /api/pages/[projectId]/[pageId]` - Get page details
- `PATCH /api/pages/[projectId]/[pageId]` - Update page

### Legal
- `GET /api/legal/[projectId]` - Get legal profile
- `POST /api/legal/[projectId]` - Create/update legal profile

### Public
- `GET /api/public/page` - Render public page (domain-based)

### Upload
- `POST /api/upload/image` - Upload image to R2

---

## 18. File Structure

```
handymen/
├── server/
│   ├── api/
│   │   ├── legal/[projectId]/
│   │   ├── pages/[projectId]/
│   │   ├── projects/
│   │   ├── public/
│   │   └── upload/
│   ├── database/
│   │   └── schema/
│   ├── middleware/
│   │   └── domain-resolver.ts
│   ├── routes/
│   │   ├── sitemap.xml.ts
│   │   └── robots.txt.ts
│   └── utils/
│       ├── auth.ts
│       ├── db.ts
│       └── legal-templates.ts
├── pages/
│   └── admin/
│       └── projects/
├── plugins/
│   └── page-builder.client.ts
├── nuxt.config.ts
└── package.json
```

---

## 19. Environment Variables

```env
# Authentication
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Domain Configuration
APP_DOMAIN=localhost:3000
ADMIN_DOMAIN=app.localhost:3000

# Database (Production)
DATABASE_URL=

# Storage (Production)
R2_BUCKET_NAME=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
```

---

## 20. Business Constraints

This MVP must be capable of:
- Supporting 1,000+ customer sites
- Zero manual operations
- Zero per-customer deployment

---

## 21. Success Criteria

✅ A handyman can create and publish a website in under 10 minutes
✅ The site ranks on Google
✅ Legal compliance blocks invalid publishes
✅ Custom domains work without manual configuration

---

## 22. External References

- [Nuxt SSR & SEO](https://nuxt.com/docs/getting-started/seo)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Vue Website Builder](https://github.com/myissue-studio/vue-website-page-builder)
- [German Impressum Law](https://www.gesetze-im-internet.de/tmg/__5.html)

---

## 23. Known Issues & Technical Debt

1. **Authentication:** Currently using demo tokens instead of Clerk
2. **Database:** Using SQLite locally instead of Cloudflare D1
3. **Storage:** R2 endpoint exists but not fully tested
4. **Domain Resolution:** Middleware in place but needs production testing
5. **Publishing:** Status field exists but workflow not complete
6. **Themes:** Schema exists but no UI/API implementation
7. **Legal Validation:** Templates exist but no pre-publish validation

### Recent Fixes

- ✅ **Fixed PageBuilder Initialization:** Created client-side plugin to properly initialize `@myissue/vue-website-page-builder` using `getPageBuilder()` composable
- ✅ **Fixed Zod v4 Compatibility:** Updated validation schemas from `z.record(z.any())` to `z.record(z.string(), z.unknown())` for Zod v4 compatibility
- ✅ **Verified JSON Storage:** Confirmed that SQLite TEXT column properly stores and retrieves JSON data for `layout_json` field

---

## 24. Next Implementation Priorities

1. Complete publishing workflow with status transitions
2. Implement theme selection and application
3. Add legal validation before publish
4. Integrate Clerk authentication
5. Test and refine domain resolution
6. Add preview mode
7. Implement cache invalidation
8. Complete public renderer with SSR
9. Add Stripe integration
10. Production deployment to Cloudflare Pages

---

## Notes for Future Claude Sessions

This document represents the current state of the MVP. When resuming work:

1. Check the "Current Implementation Status" section
2. Review "Known Issues & Technical Debt"
3. Reference "Next Implementation Priorities"
4. All code follows TypeScript strict mode
5. Database access goes through Drizzle ORM
6. Page Builder uses `@myissue/vue-website-page-builder` library
7. The app is a single Nuxt 3 application serving both admin and public modes
