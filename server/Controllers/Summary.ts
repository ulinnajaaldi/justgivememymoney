import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

import { db } from "../db";
import { accountsTable, categoriesTable, transactionsTable } from "../schema";

const summary = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    }),
  ),
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

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const fetchFinancialData = async (
      userId: string,
      startDate: Date,
      endDate: Date,
    ) => {
      return await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
              Number,
            ),
          expenses:
            sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
              Number,
            ),
          remaining: sum(transactionsTable.amount).mapWith(Number),
        })
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id),
        )
        .where(
          and(
            accountId ? eq(transactionsTable.accountId, accountId) : undefined,
            eq(accountsTable.userId, userId),
            gte(transactionsTable.date, startDate),
            lte(transactionsTable.date, endDate),
          ),
        );
    };

    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate,
    );

    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd,
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income,
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses,
    );
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining,
    );

    const category = await db
      .select({
        name: categoriesTable.name,
        value: sql`SUM(ABS(${transactionsTable.amount}))`.mapWith(Number),
      })
      .from(transactionsTable)
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id),
      )
      .innerJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id),
      )
      .where(
        and(
          accountId ? eq(transactionsTable.accountId, accountId) : undefined,
          eq(accountsTable.userId, auth.userId),
          lt(transactionsTable.amount, 0),
          gte(transactionsTable.date, startDate),
          lte(transactionsTable.date, endDate),
        ),
      )
      .groupBy(categoriesTable.name)
      .orderBy(desc(sql`SUM(ABS(${transactionsTable.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0,
    );
    const finalCategories = topCategories;

    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherSum,
      });
    }

    const activeDays = await db
      .select({
        date: sql`DATE(${transactionsTable.date})::date`.mapWith(
          (date: string) => new Date(date),
        ),
        income: sql`COALESCE(SUM(
        CASE WHEN ${transactionsTable.amount} >= 0 
        THEN ${transactionsTable.amount} 
        ELSE 0 END
      ), 0)`.mapWith(Number),
        expenses: sql`COALESCE(ABS(SUM(
        CASE WHEN ${transactionsTable.amount} < 0 
        THEN ${transactionsTable.amount} 
        ELSE 0 END
      )), 0)`.mapWith(Number),
      })
      .from(transactionsTable)
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id),
      )
      .where(
        and(
          accountId ? eq(transactionsTable.accountId, accountId) : undefined,
          eq(accountsTable.userId, auth.userId),
          gte(transactionsTable.date, startDate),
          lte(transactionsTable.date, endDate),
        ),
      )
      .groupBy(sql`DATE(${transactionsTable.date})`)
      .orderBy(sql`DATE(${transactionsTable.date})`);

    const days = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        remainingAmmount: currentPeriod.remaining,
        remainingChange,
        incomeAmmount: currentPeriod.income,
        incomeChange,
        expensesAmmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days,
      },
    });
  },
);

export default summary;
