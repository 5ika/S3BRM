import { S3, S3Object } from "https://deno.land/x/s3@0.5.0/mod.ts";
import { terminal } from "https://raw.githubusercontent.com/5ika/ink/master/mod.ts";
import { getStartOfMonth, getStartOfWeek, isSameDate } from "./date.ts";

const debugMode = Deno.args.includes("--debug") || Deno.args.includes("-d");

if (debugMode)
  terminal.log("<yellow>DEBUG MODE - Nothing will be deleted</yellow>");

const s3 = new S3({
  accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
  secretKey: Deno.env.get("S3_SECRET_KEY")!,
  region: Deno.env.get("S3_REGION")!,
  endpointURL: `https://${Deno.env.get("S3_ENDPOINT_HOST")}`,
});

const bucket = s3.getBucket(Deno.env.get("S3_BUCKET")!);
const items: AsyncGenerator<S3Object> = bucket.listAllObjects({
  prefix: Deno.env.get("FILES_PREFIX") ?? "",
  batchSize: 1000,
});

const today: Date = new Date();
const dailyBackupInterval = Deno.env.get("DAILY_BACKUP_INTERVAL") || 13;
const dailyBackupMaxDate: Date = new Date(
  new Date().setDate(today.getDate() - parseInt(`${dailyBackupInterval}`))
);
const weeklyBackupInterval = Deno.env.get("WEEKLY_BACKUP_INTERVAL") || 31;
const weeklyBackupMaxDate: Date = new Date(
  new Date().setDate(today.getDate() - parseInt(`${weeklyBackupInterval}`))
);
const monthlyBackupInterval = Deno.env.get("MONTHLY_BACKUP_INTERVAL") || 183;
const monthlyBackupMaxDate: Date = new Date(
  new Date().setDate(today.getDate() - parseInt(`${monthlyBackupInterval}`))
);

for await (const item of items) {
  // If item is a directory or has no date
  if (item.size === 0 || !item?.lastModified || !item.key) continue;

  // Keep items wich is first day of month and has date < monthlyBackupInterval days ago
  const startOfMonth = getStartOfMonth(item.lastModified);
  if (
    item.lastModified > monthlyBackupMaxDate &&
    isSameDate(item.lastModified, startOfMonth)
  ) {
    terminal.log(
      `<magenta>Keep ${item.key} [monthly backup, < ${monthlyBackupInterval} days]</magenta>`
    );
    continue;
  }

  // Keep items wich is first day of week and has date < 1 weeklyBackupInterval days ago
  const startOfWeek = getStartOfWeek(item.lastModified);
  if (
    item.lastModified > weeklyBackupMaxDate &&
    isSameDate(item.lastModified, startOfWeek)
  ) {
    terminal.log(
      `<cyan>Keep ${item.key} [weekly backup, < ${weeklyBackupInterval} days]</cyan>`
    );
    continue;
  }

  // Keep items with date < dailyBackupInterval days ago
  if (item.lastModified > dailyBackupMaxDate) {
    terminal.log(
      `<dim>Keep ${item.key} [daily backup, < ${dailyBackupInterval} days]</dim>`
    );
    continue;
  }

  // Delete others
  terminal.log(`<red>Delete ${item.key}</red>`);
  if (!debugMode)
    try {
      await bucket.deleteObject(item.key);
    } catch (error) {
      terminal.log(item.key, error);
    }
}
