import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { websites } from './websites'

export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  websiteId: text('website_id')
    .notNull()
    .references(() => websites.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  layoutJson: text('layout_json', { mode: 'json' }).notNull().$type<Record<string, any>>(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  status: text('status').notNull().default('draft'), // draft | published
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const pagesRelations = relations(pages, ({ one }) => ({
  website: one(websites, {
    fields: [pages.websiteId],
    references: [websites.id],
  }),
}))

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert
