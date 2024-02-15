import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASEURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://simplechat-server.vercel.app";

export const session = () => {
  const key = "username";
  return {
    get: () => window.sessionStorage.getItem(key),
    set: (value: string) => window.sessionStorage.setItem(key, value),
  };
};
