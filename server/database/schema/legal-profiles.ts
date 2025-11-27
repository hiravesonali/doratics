import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projects } from './projects'

export const legalProfiles = sqliteTable('legal_profiles', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .unique()
    .references(() => projects.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  ownerName: text('owner_name').notNull(),
  address: text('address').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  vatId: text('vat_id'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export type LegalProfile = typeof legalProfiles.$inferSelect
export type NewLegalProfile = typeof legalProfiles.$inferInsert
