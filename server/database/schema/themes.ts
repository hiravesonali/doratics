import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const themes = sqliteTable('themes', {
  id: text('id').primaryKey(),
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

export type Theme = typeof themes.$inferSelect
export type NewTheme = typeof themes.$inferInsert
