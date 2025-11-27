import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  industryType: text('industry_type').notNull(), // electrician, plumber, cleaner, painter, gardener
  subdomain: text('subdomain').notNull().unique(),
  customDomain: text('custom_domain').unique(),
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

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}))

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
