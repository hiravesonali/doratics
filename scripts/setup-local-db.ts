import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

const sqlite = new Database('.dev.db')
const db = drizzle(sqlite)

console.log('Setting up local database...')

// Run migrations
migrate(db, { migrationsFolder: 'server/database/migrations' })

console.log('✓ Database migrations applied successfully!')

sqlite.close()
