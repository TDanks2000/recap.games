import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageFromURL = (link: string | null | undefined) => {
  if (!link) return null;
  try {
    const url = new URL(link);
    const host = url.host.replaceAll("www.", "");

    switch (host) {
      case "youtube.com":
      case "youtu.be":
        return `https://img.youtube.com/vi/${url.pathname
          .split("/")
          .pop()}/hqdefault.jpg`;
      default:
        return link;
    }
  } catch (error) {
    console.error(error);
    return link;
  }
};
