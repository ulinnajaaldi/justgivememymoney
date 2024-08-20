import { createId } from "@paralleldrive/cuid2";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(createId),
  plain_id: text("plain_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const insertAccountsSchema = createInsertSchema(accountsTable);
