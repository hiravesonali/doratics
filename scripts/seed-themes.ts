import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { themes } from '../server/database/schema'
import { allDefaultThemes } from '../server/database/seeds/themes'
import { eq } from 'drizzle-orm'

const sqlite = new Database('.dev.db')
const db = drizzle(sqlite)

async function seedThemes() {
  console.log('🌱 Seeding default themes...')

  for (const theme of allDefaultThemes) {
    // Check if theme already exists
    const existing = await db
      .select()
      .from(themes)
      .where(eq(themes.id, theme.id))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(themes).values(theme)
      console.log(`✅ Created theme: ${theme.name} (${theme.type})`)
    } else {
      console.log(`⏭️  Theme already exists: ${theme.name}`)
    }
  }

  console.log('✨ Theme seeding complete!')
}

seedThemes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding themes:', error)
    process.exit(1)
  })
