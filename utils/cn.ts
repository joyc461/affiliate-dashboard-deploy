import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and intelligently merges Tailwind CSS classes using tailwind-merge.
 * Prevents class specificity conflicts (e.g. 'px-2 px-4' -> 'px-4').
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
