import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { accounts } from './accounts'
import { legalProfiles } from './legal-profiles'

export const websites = sqliteTable('websites', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  industryType: text('industry_type').notNull(), // electrician, plumber, cleaner, painter, gardener
  subdomain: text('subdomain').notNull().unique(),
  customDomain: text('custom_domain').unique(),
  legalProfileId: text('legal_profile_id').references(() => legalProfiles.id, { onDelete: 'set null' }),
  themeHeaderId: text('theme_header_id'),
  themeFooterId: text('theme_footer_id'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const websitesRelations = relations(websites, ({ one }) => ({
  account: one(accounts, {
    fields: [websites.accountId],
    references: [accounts.id],
  }),
  legalProfile: one(legalProfiles, {
    fields: [websites.legalProfileId],
    references: [legalProfiles.id],
  }),
}))

export type Website = typeof websites.$inferSelect
export type NewWebsite = typeof websites.$inferInsert
