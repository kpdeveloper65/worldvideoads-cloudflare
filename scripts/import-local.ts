#!/usr/bin/env tsx
/**
 * Prisma Native Client Local Import Script
 * Automatically uses Prisma Client models to safely import users, categories, and videos.
 *
 * Usage:
 *   npx tsx scripts/import-local.ts
 */

import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseDuration(durationStr: any): number {
  if (!durationStr || typeof durationStr !== 'string') return 0;
  const parts = durationStr.split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parseInt(durationStr, 10) || 0;
}

function extractUrlFromIframe(htmlString: string): string | null {
  if (!htmlString || typeof htmlString !== 'string') return null;
  const match = htmlString.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function readCsv(filePath: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.toLowerCase().trim().replace(/\s+/g, '_') }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function main() {
  const langsPath = path.join(process.cwd(), 'data', 'langs.csv');
  const videosPath = path.join(process.cwd(), 'data', 'videos.csv');

  if (!fs.existsSync(langsPath) || !fs.existsSync(videosPath)) {
    console.error('❌ Error: Data files missing at ./data/langs.csv or ./data/videos.csv');
    process.exit(1);
  }

  console.log('📖 Indexing language/category maps...');
  const langRows = await readCsv(langsPath);
  const categoryLookupMap = new Map<string, string>();

  for (const row of langRows) {
    const name = (row.english || row.name || '').trim();
    if (!name) continue;
    if (row.lang_key) categoryLookupMap.set(String(row.lang_key).trim(), name);
    if (row.id) categoryLookupMap.set(String(row.id).trim(), name);
  }

  // --- 1. ADMIN USER & DEFAULT CATEGORY ---
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@worldvideoads.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const generalCatId = 'cat-general';

  console.log('🚀 Initializing Admin User & Default Category...');

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: 'admin-user-id',
      email: adminEmail,
      name: 'Admin',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  await prisma.category.upsert({
    where: { id: generalCatId },
    update: {},
    create: {
      id: generalCatId,
      name: 'General',
      slug: 'general',
      isActive: true,
      adCount: 0,
    },
  });

  console.log('✅ Setup initialized.');

  const categoryDbIdMap = new Map<string, string>();
  categoryDbIdMap.set('default', generalCatId);

  // --- 2. VIDEO PROCESSING ---
  console.log('🎬 Reading videos.csv and importing records...');
  const videoRows = await readCsv(videosPath);
  console.log(`📋 Total CSV records loaded: ${videoRows.length}`);

  let totalImported = 0;

  for (let i = 0; i < videoRows.length; i++) {
    const row = videoRows[i];
    let videoSlug = slugify(row.title);
    if (!videoSlug) videoSlug = `video-${row.video_id || Date.now()}-${i + 1}`;

    let videoUrl = '';
    let embedUrl = '';
    let sourcePlatform = 'internal';

    const adsoftheworldValue = String(row.adsoftheworld || '').trim();
    const ytRawValue = String(row.youtube || '').trim();
    const vimRawValue = String(row.vimeo || '').trim();
    const cleanVideoLocation = String(row.video_location || row.video || '').trim();

    if (adsoftheworldValue && adsoftheworldValue.includes('<iframe')) {
      const extractedSrc = extractUrlFromIframe(adsoftheworldValue);
      if (extractedSrc) {
        embedUrl = extractedSrc;
        videoUrl = extractedSrc;
        if (extractedSrc.includes('youtube.com') || extractedSrc.includes('youtu.be')) {
          sourcePlatform = 'youtube';
        } else if (extractedSrc.includes('vimeo.com')) {
          sourcePlatform = 'vimeo';
        } else {
          sourcePlatform = 'external';
        }
      }
    }

    if (!embedUrl && ytRawValue && ytRawValue !== '\\N' && ytRawValue !== '0' && ytRawValue !== 'NULL') {
      const id = ytRawValue.includes('v=') ? ytRawValue.split('v=')[1].split('&')[0] : ytRawValue.split('/').pop();
      videoUrl = `https://www.youtube.com/watch?v=${id}`;
      embedUrl = `https://www.youtube.com/embed/${id}`;
      sourcePlatform = 'youtube';
    } else if (!embedUrl && vimRawValue && vimRawValue !== '\\N' && vimRawValue !== '0' && vimRawValue !== 'NULL') {
      const id = vimRawValue.split('/').pop();
      videoUrl = `https://vimeo.com/${id}`;
      embedUrl = `https://player.vimeo.com/video/${id}`;
      sourcePlatform = 'vimeo';
    } else if (!embedUrl && cleanVideoLocation && cleanVideoLocation !== '\\N' && cleanVideoLocation !== 'NULL') {
      if (cleanVideoLocation.startsWith('http://') || cleanVideoLocation.startsWith('https://')) {
        videoUrl = cleanVideoLocation;
        embedUrl = cleanVideoLocation;
      } else {
        const cleanPath = cleanVideoLocation.startsWith('/') ? cleanVideoLocation : `/${cleanVideoLocation}`;
        videoUrl = cleanPath;
        embedUrl = cleanPath;
      }
      sourcePlatform = 'internal';
    }

    const rawCategoryId = String(row.category_id || '').trim();
    let assignedCategoryId = categoryDbIdMap.get(rawCategoryId);

    if (!assignedCategoryId && rawCategoryId !== '' && rawCategoryId !== '0') {
      const targetName = categoryLookupMap.get(rawCategoryId) || `Category ${rawCategoryId}`;
      const baseSlug = slugify(targetName);
      assignedCategoryId = `cat-${baseSlug}`;

      await prisma.category.upsert({
        where: { id: assignedCategoryId },
        update: {},
        create: {
          id: assignedCategoryId,
          name: targetName,
          slug: baseSlug,
          isActive: true,
          adCount: 0,
        },
      }).catch(() => {});

      categoryDbIdMap.set(rawCategoryId, assignedCategoryId);
    }

    if (!assignedCategoryId) assignedCategoryId = generalCatId;

    const recordId = row.id ? String(row.id) : `ad-${i + 1}`;
    const title = String(row.title || 'Untitled Video').slice(0, 190);
    const descShort = String((row.description || '').replace(/<[^>]*>/g, '')).slice(0, 240);
    const descLong = String(row.description || '');
    const thumb = String(row.thumbnail || '');
    const durationSec = parseDuration(row.duration);
    const views = parseInt(row.views, 10) || 0;
    const extId = String(ytRawValue || vimRawValue || row.video_id || '');
    const country = String(row.country || '');

    try {
      await prisma.ad.upsert({
        where: { id: recordId },
        update: {},
        create: {
          id: recordId,
          title,
          slug: videoSlug,
          descriptionShort: descShort,
          descriptionLong: descLong,
          thumbnailUrl: thumb,
          videoUrl,
          embedUrl,
          duration: durationSec,
          viewCount: views,
          status: 'PUBLISHED',
          sourceType: 'IMPORTED',
          sourcePlatform,
          externalVideoId: extId,
          country,
          originalId: recordId,
          categoryId: assignedCategoryId,
        },
      });
      totalImported++;
    } catch (err) {
      // Handle slug or unique conflicts safely if any
    }

    if ((i + 1) % 500 === 0 || i === videoRows.length - 1) {
      console.log(`⏳ Progress: ${totalImported} / ${videoRows.length} imported...`);
    }
  }

  console.log(`\n🎉 Process Complete! Successfully imported Admin, Categories, and ${totalImported} ads into local dev.db!`);
}

main()
  .catch((err) => {
    console.error('❌ Import failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });