import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

import { db } from "../db";
import { categoriesTable, insertCategoriesSchema } from "../schema";

const categories = new Hono()
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
          id: categoriesTable.id,
          name: categoriesTable.name,
          userId: categoriesTable.userId,
          icon: categoriesTable.icon,
          iconColor: categoriesTable.iconColor,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.userId, auth.userId));

      return c.json({ data, message: "Categories retrieved successfully" });
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new HTTPException(500, {
        res: c.json({ error: "Failed to fetch categories" }, 500),
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
            id: categoriesTable.id,
            name: categoriesTable.name,
            userId: categoriesTable.userId,
            icon: categoriesTable.icon,
            iconColor: categoriesTable.iconColor,
          })
          .from(categoriesTable)
          .where(
            and(
              eq(categoriesTable.userId, auth.userId),
              eq(categoriesTable.id, id),
            ),
          );

        if (!data) {
          throw new HTTPException(404, {
            res: c.json({ error: "Not found" }, 404),
          });
        }

        return c.json({ data });
      } catch (error) {
        if (error instanceof HTTPException) throw error;

        console.error("Error fetching category:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to fetch category" }, 500),
        });
      }
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertCategoriesSchema.pick({
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
          .insert(categoriesTable)
          .values({
            userId: auth.userId,
            ...values,
          })
          .returning();

        return c.json({ data, message: "Category created successfully" });
      } catch (error) {
        console.error("Error creating category:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to create category" }, 500),
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
          .delete(categoriesTable)
          .where(
            and(
              eq(categoriesTable.userId, auth.userId),
              inArray(categoriesTable.id, values.ids),
            ),
          )
          .returning({
            id: categoriesTable.id,
          });

        return c.json({ message: "Deleted successfully", data });
      } catch (error) {
        console.error("Error deleting categories:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to delete categories" }, 500),
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
      insertCategoriesSchema.pick({
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
          .update(categoriesTable)
          .set(values)
          .where(
            and(
              eq(categoriesTable.userId, auth.userId),
              eq(categoriesTable.id, id),
            ),
          )
          .returning();

        if (!data) {
          throw new HTTPException(404, {
            res: c.json({ error: "Not found" }, 404),
          });
        }

        return c.json({ data, message: "Category updated successfully" });
      } catch (error) {
        if (error instanceof HTTPException) throw error;

        console.error("Error updating category:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to update category" }, 500),
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
          .delete(categoriesTable)
          .where(
            and(
              eq(categoriesTable.userId, auth.userId),
              eq(categoriesTable.id, id),
            ),
          )
          .returning({
            id: categoriesTable.id,
          });

        if (!data) {
          throw new HTTPException(404, {
            res: c.json({ error: "Not found" }, 404),
          });
        }

        return c.json({ data, message: "Category deleted successfully" });
      } catch (error) {
        if (error instanceof HTTPException) throw error;

        console.error("Error deleting category:", error);
        throw new HTTPException(500, {
          res: c.json({ error: "Failed to delete category" }, 500),
        });
      }
    },
  );

export default categories;
