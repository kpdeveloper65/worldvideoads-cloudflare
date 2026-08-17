import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResultsClient } from './SearchResultsClient';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    year?: string;
    sort?: string;
    page?: string;
    source?: string;
    minDuration?: string;
    maxDuration?: string;
    tag?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const title = q
    ? `"${q}" — Ad Search Results`
    : 'Search Ads — TivoAds';
  const description = q
    ? `Search results for "${q}" on TivoAds. Browse ads from our curated database and YouTube discovery.`
    : 'Search the TivoAds database. Find ads by brand, category, campaign, slogan, or keyword.';

  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  
  return (
    <Suspense fallback={<SearchLoadingState />}>
      <SearchResultsClient searchParams={resolvedParams} />
    </Suspense>
  );
}

function SearchLoadingState() {
  return (
    <div className="section-container py-8">
      <div className="h-8 w-64 shimmer rounded-lg mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden">
            <div className="aspect-video shimmer" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 shimmer rounded" />
              <div className="h-4 w-full shimmer rounded" />
              <div className="h-4 w-3/4 shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}