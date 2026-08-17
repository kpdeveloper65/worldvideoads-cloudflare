import { NextResponse } from 'next/server';
import { searchAds, logSearch } from '@/lib/search';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
  const sort = (searchParams.get('sort') as any) || 'relevance';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
  const source = searchParams.get('source') || undefined;
  const minDuration = searchParams.get('minDuration') ? parseInt(searchParams.get('minDuration')!) : undefined;
  const maxDuration = searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration')!) : undefined;
  const tag = searchParams.get('tag') || undefined;

  try {
    // 1. Fetch main search results using your helper function
    const result = await searchAds({
      query,
      category,
      brand,
      year,
      sort,
      page,
      limit,
      sourceType: source,
      minDuration,
      maxDuration,
      tags: tag ? [tag] : undefined,
    });

    let categories: any[] = [];
    let brands: any[] = [];

    // 2. Fetch sidebar facets safely for SQLite (removed invalid 'mode: insensitive')
    if (query) {
      categories = await prisma.category.findMany({
        where: {
          isActive: true,
          ads: {
            some: {
              title: { contains: query }, // SQLite safe check
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 30,
      });

      brands = await prisma.brand.findMany({
        where: {
          isActive: true,
          ads: {
            some: {
              title: { contains: query }, // SQLite safe check
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 15,
      });
    } else {
      categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        take: 50,
      });

      brands = await prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        take: 20,
      });
    }

    // 3. Log search asynchronously
    if (query) {
      getServerSession(authOptions)
        .then((session) => {
          logSearch(query, result?.total || 0, 'internal', session?.user?.id).catch(console.error);
        })
        .catch(() => {
          logSearch(query, result?.total || 0, 'internal').catch(console.error);
        });
    }

    return NextResponse.json({
      ads: result?.ads || [],
      total: result?.total || 0,
      totalPages: result?.totalPages || 1,
      categories,
      brands,
    });
  } catch (error) {
    console.error('Search API error details:', error);
    return NextResponse.json({ error: 'Search failed', details: String(error) }, { status: 500 });
  }
}