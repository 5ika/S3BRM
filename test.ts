import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import {
  getStartOfDay,
  getStartOfWeek,
  getStartOfMonth,
  isSameDate,
} from "./date.ts";

const date = new Date("2022-08-13");

Deno.test("getSartOfDay", () => {
  const startOfDay: Date = getStartOfDay(date);
  assertEquals(startOfDay.getHours(), 0);
  assertEquals(startOfDay.getMinutes(), 0);
  assertEquals(startOfDay.getMilliseconds(), 0);
});

Deno.test("getStartOfWeek returns start of week", () => {
  const startOfWeek = getStartOfWeek(date);
  assertEquals(startOfWeek.getDate(), 8);
  assertEquals(startOfWeek.getMonth(), 7); // 7 = August
  assertEquals(startOfWeek.getHours(), 0);
  assertEquals(startOfWeek.getMinutes(), 0);
  assertEquals(startOfWeek.getMilliseconds(), 0);
});

Deno.test("getStartOfMonth returns start of month", () => {
  const startOfMonth = getStartOfMonth(date);
  assertEquals(startOfMonth.getDate(), 1);
  assertEquals(startOfMonth.getMonth(), 7); // 7 = August
  assertEquals(startOfMonth.getHours(), 0);
  assertEquals(startOfMonth.getMinutes(), 0);
  assertEquals(startOfMonth.getMilliseconds(), 0);
});

Deno.test("isSameDate returns true for same dates but different hours", () => {
  const dateB = new Date(new Date("2022-08-13").setHours(23, 10, 33));
  const comparaison = isSameDate(date, dateB);
  assertEquals(comparaison, true);
});

Deno.test("isSameDate returns false for different dates", () => {
  const dateB = new Date("2022-08-02");
  const comparaison = isSameDate(date, dateB);
  assertEquals(comparaison, false);
});
