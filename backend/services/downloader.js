import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Downloads audio/video from URL (Facebook, YouTube, TikTok...) with 3-tier robust fallback
 * @param {string} url - Target video URL
 * @returns {Promise<string>} - Path to local audio/video file
 */
export async function downloadMediaFromUrl(url) {
  const cleanUrl = url.trim();
  console.log(`[Downloader] Request to download: ${cleanUrl}`);

  // Tier 1: Try yt-dlp with optimized flags (User-Agent & Referer for Facebook/TikTok)
  try {
    const file = await downloadWithYtDlp(cleanUrl);
    if (file && fs.existsSync(file)) return file;
  } catch (err) {
    console.warn(`[Downloader Tier 1 (yt-dlp)] Failed: ${err.message}. Trying Tier 2 (Facebook Direct Scraper)...`);
  }

  // Tier 2: Facebook / TikTok Direct OpenGraph Video Scraper Fallback
  try {
    const file = await downloadDirectScraper(cleanUrl);
    if (file && fs.existsSync(file)) return file;
  } catch (err) {
    console.warn(`[Downloader Tier 2 (Direct Scraper)] Failed: ${err.message}. Trying Tier 3 (Cobalt API)...`);
  }

  // Tier 3: Universal Cobalt Downloader Service Fallback
  try {
    const file = await downloadWithCobaltApi(cleanUrl);
    if (file && fs.existsSync(file)) return file;
  } catch (err) {
    console.warn(`[Downloader Tier 3 (Cobalt API)] Failed: ${err.message}`);
  }

  throw new Error(`Không thể tải video từ đường dẫn này (Facebook có thể đặt ở chế độ riêng tư hoặc yêu cầu đăng nhập).\n👉 Gợi ý: Bạn hãy tải trực tiếp file video/audio từ điện thoại/máy tính lên ô 'Tải File Trực Tiếp' nhé!`);
}

/**
 * Tier 1: yt-dlp python process with browser headers
 */
function downloadWithYtDlp(url) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputTemplate = path.join(UPLOADS_DIR, `media_${timestamp}.%(ext)s`);

    const args = [
      '-m', 'yt_dlp',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      '--referer', 'https://www.facebook.com/',
      '-x',
      '--audio-format', 'mp3',
      '--no-playlist',
      '--max-filesize', '100M',
      '-o', outputTemplate,
      url
    ];

    const proc = spawn('python', args);

    let stderrData = '';
    proc.stderr.on('data', d => stderrData += d.toString());

    proc.on('close', code => {
      const files = fs.readdirSync(UPLOADS_DIR);
      const match = files.find(f => f.startsWith(`media_${timestamp}`));
      if (match) {
        resolve(path.join(UPLOADS_DIR, match));
      } else {
        reject(new Error(stderrData || `yt-dlp exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

/**
 * Tier 2: Direct Scraper for Facebook Reels / Watch HTML OpenGraph Tags
 */
async function downloadDirectScraper(url) {
  if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
    throw new Error('Direct scraper only supports Facebook URLs');
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });

  const html = await response.text();

  // Search for og:video, browser_native_hd_url, sd_src
  let videoUrl = null;
  const ogVideoMatch = html.match(/property="og:video" content="([^"]+)"/i) || html.match(/"browser_native_hd_url":"([^"]+)"/i) || html.match(/"browser_native_sd_url":"([^"]+)"/i) || html.match(/"sd_src":"([^"]+)"/i);

  if (ogVideoMatch && ogVideoMatch[1]) {
    videoUrl = ogVideoMatch[1].replace(/\\/g, '').replace(/&amp;/g, '&');
  }

  if (!videoUrl) {
    throw new Error('Could not find direct Facebook video stream URL');
  }

  console.log(`[Facebook Scraper] Direct video URL extracted: ${videoUrl.substring(0, 80)}...`);

  // Download raw video stream
  const videoRes = await fetch(videoUrl);
  const buffer = await videoRes.arrayBuffer();
  const timestamp = Date.now();
  const filePath = path.join(UPLOADS_DIR, `media_${timestamp}.mp4`);

  fs.writeFileSync(filePath, Buffer.from(buffer));
  return filePath;
}

/**
 * Tier 3: Cobalt Open Downloader API Fallback
 */
async function downloadWithCobaltApi(url) {
  const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url,
      isAudioOnly: true
    })
  });

  const data = await cobaltRes.json();
  if (!cobaltRes.ok || (!data.url && !data.picker)) {
    throw new Error(data.text || 'Cobalt API cannot process this link');
  }

  const downloadUrl = data.url || (data.picker && data.picker[0] ? data.picker[0].url : null);
  if (!downloadUrl) throw new Error('No media stream returned from Cobalt API');

  const fileRes = await fetch(downloadUrl);
  const buffer = await fileRes.arrayBuffer();
  const timestamp = Date.now();
  const filePath = path.join(UPLOADS_DIR, `media_${timestamp}.mp3`);

  fs.writeFileSync(filePath, Buffer.from(buffer));
  return filePath;
}
