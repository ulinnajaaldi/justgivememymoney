import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";

import accounts from "@/server/Controllers/Accounts";
import categories from "@/server/Controllers/Categories";
import summary from "@/server/Controllers/Summary";
import transactions from "@/server/Controllers/Transactions";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal Server Error" }, 500);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
