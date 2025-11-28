# Migration Guide: Account-Based Architecture

## Overview

This guide documents the migration from a user-centric to an account-centric architecture.

## Schema Changes

### New Tables

1. **accounts** - Core entity that owns resources
   - `id` (PK)
   - `name`
   - `ownerId` (references users.id)
   - `createdAt`, `updatedAt`

### Renamed Tables

| Old Name | New Name |
|----------|----------|
| `projects` | `websites` |

### Modified Tables

1. **users**
   - Added: `accountId` → references `accounts.id`

2. **websites** (formerly projects)
   - Renamed: `userId` → `accountId`
   - Added: `legalProfileId` → references `legal_profiles.id`

3. **pages**
   - Renamed: `projectId` → `websiteId`

4. **themes**
   - Added: `accountId` (nullable for global templates)

5. **legal_profiles**
   - Removed: `projectId`
   - Added: `accountId`

## Relationship Changes

### Before (User-Centric)
```
users
  ↓ owns
projects
  ↓ has one
legal_profiles
```

### After (Account-Centric)
```
users
  ↓ belongs to
accounts
  ↓ owns
├── websites
│     ↓ references
│   legal_profiles
├── themes (custom)
└── legal_profiles
```

## Breaking Changes

### API Endpoints

All `projects` endpoints need to be renamed to `websites`:

- `GET /api/projects` → `GET /api/websites`
- `POST /api/projects` → `POST /api/websites`
- `GET /api/projects/:id` → `GET /api/websites/:id`
- `PATCH /api/projects/:id` → `PATCH /api/websites/:id`
- `DELETE /api/projects/:id` → `DELETE /api/websites/:id`
- `GET /api/projects/:id/pages` → `GET /api/websites/:id/pages`
- `POST /api/projects/:id/pages` → `POST /api/websites/:id/pages`
- `PATCH /api/projects/:id/themes` → `PATCH /api/websites/:id/themes`

### Frontend Routes

- `/admin/projects` → `/admin/websites`
- `/admin/projects/:id` → `/admin/websites/:id`
- `/admin/projects/:id/pages/:pageId` → `/admin/websites/:id/pages/:pageId`
- `/admin/projects/:id/themes/header` → `/admin/websites/:id/themes/header`
- `/admin/projects/:id/themes/footer` → `/admin/websites/:id/themes/footer`

### Database Columns

All references to `projectId` or `project_id` must be updated to `websiteId` or `website_id`.

## Migration Steps

### 1. Reset Database (Development Only)

```bash
./scripts/reset-database.sh
```

This will:
- Backup existing .dev.db
- Drop and recreate database
- Generate fresh migrations
- Seed default themes

### 2. Update Server Code

Files to update:
- `server/api/projects/**` → rename to `websites`
- `server/api/pages/**` → update references
- `server/api/legal/**` → update references
- `server/api/themes/**` → update references
- `server/api/public/page.get.ts` → update references
- `server/middleware/**` → update context

### 3. Update Frontend Code

Files to update:
- `pages/admin/projects/**` → rename to `websites`
- `components/admin/*` → update references
- All fetch calls to `/api/projects` → `/api/websites`

### 4. Test Complete Flow

- User registration (creates account)
- Website creation (under account)
- Page creation (under website)
- Theme selection and customization
- Legal profile management
- Public page rendering

## Key Concepts

### Accounts

- **Owner**: Every account has one owner (the user who created it)
- **Multi-user**: Future: accounts can have multiple users with different roles
- **Auto-creation**: When a user registers, an account is automatically created

### Websites vs Projects

- **Naming**: "Website" is more user-friendly than "project"
- **Scope**: Websites belong to accounts, not users
- **Legal**: Each website can reference one legal profile

### Global vs Custom Themes

- **Global**: `themes.accountId = null` (available to all)
- **Custom**: `themes.accountId = specific_id` (account-specific)
- **Cloning**: When customizing a global theme, it's cloned with the account's ID

## Testing Checklist

- [ ] User registration creates account
- [ ] Website CRUD operations work
- [ ] Pages belong to websites correctly
- [ ] Legal profiles attach to websites
- [ ] Themes filter by account (show global + own custom)
- [ ] Theme customization creates account-specific copy
- [ ] Public pages render with correct header/footer
- [ ] Subdomain routing still works

## Rollback Plan

If migration fails:

1. Stop the application
2. Restore backup: `cp .dev.db.backup_YYYYMMDD_HHMMSS .dev.db`
3. Revert code changes
4. Restart application
