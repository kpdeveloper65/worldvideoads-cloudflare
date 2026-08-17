import { NextResponse } from 'next/server';
import { searchYouTube } from '@/lib/youtube';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const maxResults = Math.min(parseInt(searchParams.get('limit') || '12'), 24);
  const pageToken = searchParams.get('pageToken') || undefined;

  if (!q) {
    return NextResponse.json({ videos: [], totalResults: 0, error: 'Query required' });
  }

  try {
    // Check cache (include pageToken in the hash if pagination is used to prevent stale page results)
    const rawHashString = `${q.toLowerCase().trim()}_${maxResults}_${pageToken || 'first'}`;
    const queryHash = Buffer.from(rawHashString).toString('base64');
    
    const cached = await prisma.youTubeCache.findUnique({
      where: { queryHash },
    });

    if (cached && cached.expiresAt > new Date()) {
      return NextResponse.json({
        ...(cached.results as any),
        cached: true,
      });
    }

    // Fetch from YouTube
    const result = await searchYouTube(q, { maxResults, pageToken });

    // Cache the result
    const cacheHours = 6;
    const expiresAt = new Date(Date.now() + cacheHours * 3600 * 1000);

    await prisma.youTubeCache.upsert({
      where: { queryHash },
      create: {
        query: q,
        queryHash,
        results: result as any,
        resultCount: result.videos.length,
        expiresAt,
      },
      update: {
        results: result as any,
        resultCount: result.videos.length,
        cachedAt: new Date(),
        expiresAt,
      },
    });

    // Store candidates for admin review (only non-duplicates)
    if (result.videos.length > 0) {
      for (const video of result.videos.slice(0, 5)) {
        const existing = await prisma.youTubeCandidate.findUnique({
          where: { videoId: video.id },
        });

        if (!existing) {
          // Check for possible duplicates in internal DB
          const possibleDuplicate = await prisma.ad.findFirst({
            where: {
              AND: [
                { status: 'PUBLISHED' },
                {
                  OR: [
                    { externalVideoId: video.id },
                    { title: { contains: video.title.slice(0, 30), mode: 'insensitive' } },
                  ],
                },
              ],
            },
          });

          await prisma.youTubeCandidate.create({
            data: {
              videoId: video.id,
              title: video.title,
              channelName: video.channelTitle,
              channelId: video.channelId,
              description: video.description,
              thumbnailUrl: video.thumbnailUrl,
              publishedAt: video.publishedAt ? new Date(video.publishedAt) : null,
              durationSeconds: video.durationSeconds,
              viewCount: BigInt(video.viewCount || 0),
              rawData: video as any,
              status: 'CANDIDATE',
              possibleDuplicateId: possibleDuplicate?.id,
              duplicateScore: possibleDuplicate ? 0.8 : undefined,
            },
          }).catch(() => {}); // Ignore duplicate insert errors
        }
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('YouTube search API error:', error);
    return NextResponse.json(
      { videos: [], totalResults: 0, error: 'YouTube search failed' },
      { status: 500 }
    );
  }
}