import axios from 'axios';
import fs from 'fs';

/**
 * Downloads Facebook / Instagram / YouTube / TikTok media via Publer Extractor API
 */
export async function downloadWithPublerApi(url, outputPath) {
  console.log(`[Publer API] Attempting extraction for: ${url}`);

  try {
    const postRes = await axios.post('https://publer.io/api/v1/media/download', {
      url: url,
      iphone: false
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Origin': 'https://publer.io',
        'Referer': 'https://publer.io/tools/media-downloader'
      },
      timeout: 12000
    });

    const job = postRes.data;
    let jobData = job;

    // Poll job status if asynchronous
    if (job.job_id) {
      let attempts = 0;
      while (attempts < 10) {
        await new Promise(r => setTimeout(r, 1500));
        const statusRes = await axios.get(`https://publer.io/api/v1/job_status/${job.job_id}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
          }
        });
        if (statusRes.data.status === 'complete') {
          jobData = statusRes.data;
          break;
        }
        attempts++;
      }
    }

    // Extract stream URL
    let mediaUrl = null;
    if (jobData.payload && Array.isArray(jobData.payload) && jobData.payload[0]) {
      mediaUrl = jobData.payload[0].path || jobData.payload[0].url;
    } else if (jobData.url) {
      mediaUrl = jobData.url;
    }

    if (mediaUrl) {
      console.log(`[Publer API] Success! Direct stream obtained: ${mediaUrl.substring(0, 60)}...`);
      const fileRes = await axios.get(mediaUrl, { responseType: 'arraybuffer', timeout: 30000 });
      fs.writeFileSync(outputPath, Buffer.from(fileRes.data));
      return outputPath;
    }
  } catch (err) {
    console.warn(`[Publer API] Extraction failed: ${err.message}`);
  }

  return null;
}
