# Doratics Website Builder MVP

A vertical SaaS website builder for Doratics and local service businesses (electricians, plumbers, cleaners, painters, gardeners).

## Features


### Core Functionality
- ✅ **Multi-tenant Architecture**: Single Nuxt app serving multiple customer websites
- ✅ **Domain Resolution**: Subdomain + custom domain support
- ✅ **SSR Rendering**: Full server-side rendering for SEO
- ✅ **Admin Dashboard**: Project and page management interface
- ✅ **Block-based Pages**: Reusable content blocks (Hero, Services, Contact, etc.)
- ✅ **Legal Compliance**: Auto-generated Impressum & Datenschutz (German law)
- ✅ **SEO Optimized**: Meta tags, sitemaps, robots.txt
- ✅ **Publishing Workflow**: Draft/Published status
- ✅ **Image Uploads**: Cloudflare R2 integration
- ✅ **Auth Ready**: Clerk integration placeholder
- ✅ **Payments Ready**: Stripe hooks in place

## Tech Stack

- **Framework**: Nuxt 3 + Vue 3 + TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Storage**: Cloudflare R2
- **Hosting**: Cloudflare Pages
- **Auth**: Clerk (placeholder)
- **Payments**: Stripe (hooks ready)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Cloudflare

#### Create D1 Database
```bash
pnpm wrangler d1 create handymen_db
# Copy the database_id to wrangler.toml
```

#### Create R2 Bucket
```bash
pnpm wrangler r2 bucket create handymen-assets
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Run Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate:sqlite

# Apply to D1 database
pnpm wrangler d1 execute handymen_db --file=./server/database/migrations/0000_initial.sql
```

### 5. Start Development

```bash
pnpm dev
```

Access:
- Admin: `http://app.localhost:3000`
- Test site: `http://test-project.localhost:3000`

## Project Structure

```
doratics.app/
├── server/
│   ├── api/                    # API endpoints
│   │   ├── projects/          # Project CRUD
│   │   ├── pages/             # Page CRUD
│   │   ├── legal/             # Legal profiles
│   │   ├── public/            # Public rendering
│   │   └── upload/            # R2 image uploads
│   ├── database/
│   │   ├── schema/            # Drizzle schemas
│   │   └── migrations/        # DB migrations
│   ├── middleware/
│   │   └── domain-resolver.ts # Multi-tenant routing
│   └── utils/
│       ├── db.ts              # Database connection
│       ├── auth.ts            # Auth utilities
│       └── legal-templates.ts # German legal pages
├── pages/
│   ├── admin/                 # Admin UI
│   └── [...slug].vue          # Public catch-all
└── components/
    ├── admin/                 # Admin components
    └── public/                # Public site components
        └── blocks/            # Content blocks
```

## Database Schema

```typescript
users          // User accounts (Clerk)
projects       // Customer websites
pages          // Website pages (JSON layouts)
themes         // Header/footer themes
legal_profiles // Impressum/Privacy data
```

## API Endpoints

### Admin (Auth Required)
```
GET    /api/projects              # List projects
POST   /api/projects              # Create project
PATCH  /api/projects/:id          # Update project

GET    /api/pages/:projectId      # List pages
POST   /api/pages/:projectId      # Create page
PATCH  /api/pages/:projectId/:id  # Update page

GET    /api/legal/:projectId      # Get legal info
POST   /api/legal/:projectId      # Save legal info

POST   /api/upload/image          # Upload to R2
```

### Public (No Auth)
```
GET    /api/public/page?slug=/    # Get published page
GET    /sitemap.xml               # Sitemap
GET    /robots.txt                # Robots
```

## Domain Resolution

The system uses host-based multi-tenancy:

1. **Admin**: `app.yourapp.com` → Admin dashboard
2. **Subdomain**: `customer.yourapp.com` → Customer site
3. **Custom Domain**: `www.customer.com` → Customer site (CNAME required)

Middleware reads the `host` header and resolves to the correct project.

## Content Blocks

Available blocks:
- `hero`: Hero section
- `service-grid`: Services grid
- `image-text`: Image with text
- `contact-form`: Contact form
- `testimonials`: Testimonials

Example block JSON:
```json
{
  "type": "hero",
  "heading": "Professional Services",
  "subheading": "Licensed & Insured",
  "ctaText": "Get Quote",
  "ctaLink": "#contact"
}
```

## Legal Pages (German Compliance)

Auto-generated pages:
- `/impressum`: Company info, owner, contact (TMG §5)
- `/privacy`: GDPR data protection notice

**Publishing is blocked until legal profile is complete.**

## Authentication

Clerk placeholder is implemented. To activate:

1. Sign up at [clerk.com](https://clerk.com)
2. Add keys to `.env`
3. Update `server/utils/auth.ts` with Clerk JWT verification

## Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Cloudflare Pages
```bash
pnpm wrangler pages deploy .output/public
```

### Configuration Checklist
- [ ] D1 database created
- [ ] R2 bucket created
- [ ] Migrations applied
- [ ] Environment variables set
- [ ] Custom domain DNS configured
- [ ] Clerk authentication enabled
- [ ] Stripe webhooks configured

## Performance

- Target TTFB: < 200ms
- Target FCP: < 1s
- Target Full Load: < 2s

Optimizations:
- Cloudflare edge caching
- SSR for SEO
- Image optimization via R2

## Security

✅ All DB queries scoped by `projectId`
✅ Host-based access control
✅ Admin routes blocked on customer domains
✅ Auth required for mutations

## Next Steps

### Implement Authentication
- Integrate Clerk JWT verification
- Add user registration flow
- Implement role-based access

### Add Payments
- Stripe subscription flow
- Plan limits (Free/Pro/Agency)
- Usage tracking

### Enhance Builder
- Visual page editor
- More content blocks
- Theme customization
- Custom CSS support

### Add Features
- Form submissions
- Analytics dashboard
- Email notifications
- Booking system integration

## Troubleshooting

**Domain not resolving?**
- Check `wrangler.toml` D1 binding
- Verify middleware execution
- Check browser console for errors

**Images not uploading?**
- Verify R2 bucket exists
- Check file size (max 5MB)
- Verify auth token is valid

**Legal pages missing?**
- Save legal profile in admin
- Check `/impressum` and `/privacy` routes

## Support

Questions? Issues?
- GitHub Issues
- Documentation
- Email support

---

**Built for handymen, by developers who care 🛠️**
