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

    try {
      const data = await db
        .select({
          id: accountsTable.id,
          name: accountsTable.name,
          icon: accountsTable.icon,
          iconColor: accountsTable.iconColor,
          userId: accountsTable.userId,
        })
        .from(accountsTable)
        .where(eq(accountsTable.userId, auth.userId));

      return c.json({ data, message: "Accounts fetched successfully" });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new HTTPException(500, {
        res: c.json({ error: "Failed to fetch accounts" }, 500),
      });
    }
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

      try {
        const [data] = await db
          .select({
            id: accountsTable.id,
            name: accountsTable.name,
            icon: accountsTable.icon,
            iconColor: accountsTable.iconColor,
            userId: accountsTable.userId,
          })
          .from(accountsTable)
          .where(
            and(
              eq(accountsTable.userId, auth.userId),
              eq(accountsTable.id, id),
            ),
          );

        if (!data) {
          throw new HTTPException(404, {
            res: c.json({ error: "Not found" }, 404),
          });
        }

        return c.json({ data, message: "Account fetched successfully" });
      } catch (error) {
        if (error instanceof HTTPException) throw error;

        console.error("Error fetching account:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to fetch account" }, 500),
        });
      }
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountsSchema.pick({
        name: true,
        icon: true,
        iconColor: true,
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

      try {
        const [data] = await db
          .insert(accountsTable)
          .values({
            userId: auth.userId,
            ...values,
          })
          .returning();

        return c.json({ data, message: "Account created successfully" });
      } catch (error) {
        console.error("Error creating account:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to create account" }, 500),
        });
      }
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

      try {
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

        return c.json({ data, message: "Bulk delete successful" });
      } catch (error) {
        console.error("Error bulk deleting accounts:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to delete accounts" }, 500),
        });
      }
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
        icon: true,
        iconColor: true,
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

      try {
        const [data] = await db
          .update(accountsTable)
          .set(values)
          .where(
            and(
              eq(accountsTable.userId, auth.userId),
              eq(accountsTable.id, id),
            ),
          )
          .returning();

        if (!data) {
          throw new HTTPException(404, {
            res: c.json({ error: "Not found" }, 404),
          });
        }

        return c.json({ data, message: "Account updated successfully" });
      } catch (error) {
        if (error instanceof HTTPException) throw error;

        console.error("Error updating account:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to update account" }, 500),
        });
      }
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

      try {
        const [data] = await db
          .delete(accountsTable)
          .where(
            and(
              eq(accountsTable.userId, auth.userId),
              eq(accountsTable.id, id),
            ),
          )
          .returning({
            id: accountsTable.id,
          });

        if (!data) {
          throw new HTTPException(404, {
            res: c.json({ error: "Not found" }, 404),
          });
        }

        return c.json({ data, message: "Account deleted successfully" });
      } catch (error) {
        if (error instanceof HTTPException) throw error;

        console.error("Error deleting account:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to delete account" }, 500),
        });
      }
    },
  );

export default accounts;
