import axios from 'axios';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadWithPublerApi } from './facebookPubler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Pure JavaScript Media Downloader for Vercel / Cloud Serverless Environments
 */
export async function downloadMediaPureJs(url) {
  const cleanUrl = url.trim();
  console.log(`[PureJS Downloader] Extracting media from: ${cleanUrl}`);

  const timestamp = Date.now();
  const filePath = path.join(UPLOADS_DIR, `media_${timestamp}.mp4`);

  // 1. Check if Facebook Video / Reel
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch') || cleanUrl.includes('fb.gg')) {
    return await downloadFacebookPureJs(cleanUrl, filePath);
  }

  // 2. Check if TikTok Video
  if (cleanUrl.includes('tiktok.com')) {
    return await downloadTikTokPureJs(cleanUrl, filePath);
  }

  // 3. Check if YouTube Video
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return await downloadYouTubePureJs(cleanUrl, filePath);
  }

  // 4. Universal Fallback: Publer API
  const file = await downloadWithPublerApi(cleanUrl, filePath);
  if (file) return file;

  throw new Error('Không thể tải media từ URL này.');
}

/**
 * Facebook Video Extractor using Publer API & Scraping
 */
async function downloadFacebookPureJs(url, outputPath) {
  console.log('[PureJS Downloader] Attempting Facebook extraction via Publer API...');

  // Method 1: Publer Extractor API (Supports FB Reels, Shorts, Videos)
  try {
    const publerFile = await downloadWithPublerApi(url, outputPath);
    if (publerFile) return publerFile;
  } catch (err) {
    console.warn('[PureJS Downloader] Publer API failed:', err.message);
  }

  // Method 2: Scraping OpenGraph HTML tags
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
      },
      timeout: 10000
    });

    const html = response.data;
    let videoUrl = null;

    const matches = [
      /property="og:video" content="([^"]+)"/i,
      /property="og:video:secure_url" content="([^"]+)"/i,
      /"browser_native_hd_url":"([^"]+)"/i,
      /"browser_native_sd_url":"([^"]+)"/i,
      /"playable_url":"([^"]+)"/i,
      /"sd_src":"([^"]+)"/i,
      /"hd_src":"([^"]+)"/i
    ];

    for (const regex of matches) {
      const match = html.match(regex);
      if (match && match[1]) {
        videoUrl = match[1].replace(/\\/g, '').replace(/&amp;/g, '&');
        break;
      }
    }

    if (videoUrl) {
      console.log(`[PureJS Downloader] Found Facebook direct stream: ${videoUrl.substring(0, 60)}...`);
      const streamRes = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 30000 });
      fs.writeFileSync(outputPath, Buffer.from(streamRes.data));
      return outputPath;
    }
  } catch (err) {
    console.warn('[PureJS Downloader] Facebook direct scrape failed:', err.message);
  }

  throw new Error('Không thể tự động tải video Facebook này do Facebook yêu cầu đăng nhập tài khoản. Vui lòng kéo thả file video/audio từ thiết bị lên ô "Tải File Trực Tiếp"!');
}

/**
 * TikTok Extractor using Tikwm API & Publer
 */
async function downloadTikTokPureJs(url, outputPath) {
  console.log('[PureJS Downloader] Attempting TikTok extraction via Tikwm API...');
  try {
    const res = await axios.post('https://www.tikwm.com/api/', { url: url, count: 12, cursor: 0, web: 1 });
    if (res.data && res.data.data && res.data.data.play) {
      const videoUrl = 'https://www.tikwm.com' + res.data.data.play;
      const streamRes = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 30000 });
      fs.writeFileSync(outputPath, Buffer.from(streamRes.data));
      return outputPath;
    }
  } catch (e) {
    console.warn('[PureJS Downloader] TikTok Tikwm failed, trying Publer API...');
  }

  const file = await downloadWithPublerApi(url, outputPath);
  if (file) return file;
  throw new Error('Tải TikTok thất bại.');
}

/**
 * YouTube Extractor using @distube/ytdl-core & Publer
 */
async function downloadYouTubePureJs(url, outputPath) {
  console.log('[PureJS Downloader] Attempting YouTube extraction via ytdl-core...');
  try {
    const info = await ytdl.getInfo(url);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const format = audioFormats[0] || info.formats[0];

    if (format && format.url) {
      const streamRes = await axios.get(format.url, { responseType: 'arraybuffer', timeout: 30000 });
      fs.writeFileSync(outputPath, Buffer.from(streamRes.data));
      return outputPath;
    }
  } catch (e) {
    console.warn('[PureJS Downloader] ytdl-core failed, trying Publer API:', e.message);
  }

  const file = await downloadWithPublerApi(url, outputPath);
  if (file) return file;
  throw new Error('Tải YouTube thất bại.');
}
