import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

import { parseDate } from "@/lib/utils";

import { db } from "../db";
import {
  accountsTable,
  categoriesTable,
  insertTransactionsSchema,
  transactionsTable,
} from "../schema";

const transactions = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = startOfDay(parseDate(from, defaultFrom));
      const endDate = endOfDay(parseDate(to, defaultTo));

      const data = await db
        .select({
          id: transactionsTable.id,
          amount: transactionsTable.amount,
          date: transactionsTable.date,
          payee: transactionsTable.payee,
          notes: transactionsTable.notes,
          category: categoriesTable.name,
          categoryId: transactionsTable.categoryId,
          account: accountsTable.name,
          accountId: transactionsTable.accountId,
        })
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id),
        )
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id),
        )
        .where(
          and(
            accountId ? eq(transactionsTable.accountId, accountId) : undefined,
            eq(accountsTable.userId, auth.userId),
            gte(transactionsTable.date, startDate),
            lte(transactionsTable.date, endDate),
          ),
        )
        .orderBy(desc(transactionsTable.date));

      return c.json({ data });
    },
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Id is required" }, 400),
        });
      }

      const [data] = await db
        .select({
          id: transactionsTable.id,
          amount: transactionsTable.amount,
          date: transactionsTable.date,
          payee: transactionsTable.payee,
          notes: transactionsTable.notes,
          categoryId: transactionsTable.categoryId,
          accountId: transactionsTable.accountId,
        })
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id),
        )
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id),
        )
        .where(
          and(
            eq(transactionsTable.id, id),
            eq(accountsTable.userId, auth.userId),
          ),
        );

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Not found" }, 404),
        });
      }

      return c.json({ data });
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true,
      }),
    ),
    async (c) => {
      const auth = getAuth(c);

      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const [data] = await db
        .insert(transactionsTable)
        .values({
          ...values,
        })
        .returning();

      return c.json({ data });
    },
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionsSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);

      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const data = await db
        .insert(transactionsTable)
        .values(
          values.map((value) => ({
            ...value,
          })),
        )
        .returning();

      return c.json({ data });
    },
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);

      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(
            accountsTable,
            eq(transactionsTable.accountId, accountsTable.id),
          )
          .where(
            and(
              inArray(transactionsTable.id, values.ids),
              eq(accountsTable.userId, auth.userId),
            ),
          ),
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(
          inArray(
            transactionsTable.id,
            sql`(SELECT id FROM ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: transactionsTable.id,
        });

      return c.json({ message: "Deleted successfully", data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertTransactionsSchema.omit({
        id: true,
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Id is required" }, 400),
        });
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(
            accountsTable,
            eq(transactionsTable.accountId, accountsTable.id),
          )
          .where(
            and(
              eq(transactionsTable.id, id),
              eq(accountsTable.userId, auth.userId),
            ),
          ),
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactionsTable)
        .set(values)
        .where(
          inArray(
            transactionsTable.id,
            sql`(SELECT id FROM ${transactionsToUpdate})`,
          ),
        )
        .returning();

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Not found" }, 404),
        });
      }

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Id is required" }, 400),
        });
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(
            accountsTable,
            eq(transactionsTable.accountId, accountsTable.id),
          )
          .where(
            and(
              eq(transactionsTable.id, id),
              eq(accountsTable.userId, auth.userId),
            ),
          ),
      );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(
          inArray(
            transactionsTable.id,
            sql`(SELECT id FROM ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: transactionsTable.id,
        });

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Not found" }, 404),
        });
      }

      return c.json({ data });
    },
  );

export default transactions;
