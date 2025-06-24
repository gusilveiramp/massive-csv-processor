// FOrmat date to friendlyformat (eg: 24 Mar 2025, 14:30:00)
export function formatDate(dateString: string | null): string {
  if (!dateString) return "No date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24h format
  });
}

// Converts "DD/MM/YYYY" HH:mm:ss" to ISO ("YYYY-MM-DDTHH:mm:ssZ")
export function parseUSDateTimeToISO(input: string): string | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})[\sT](\d{2}):(\d{2}):(\d{2})$/;

  const match = input.match(regex);
  if (!match) return null;

  const [, month, day, year, hour, minute, second] = match;

  const isoString = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`
  ).toISOString();

  return isoString;
}

// Converts ISO to "DD/MM/YYYY HH:mm:ss"
export function formatISOToUSDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}

// Apply dinâmic input mask: "DD/MM/YYYY HH:mm:ss"
export function formatDateInput(text: string): string {
  const numeric = text.replace(/[^0-9]/g, "").slice(0, 14);

  let formatted = "";

  if (numeric.length <= 2) {
    formatted = numeric;
  } else if (numeric.length <= 4) {
    formatted = `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
  } else if (numeric.length <= 8) {
    formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(
      4
    )}`;
  } else if (numeric.length <= 10) {
    formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(
      4,
      8
    )} ${numeric.slice(8)}`;
  } else if (numeric.length <= 12) {
    formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(
      4,
      8
    )} ${numeric.slice(8, 10)}:${numeric.slice(10)}`;
  } else {
    formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(
      4,
      8
    )} ${numeric.slice(8, 10)}:${numeric.slice(10, 12)}:${numeric.slice(
      12,
      14
    )}`;
  }

  return formatted;
}
