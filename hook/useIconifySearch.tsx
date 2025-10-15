// hooks/useIconifySearch.ts
import { useEffect, useMemo, useRef, useState } from "react";

import { type IconSearchResponse, searchIcons } from "@/lib/iconify";

/** Normalize both shapes returned by /search into string IDs "prefix:name" */
function toId(hit: string | { name: string; prefix: string }): string {
  if (typeof hit === "string") return hit.includes(":") ? hit : "";
  return hit?.prefix && hit?.name ? `${hit.prefix}:${hit.name}` : "";
}

type Options = { prefix?: string; limit?: number };

export function useIconifySearch(term: string, opts?: Options) {
  const [loading, setLoading] = useState(false);
  const [iconIds, setIconIds] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const limit = opts?.limit ?? 72;
  const key = useMemo(
    () => `${opts?.prefix || "ALL"}:${term.trim().toLowerCase()}:${limit}`,
    [term, opts?.prefix, limit],
  );

  // keep a Set of seen IDs to dedupe across pages
  const seenIdsRef = useRef<Set<string>>(new Set());
  const cache = useRef<Map<string, { total: number; ids: string[] }>>(
    new Map(),
  );

  /** Fetch page helper */
  const fetchPage = async (start = 0) => {
    const q = term.trim();
    const res = await searchIcons(q, { prefix: opts?.prefix, limit, start });
    const ids = (res as IconSearchResponse).icons.map(toId).filter(Boolean);
    return { ids, total: (res as IconSearchResponse).total };
  };

  // initial search / term or scope changed
  useEffect(() => {
    const q = term.trim();
    seenIdsRef.current = new Set();
    setIconIds([]);
    setTotal(0);

    if (!q) return;

    let cancelled = false;
    const run = async () => {
      const cached = cache.current.get(key);
      if (cached) {
        // hydrate from cache
        const uniq: string[] = [];
        for (const id of cached.ids) {
          if (!seenIdsRef.current.has(id)) {
            seenIdsRef.current.add(id);
            uniq.push(id);
          }
        }
        if (!cancelled) {
          setIconIds(uniq);
          setTotal(cached.total);
        }
        return;
      }

      setLoading(true);
      try {
        const { ids, total } = await fetchPage(0);
        cache.current.set(key, { ids, total });

        const uniq: string[] = [];
        for (const id of ids) {
          if (!seenIdsRef.current.has(id)) {
            seenIdsRef.current.add(id);
            uniq.push(id);
          }
        }
        if (!cancelled) {
          setIconIds(uniq);
          setTotal(total);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const id = setTimeout(run, 250); // debounce
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [key, term, opts?.prefix, limit]);

  const hasMore = iconIds.length < total;

  const loadMore = async () => {
    const q = term.trim();
    if (!q || !hasMore || loading) return;

    setLoading(true);
    try {
      const start = iconIds.length; // next page offset
      const { ids, total: newTotal } = await fetchPage(start);

      // dedupe with set
      const newOnes: string[] = [];
      for (const id of ids) {
        if (!seenIdsRef.current.has(id)) {
          seenIdsRef.current.add(id);
          newOnes.push(id);
        }
      }

      setIconIds((prev) => [...prev, ...newOnes]);
      setTotal(newTotal);

      // merge into cache for this key
      const prev = cache.current.get(key) || { ids: [], total: newTotal };
      cache.current.set(key, {
        ids: [...prev.ids, ...newOnes],
        total: newTotal,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, iconIds, total, hasMore, loadMore };
}
