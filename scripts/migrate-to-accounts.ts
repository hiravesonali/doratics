/**
 * Migration Script: Project-based to Account-based Architecture
 *
 * This script migrates the database from:
 * - projects → websites
 * - user-owned projects → account-owned websites
 * - project-owned legal profiles → account-owned legal profiles
 *
 * Run with: npx tsx scripts/migrate-to-accounts.ts
 */

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { nanoid } from 'nanoid'
import { accounts, users, websites, legalProfiles, themes, pages } from '../server/database/schema'

const sqlite = new Database('.dev.db')
const db = drizzle(sqlite)

async function migrate() {
  console.log('Starting migration to account-based architecture...\n')

  try {
    // Step 1: Check if old projects table exists
    const tableCheck = sqlite.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='projects'"
    ).get()

    if (!tableCheck) {
      console.log('✓ No old projects table found, assuming fresh database')
      console.log('✓ Migration not needed - schemas are already up to date')
      return
    }

    console.log('Step 1: Found old projects table, beginning migration...')

    // Step 2: Fetch all existing data
    console.log('Step 2: Fetching existing data...')
    const oldProjects = sqlite.prepare('SELECT * FROM projects').all() as any[]
    const oldUsers = sqlite.prepare('SELECT * FROM users').all() as any[]
    const oldPages = sqlite.prepare('SELECT * FROM pages').all() as any[]
    const oldLegalProfiles = sqlite.prepare('SELECT * FROM legal_profiles').all() as any[]
    const oldThemes = sqlite.prepare('SELECT * FROM themes').all() as any[]

    console.log(`  - Found ${oldUsers.length} users`)
    console.log(`  - Found ${oldProjects.length} projects`)
    console.log(`  - Found ${oldPages.length} pages`)
    console.log(`  - Found ${oldLegalProfiles.length} legal profiles`)
    console.log(`  - Found ${oldThemes.length} themes`)

    // Step 3: Create accounts for each unique user
    console.log('\nStep 3: Creating accounts...')
    const userToAccountMap = new Map<string, string>()
    const projectToWebsiteMap = new Map<string, string>()
    const legalProfileMap = new Map<string, string>() // projectId -> legalProfileId

    for (const user of oldUsers) {
      const accountId = nanoid()
      userToAccountMap.set(user.id, accountId)

      console.log(`  - Creating account for user: ${user.email}`)

      // Create account
      sqlite.prepare(`
        INSERT INTO accounts (id, name, owner_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        accountId,
        user.email.split('@')[0] + "'s Account",
        user.id,
        Date.now(),
        Date.now()
      )
    }

    // Step 4: Update users with accountId
    console.log('\nStep 4: Updating users with accountId...')
    for (const user of oldUsers) {
      const accountId = userToAccountMap.get(user.id)
      sqlite.prepare('UPDATE users SET account_id = ? WHERE id = ?').run(accountId, user.id)
      console.log(`  - Updated user: ${user.email}`)
    }

    // Step 5: Migrate legal profiles to account-owned
    console.log('\nStep 5: Migrating legal profiles to accounts...')
    for (const legalProfile of oldLegalProfiles) {
      // Find the project this legal profile belongs to
      const project = oldProjects.find((p: any) => p.id === legalProfile.project_id)
      if (project) {
        const accountId = userToAccountMap.get(project.user_id)
        legalProfileMap.set(project.id, legalProfile.id)

        sqlite.prepare('UPDATE legal_profiles SET account_id = ? WHERE id = ?')
          .run(accountId, legalProfile.id)
        console.log(`  - Migrated legal profile for project: ${project.name}`)
      }
    }

    // Step 6: Migrate projects to websites
    console.log('\nStep 6: Migrating projects to websites...')
    for (const project of oldProjects) {
      const websiteId = project.id // Keep same ID for simplicity
      const accountId = userToAccountMap.get(project.user_id)
      const legalProfileId = legalProfileMap.get(project.id) || null
      projectToWebsiteMap.set(project.id, websiteId)

      sqlite.prepare(`
        INSERT INTO websites (
          id, account_id, name, industry_type, subdomain, custom_domain,
          legal_profile_id, theme_header_id, theme_footer_id, published,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        websiteId,
        accountId,
        project.name,
        project.industry_type,
        project.subdomain,
        project.custom_domain,
        legalProfileId,
        project.theme_header_id,
        project.theme_footer_id,
        project.published,
        project.created_at,
        project.updated_at
      )
      console.log(`  - Migrated project: ${project.name} → website`)
    }

    // Step 7: Update pages to reference websites
    console.log('\nStep 7: Updating pages to reference websites...')
    for (const page of oldPages) {
      const websiteId = projectToWebsiteMap.get(page.project_id)
      sqlite.prepare('UPDATE pages SET website_id = ? WHERE id = ?').run(websiteId, page.id)
      console.log(`  - Updated page: ${page.title}`)
    }

    // Step 8: Update themes with null accountId (they're global templates)
    console.log('\nStep 8: Marking themes as global templates...')
    sqlite.prepare('UPDATE themes SET account_id = NULL').run()
    console.log(`  - All ${oldThemes.length} themes marked as global`)

    // Step 9: Drop old projects table
    console.log('\nStep 9: Cleaning up old tables...')
    sqlite.prepare('DROP TABLE IF EXISTS projects').run()
    console.log('  - Dropped old projects table')

    console.log('\n✓ Migration completed successfully!')
    console.log('\nSummary:')
    console.log(`  - Created ${userToAccountMap.size} accounts`)
    console.log(`  - Migrated ${oldProjects.length} projects → websites`)
    console.log(`  - Updated ${oldPages.length} pages`)
    console.log(`  - Migrated ${oldLegalProfiles.length} legal profiles`)
    console.log(`  - Marked ${oldThemes.length} themes as global`)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    sqlite.close()
  }
}

migrate().catch(console.error)
