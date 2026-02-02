import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseEstimatedHours(timeString: string | null | undefined): number {
  if (!timeString) return 0;

  const str = timeString.toLowerCase().trim();
  let hours = 0;

  // Handle "X hours" or "X hrs"
  const hourMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr|h)s?/);
  if (hourMatch) {
    hours += parseFloat(hourMatch[1]);
  }

  // Handle "X mins" or "X minutes"
  const minMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:minute|min|m)s?/);
  if (minMatch) {
    hours += parseFloat(minMatch[1]) / 60;
  }

  return hours;
}
