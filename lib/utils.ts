import { type ClassValue, clsx } from "clsx";
import {
  eachDayOfInterval,
  endOfDay,
  format,
  isValid,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";
import { id as LOCALE_ID } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMiliUnit(amount: number) {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const dailyTotalsMap = new Map(
    activeDays.map((day) => [
      format(day.date, "yyyy-MM-dd", { locale: LOCALE_ID }),
      { income: day.income, expenses: day.expenses },
    ]),
  );

  return allDays.map((day) => {
    const dayKey = format(day, "yyyy-MM-dd", { locale: LOCALE_ID });
    const dailyTotal = dailyTotalsMap.get(dayKey);

    return {
      date: day,
      income: dailyTotal ? dailyTotal.income : 0,
      expenses: dailyTotal ? dailyTotal.expenses : 0,
    };
  });
}

export function formatDateRange(period?: {
  from: string | Date;
  to?: string | Date;
}) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const fromDate = period?.from
    ? parseDate(period.from, defaultFrom)
    : defaultFrom;
  const toDate = period?.to ? parseDate(period.to, defaultTo) : defaultTo;

  return `${format(fromDate, "LLL dd", { locale: LOCALE_ID })} - ${format(toDate, "LLL dd, y", { locale: LOCALE_ID })}`;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {},
) {
  const result = new Intl.NumberFormat("id-ID", {
    style: "percent",
  }).format(value / 100);

  return options.addPrefix && value > 0 ? `+ ${result}` : result;
}

export function parseDate(dateStr: string | Date | undefined, fallback: Date) {
  if (!dateStr) return fallback;

  if (dateStr instanceof Date) return dateStr;

  const parsed = parseISO(dateStr.toString());

  return isValid(parsed) ? parsed : fallback;
}

export function getDateRange(from?: string, to?: string) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = startOfDay(parseDate(from, defaultFrom));
  const endDate = endOfDay(parseDate(to, defaultTo));

  return { startDate, endDate };
}
