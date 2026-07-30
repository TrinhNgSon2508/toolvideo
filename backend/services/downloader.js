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
 * Downloads audio/video from URL using yt-dlp via python
 * @param {string} url - Facebook, YouTube, TikTok, etc. URL
 * @returns {Promise<string>} - Absolute path to extracted audio file
 */
export async function downloadMediaFromUrl(url) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputTemplate = path.join(UPLOADS_DIR, `media_${timestamp}.%(ext)s`);

    // Run python -m yt_dlp to download best audio/video format
    const args = [
      '-m', 'yt_dlp',
      '-x', // Extract audio
      '--audio-format', 'mp3',
      '--audio-quality', '0',
      '--no-playlist',
      '--max-filesize', '100M',
      '-o', outputTemplate,
      url
    ];

    console.log(`[Downloader] Starting download from URL: ${url}`);
    
    // Spawn python process
    const process = spawn('python', args);

    let stdoutData = '';
    let stderrData = '';

    process.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    process.on('close', (code) => {
      console.log(`[Downloader] yt-dlp exited with code ${code}`);
      
      // Look for the created file in uploads folder
      const expectedFile = path.join(UPLOADS_DIR, `media_${timestamp}.mp3`);
      
      if (fs.existsSync(expectedFile)) {
        return resolve(expectedFile);
      }

      // Check if any file starting with media_${timestamp} exists
      const files = fs.readdirSync(UPLOADS_DIR);
      const match = files.find(f => f.startsWith(`media_${timestamp}`));
      if (match) {
        return resolve(path.join(UPLOADS_DIR, match));
      }

      // Fallback: If audio extraction failed, try downloading normal video format
      console.warn(`[Downloader] Audio fallback: Trying standard video download...`);
      downloadFallbackVideo(url, timestamp).then(resolve).catch((err) => {
        reject(new Error(`Không thể tải video/audio từ đường dẫn này. Vui lòng kiểm tra lại link (FB/YT/TikTok) hoặc tải file trực tiếp!\nChi tiết: ${stderrData || stdoutData}`));
      });
    });

    process.on('error', (err) => {
      reject(new Error(`Lỗi chạy Python yt-dlp: ${err.message}`));
    });
  });
}

function downloadFallbackVideo(url, timestamp) {
  return new Promise((resolve, reject) => {
    const outputTemplate = path.join(UPLOADS_DIR, `media_${timestamp}.%(ext)s`);
    const args = [
      '-m', 'yt_dlp',
      '-f', 'b[filesize<50M]/b',
      '--no-playlist',
      '-o', outputTemplate,
      url
    ];

    const process = spawn('python', args);

    process.on('close', (code) => {
      const files = fs.readdirSync(UPLOADS_DIR);
      const match = files.find(f => f.startsWith(`media_${timestamp}`));
      if (match) {
        resolve(path.join(UPLOADS_DIR, match));
      } else {
        reject(new Error('Tải video thất bại.'));
      }
    });

    process.on('error', reject);
  });
}
