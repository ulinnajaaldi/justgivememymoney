// lib/iconify.ts
const ICONIFY_BASE = "https://api.iconify.design";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Iconify API ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

/** Search icons globally or scoped by collection prefix. Supports pagination. */
export type IconSearchResponse =
  | {
      // Standard iconify /search response (commonly returns array of "prefix:name")
      icons: Array<string>;
      total: number;
      limit?: number;
      start?: number;
      collections?: Record<string, unknown>;
      request?: Record<string, unknown>;
    }
  | {
      // Some proxies or variants may return object hits
      icons: Array<{ name: string; prefix: string }>;
      total: number;
      limit?: number;
      start?: number;
      collections?: Record<string, unknown>;
      request?: Record<string, unknown>;
    };

export function searchIcons(
  query: string,
  opts?: { prefix?: string; limit?: number; start?: number },
) {
  const params = new URLSearchParams({ query });
  if (opts?.prefix) params.set("prefix", opts.prefix); // omit to search all sets
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.start) params.set("start", String(opts.start));
  const url = `${ICONIFY_BASE}/search?${params.toString()}`;
  return getJSON<IconSearchResponse>(url);
}
