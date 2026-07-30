import { downloadMediaPureJs } from './pureJsDownloader.js';

/**
 * Downloads audio/video from URL using Pure JS with Zero Python dependency
 * @param {string} url - Target video URL
 * @returns {Promise<string>} - Path to downloaded file
 */
export async function downloadMediaFromUrl(url) {
  return await downloadMediaPureJs(url);
}
