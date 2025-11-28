import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { accounts } from './accounts'

export const legalProfiles = sqliteTable('legal_profiles', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
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

export const legalProfilesRelations = relations(legalProfiles, ({ one }) => ({
  account: one(accounts, {
    fields: [legalProfiles.accountId],
    references: [accounts.id],
  }),
}))

export type LegalProfile = typeof legalProfiles.$inferSelect
export type NewLegalProfile = typeof legalProfiles.$inferInsert
