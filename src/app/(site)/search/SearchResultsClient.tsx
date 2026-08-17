'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdCard } from '@/components/ads/AdCard';

export function SearchResultsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  // ============================================================
  // FILTER OPTIONS
  // ============================================================
  const DURATION_OPTIONS = [
    { label: 'Any duration', min: undefined, max: undefined },
    { label: 'Short (< 30s)', min: 0, max: 30 },
    { label: 'Standard (30-60s)', min: 30, max: 60 },
    { label: 'Long (1-3 min)', min: 60, max: 180 },
    { label: 'Extended (> 3 min)', min: 180, max: undefined },
  ];

  // ============================================================
  // PARAMS (Read live from browser query string)
  // ============================================================
  const q = rawSearchParams.get('q') || '';
  const currentPage = Math.max(1, Number(rawSearchParams.get('page')) || 1);
  const currentSort = rawSearchParams.get('sort') || 'trending';
  const currentCategory = rawSearchParams.get('category') || '';
  const minDuration = rawSearchParams.get('minDuration') || undefined;
  const maxDuration = rawSearchParams.get('maxDuration') || undefined;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);

  // Keep local text input synced if URL props change externally
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // ============================================================
  // FETCH API
  // ============================================================
  useEffect(() => {
    setLoading(true);

    const apiParams = new URLSearchParams();

    if (q) apiParams.set('q', q);
    if (currentCategory) apiParams.set('category', currentCategory);
    if (currentSort) apiParams.set('sort', currentSort);
    if (currentPage) apiParams.set('page', String(currentPage));

    if (minDuration !== undefined && minDuration !== null) apiParams.set('minDuration', minDuration);
    if (maxDuration !== undefined && maxDuration !== null) apiParams.set('maxDuration', maxDuration);

    fetch(`/api/search?${apiParams.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [
    q,
    currentCategory,
    currentSort,
    currentPage,
    minDuration,
    maxDuration,
  ]);

  // ============================================================
  // UPDATE PARAMS
  // ============================================================
  const updateSearchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const current = new URLSearchParams(rawSearchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          current.delete(key);
        } else {
          current.set(key, val);
        }
      });

      // Reset page back to 1 unless page itself was specified in updates
      if (!updates.page && updates.q !== undefined) {
        current.delete('page');
      }

      router.replace(`${pathname}?${current.toString()}`, {
        scroll: false,
      });
    },
    [rawSearchParams, pathname, router]
  );

  // ============================================================
  // SEARCH DEBOUNCE
  // ============================================================
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput !== q) {
        updateSearchParams({
          q: searchInput || undefined,
        });
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput, q, updateSearchParams]);

  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-8">
        <div className="flex gap-8">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64">
            <div className="sticky top-24">

              {/* CATEGORY */}
              <h3 className="text-sm font-semibold mb-3">Categories</h3>

              <button
                onClick={() => updateSearchParams({ category: undefined })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm mb-1",
                  !currentCategory
                    ? "bg-brand-500 text-white"
                    : "hover:bg-muted"
                )}
              >
                All Ads
              </button>

              {data?.categories?.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    updateSearchParams({ category: cat.slug })
                  }
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm mb-1 flex justify-between",
                    currentCategory === cat.slug
                      ? "bg-brand-500 text-white"
                      : "hover:bg-muted"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-70">
                    {cat.adCount}
                  </span>
                </button>
              ))}

              {/* DURATION */}
              <h3 className="text-sm font-semibold mt-6 mb-3">Duration</h3>

              {DURATION_OPTIONS.map((opt) => {
                const isActive =
                  (opt.min == null &&
                    opt.max == null &&
                    !minDuration &&
                    !maxDuration) ||
                  (minDuration === opt.min?.toString() &&
                    maxDuration === opt.max?.toString());

                return (
                  <button
                    key={opt.label}
                    onClick={() =>
                      updateSearchParams({
                        minDuration: opt.min?.toString(),
                        maxDuration: opt.max?.toString(),
                      })
                    }
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm mb-1",
                      isActive
                        ? "bg-brand-500 text-white"
                        : "hover:bg-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}

            </div>
          </aside>

          {/* MAIN */}
          <div className="flex-1 min-w-0">

            {/* SEARCH */}
            <div className="flex flex-col gap-4 mb-6">
              <input
                type="text"
                placeholder="Search ads..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full md:w-96 px-4 py-2 border rounded-lg bg-background text-foreground"
              />

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">
                    {q
                      ? `Results for "${q}"`
                      : currentCategory
                      ? `${currentCategory} Ads`
                      : 'Trending Ads'}
                  </h1>

                  <p className="text-sm text-muted-foreground mt-1">
                    {loading ? 'Loading...' : `${total} ads found`}
                  </p>
                </div>
                
                {/* SORT */}
                <div className="flex gap-2">
                  {[
                    { v: 'trending', l: 'Trending' },
                    { v: 'newest', l: 'Newest' },
                    { v: 'oldest', l: 'Oldest' },
                  ].map((s) => (
                    <button
                      key={s.v}
                      onClick={() =>
                        updateSearchParams({ sort: s.v })
                      }
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg border",
                        currentSort === s.v
                          ? "bg-brand-500 text-white"
                          : "bg-muted"
                      )}
                    >
                      {s.l}
                    </button>
                  ))}
                </div>
                
              </div>
            </div>

            {/* RESULTS */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-40 shimmer rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : data?.ads?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {data.ads.map((ad: any) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                No ads found matching your criteria.
              </div>
            )}

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">

                <button
                  onClick={() =>
                    updateSearchParams({
                      page: String(currentPage - 1),
                    })
                  }
                  disabled={currentPage <= 1}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 2), currentPage + 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        updateSearchParams({ page: String(p) })
                      }
                      className={cn(
                        "px-3 py-1 border rounded",
                        currentPage === p && "bg-brand-500 text-white"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  onClick={() =>
                    updateSearchParams({
                      page: String(currentPage + 1),
                    })
                  }
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}