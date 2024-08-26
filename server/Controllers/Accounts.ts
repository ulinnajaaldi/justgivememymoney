import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

import { db } from "../db";
import { accountsTable, insertAccountsSchema } from "../schema";

const accounts = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const data = await db
      .select({
        id: accountsTable.id,
        name: accountsTable.name,
        userId: accountsTable.userId,
      })
      .from(accountsTable)
      .where(eq(accountsTable.userId, auth.userId));

    return c.json({ data });
  })
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
          id: accountsTable.id,
          name: accountsTable.name,
          userId: accountsTable.userId,
        })
        .from(accountsTable)
        .where(
          and(eq(accountsTable.userId, auth.userId), eq(accountsTable.id, id)),
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
      insertAccountsSchema.pick({
        name: true,
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
        .insert(accountsTable)
        .values({
          userId: auth.userId,
          ...values,
        })
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

      const data = await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.userId, auth.userId),
            inArray(accountsTable.id, values.ids),
          ),
        )
        .returning({
          id: accountsTable.id,
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
      insertAccountsSchema.pick({
        name: true,
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

      const [data] = await db
        .update(accountsTable)
        .set(values)
        .where(
          and(eq(accountsTable.userId, auth.userId), eq(accountsTable.id, id)),
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

      const [data] = await db
        .delete(accountsTable)
        .where(
          and(eq(accountsTable.userId, auth.userId), eq(accountsTable.id, id)),
        )
        .returning({
          id: accountsTable.id,
        });

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Not found" }, 404),
        });
      }

      return c.json({ data });
    },
  );

export default accounts;
