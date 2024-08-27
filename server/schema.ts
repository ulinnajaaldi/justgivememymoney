import { createId } from "@paralleldrive/cuid2";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(createId),
  plainId: text("plain_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const insertAccountsSchema = createInsertSchema(accountsTable);

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(createId),
  plainId: text("plain_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const insertCategoriesSchema = createInsertSchema(categoriesTable);
