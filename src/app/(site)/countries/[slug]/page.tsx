import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { AdGrid } from '@/components/ads/AdGrid';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

const PAGE_SIZE = 20;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
  });
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Ads — TivoAds`,
    description: category.description || `Browse the best ${category.name} advertisements on TivoAds. Find TV and video ads from top ${category.name} brands.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const page = parseInt(resolvedSearch.page || '1');
  const sort = resolvedSearch.sort || 'newest';

  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!category) notFound();

  const skip = (page - 1) * PAGE_SIZE;

  const orderByMap: any = {
    newest: [{ publishDate: 'desc' }, { createdAt: 'desc' }],
    oldest: [{ publishDate: 'asc' }, { createdAt: 'asc' }],
    views: [{ viewCount: 'desc' }],
    trending: [{ trendingScore: 'desc' }],
  };

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({
      where: { categoryId: category.id, status: 'PUBLISHED' },
      orderBy: orderByMap[sort] || orderByMap.newest,
      skip,
      take: PAGE_SIZE,
      include: {
        brand: { select: { name: true, slug: true, logoUrl: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
    }),
    prisma.ad.count({ where: { categoryId: category.id, status: 'PUBLISHED' } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="py-12 px-4"
        style={{
          background: `linear-gradient(135deg, ${category.color || '#f97316'}15 0%, transparent 100%)`,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="section-container">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl text-3xl flex-shrink-0"
              style={{ backgroundColor: `${category.color || '#f97316'}20` }}
            >
              {category.icon || '📁'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link href="/countries" className="hover:text-foreground transition-colors">Countries</Link>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
              </div>
              <h1 className="heading-2 text-foreground">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                <strong>{total.toLocaleString()}</strong> ads
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} result{total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <div className="flex gap-1">
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'views', label: 'Most Viewed' },
                { value: 'trending', label: 'Trending' },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={`/categories/${resolvedParams.slug}?sort=${opt.value}`}
                  className={`btn btn-sm ${sort === opt.value ? 'btn-primary' : 'btn-outline'}`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <AdGrid ads={ads} columns={4} emptyMessage={`No ads found in ${category.name} yet.`} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {page > 1 && (
              <Link href={`/categories/${resolvedParams.slug}?page=${page - 1}&sort=${sort}`} className="btn btn-outline btn-md">
                ← Previous
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/categories/${resolvedParams.slug}?page=${page + 1}&sort=${sort}`} className="btn btn-outline btn-md">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}