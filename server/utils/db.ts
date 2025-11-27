import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../database/schema'

type DBInstance = ReturnType<typeof drizzleD1> | ReturnType<typeof drizzleBetterSqlite>

let dbInstance: DBInstance | null = null

export function useDB() {
  if (dbInstance) return dbInstance

  // Check if we're in Cloudflare Workers (production)
  if (process.env.DB && typeof process.env.DB === 'object') {
    dbInstance = drizzleD1(process.env.DB as unknown as D1Database, { schema })
    return dbInstance
  }

  // Development: use better-sqlite3
  const sqlite = new Database('.dev.db')
  dbInstance = drizzleBetterSqlite(sqlite, { schema })
  return dbInstance
}

export type DB = ReturnType<typeof useDB>
