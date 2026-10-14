export type RangeMode = "month" | "quarter" | "year365";

export const RANGE_MODES: Array<{ value: RangeMode; label: string }> = [
  { value: "month", label: "By Month" },
  { value: "quarter", label: "By Quarter" },
  { value: "year365", label: "365 days" },
];

export function isRangeMode(value: unknown): value is RangeMode {
  return value === "month" || value === "quarter" || value === "year365";
}

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeRange(mode: RangeMode, month: number, year: number) {
  if (mode === "year365") {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 365);
    return { start, end };
  }
  const monthsBack = mode === "quarter" ? 2 : 0;
  return {
    start: new Date(year, month - monthsBack, 1),
    end: new Date(year, month + 1, 0),
  };
}

export function getRangeStrings(mode: RangeMode, month: number, year: number) {
  const { start, end } = computeRange(mode, month, year);
  return { startDate: formatIsoDate(start), endDate: formatIsoDate(end) };
}

export function getRangeDays(mode: RangeMode, month: number, year: number): number {
  const { start, end } = computeRange(mode, month, year);
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

export function describeRange(mode: RangeMode, month: number, year: number): string {
  if (mode === "month") {
    return new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  const { start, end } = computeRange(mode, month, year);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function weekStartIso(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map((n) => parseInt(n, 10));
  const date = new Date(y, m - 1, d);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return formatIsoDate(date);
}
