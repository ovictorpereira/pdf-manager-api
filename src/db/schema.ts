import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

export const tb_documents = mysqlTable("tb_documents", {
  id: int("id").primaryKey().autoincrement(),
  label: varchar("label", { length: 255 }).notNull(),
  pdf_path: varchar("pdf_path", { length: 255 }).unique().notNull(),
  thumb_path: varchar("thumb_path", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
