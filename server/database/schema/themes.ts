import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { accounts } from './accounts'

export const themes = sqliteTable('themes', {
  id: text('id').primaryKey(),
  accountId: text('account_id').references(() => accounts.id, { onDelete: 'cascade' }), // null for global templates
  name: text('name').notNull(),
  type: text('type').notNull(), // header | footer
  layoutJson: text('layout_json', { mode: 'json' }).notNull().$type<Record<string, any>>(),
  previewImageUrl: text('preview_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const themesRelations = relations(themes, ({ one }) => ({
  account: one(accounts, {
    fields: [themes.accountId],
    references: [accounts.id],
  }),
}))

export type Theme = typeof themes.$inferSelect
export type NewTheme = typeof themes.$inferInsert
