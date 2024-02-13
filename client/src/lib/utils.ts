import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASEURL = "http://localhost:5173";

export const session = () => {
  const key = "username";
  return {
    get: () => window.sessionStorage.getItem(key),
    set: (value: string) => window.sessionStorage.setItem(key, value),
  };
};
