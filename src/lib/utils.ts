import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIdFromURL = (
  link: string | null | undefined
): string | null => {
  if (!link) return null;

  try {
    const url = new URL(link);
    const vParam = url.searchParams.get("v");
    if (vParam) return vParam;

    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      return id || null;
    }

    const pathSegments = url.pathname
      .split("/")
      .filter((seg) => seg.length > 0);
    for (let i = 0; i < pathSegments.length; i++) {
      if (
        (pathSegments[i] === "embed" || pathSegments[i] === "v") &&
        pathSegments[i + 1]
      ) {
        const id = pathSegments[i + 1];
        return id ?? null;
      }
    }

    return null;
  } catch {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&"'>]+)/;
    const match = link.match(regex);
    return match?.[1] ?? null;
  }
};

export const getImageFromURL = (
  link: string | null | undefined
): string | null => {
  if (!link) return null;

  try {
    const url = new URL(link);
    const host = url.host.replaceAll("www.", "");

    switch (host) {
      case "youtube.com":
      case "youtu.be": {
        const id = getIdFromURL(link);
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : link;
      }
      default:
        return link;
    }
  } catch {
    return link;
  }
};
