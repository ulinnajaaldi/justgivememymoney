import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { bigint, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  icon: text("icon"),
  iconColor: text("icon_color"),
});

export const accountRelationsTable = relations(accountsTable, ({ many }) => ({
  transactionsTable: many(transactionsTable),
}));

export const insertAccountsSchema = createInsertSchema(accountsTable);

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  icon: text("icon"),
  iconColor: text("icon_color"),
});

export const categoryRelationsTable = relations(
  categoriesTable,
  ({ many }) => ({
    transactionsTable: many(transactionsTable),
  }),
);

export const insertCategoriesSchema = createInsertSchema(categoriesTable);

export const transactionsTable = pgTable("transactions", {
  id: text("id").primaryKey().$defaultFn(createId),
  amount: bigint("amount", { mode: "number" }).notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accountsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelationsTable = relations(
  transactionsTable,
  ({ one }) => ({
    accountTable: one(accountsTable, {
      fields: [transactionsTable.accountId],
      references: [accountsTable.id],
    }),
    categoryTable: one(categoriesTable, {
      fields: [transactionsTable.categoryId],
      references: [categoriesTable.id],
    }),
  }),
);

export const insertTransactionsSchema = createInsertSchema(transactionsTable, {
  date: z.coerce.date(),
});
