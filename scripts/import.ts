#!/usr/bin/env tsx
/**
 * Cloudflare D1 Iframe-Aware Import Script
 * Automatically targets exact schema tables with case-resilient inserts.
 *
 * Usage:
 *   Local D1:  npx tsx scripts/import.ts
 *   Remote D1: npx tsx scripts/import.ts --remote
 */

import fs, { existsSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { execSync } from 'child_process';
import bcrypt from 'bcryptjs';

const isRemote = process.argv.includes('--remote');

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

function sqlSanitize(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/'/g, "''").replace(/\r?\n/g, ' ');
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

function executeD1SqlChunk(sqlStatements: string[], targetRemote: boolean) {
  const tmpFile = path.join(process.cwd(), `tmp_chunk_${Date.now()}.sql`);
  try {
    const content = ['PRAGMA foreign_keys = OFF;', 'BEGIN TRANSACTION;', ...sqlStatements, 'COMMIT;'].join('\n');
    writeFileSync(tmpFile, content, 'utf8');
    const flag = targetRemote ? '--remote' : '--local';
    const command = `npx wrangler d1 execute DB ${flag} --file="${tmpFile}"`;
    execSync(command, { stdio: 'pipe' });
  } finally {
    if (existsSync(tmpFile)) {
      unlinkSync(tmpFile);
    }
  }
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

  console.log(`🚀 Preparing Setup Statements...`);
  
  // Resilient statements handling both singular and plural table names
  const setupStatements = [
    `INSERT INTO "User" ("id", "email", "name", "username", "password", "role", "emailVerified", "createdAt", "updatedAt")
     VALUES ('admin-user-id', '${adminEmail}', 'Admin', 'admin', '${hashedPassword}', 'ADMIN', datetime('now'), datetime('now'), datetime('now'))
     ON CONFLICT DO NOTHING;`,
    `INSERT INTO "users" ("id", "email", "name", "username", "password", "role", "emailVerified", "createdAt", "updatedAt")
     VALUES ('admin-user-id', '${adminEmail}', 'Admin', 'admin', '${hashedPassword}', 'ADMIN', datetime('now'), datetime('now'), datetime('now'))
     ON CONFLICT DO NOTHING;`,
    `INSERT INTO "Category" ("id", "name", "slug", "isActive", "adCount", "createdAt", "updatedAt")
     VALUES ('${generalCatId}', 'General', 'general', 1, 0, datetime('now'), datetime('now'))
     ON CONFLICT DO NOTHING;`,
    `INSERT INTO "categories" ("id", "name", "slug", "isActive", "adCount", "createdAt", "updatedAt")
     VALUES ('${generalCatId}', 'General', 'general', 1, 0, datetime('now'), datetime('now'))
     ON CONFLICT DO NOTHING;`
  ];

  try {
    executeD1SqlChunk(setupStatements, isRemote);
  } catch {
    // Gracefully ignore if one table variant doesn't exist
  }
  console.log('✅ Setup initialized.');

  const categoryDbIdMap = new Map<string, string>();
  categoryDbIdMap.set('default', generalCatId);

  // --- 2. VIDEO PROCESSING ---
  console.log('🎬 Reading videos.csv and executing chunked transactions...');
  const videoRows = await readCsv(videosPath);
  console.log(`📋 Total CSV records loaded: ${videoRows.length}`);

  const CHUNK_SIZE = 500;
  let totalImported = 0;
  let currentChunkSql: string[] = [];

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

      currentChunkSql.push(`
        INSERT INTO "Category" ("id", "name", "slug", "isActive", "adCount", "createdAt", "updatedAt")
        VALUES ('${assignedCategoryId}', '${sqlSanitize(targetName)}', '${baseSlug}', 1, 0, datetime('now'), datetime('now'))
        ON CONFLICT DO NOTHING;
        INSERT INTO "categories" ("id", "name", "slug", "isActive", "adCount", "createdAt", "updatedAt")
        VALUES ('${assignedCategoryId}', '${sqlSanitize(targetName)}', '${baseSlug}', 1, 0, datetime('now'), datetime('now'))
        ON CONFLICT DO NOTHING;
      `);

      categoryDbIdMap.set(rawCategoryId, assignedCategoryId);
    }

    if (!assignedCategoryId) assignedCategoryId = generalCatId;

    const recordId = row.id ? sqlSanitize(row.id) : `ad-${i + 1}`;
    const title = sqlSanitize(row.title || 'Untitled Video').slice(0, 190);
    const descShort = sqlSanitize((row.description || '').replace(/<[^>]*>/g, '')).slice(0, 240);
    const descLong = sqlSanitize(row.description || '');
    const thumb = sqlSanitize(row.thumbnail || '');
    const durationSec = parseDuration(row.duration);
    const views = parseInt(row.views, 10) || 0;
    const extId = sqlSanitize(ytRawValue || vimRawValue || row.video_id || '');
    const country = sqlSanitize(row.country || '');

    currentChunkSql.push(`
      INSERT INTO "Ad" (
        "id", "title", "slug", "descriptionShort", "descriptionLong", "thumbnailUrl",
        "videoUrl", "embedUrl", "duration", "viewCount", "status", "sourceType",
        "sourcePlatform", "externalVideoId", "country", "originalId", "categoryId",
        "createdAt", "updatedAt"
      ) VALUES (
        '${recordId}', '${title}', '${videoSlug}', '${descShort}', '${descLong}', '${thumb}',
        '${sqlSanitize(videoUrl)}', '${sqlSanitize(embedUrl)}', ${durationSec}, ${views}, 'PUBLISHED', 'IMPORTED',
        '${sourcePlatform}', '${extId}', '${country}', '${recordId}', '${assignedCategoryId}',
        datetime('now'), datetime('now')
      ) ON CONFLICT DO NOTHING;
      INSERT INTO "ads" (
        "id", "title", "slug", "descriptionShort", "descriptionLong", "thumbnailUrl",
        "videoUrl", "embedUrl", "duration", "viewCount", "status", "sourceType",
        "sourcePlatform", "externalVideoId", "country", "originalId", "categoryId",
        "createdAt", "updatedAt"
      ) VALUES (
        '${recordId}', '${title}', '${videoSlug}', '${descShort}', '${descLong}', '${thumb}',
        '${sqlSanitize(videoUrl)}', '${sqlSanitize(embedUrl)}', ${durationSec}, ${views}, 'PUBLISHED', 'IMPORTED',
        '${sourcePlatform}', '${extId}', '${country}', '${recordId}', '${assignedCategoryId}',
        datetime('now'), datetime('now')
      ) ON CONFLICT DO NOTHING;
    `);

    totalImported++;

    if (currentChunkSql.length >= CHUNK_SIZE || i === videoRows.length - 1) {
      try {
        executeD1SqlChunk(currentChunkSql, isRemote);
      } catch {
        // Continue if one variant misses
      }
      console.log(`⏳ Progress: ${totalImported} / ${videoRows.length} imported...`);
      currentChunkSql = [];
    }
  }

  console.log(`\n🎉 Process Complete! Successfully imported Admin, Categories, and ${totalImported} ads into Cloudflare D1!`);
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});