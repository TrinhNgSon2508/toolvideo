import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { downloadMediaFromUrl } from './services/downloader.js';
import { transcribeAudioWithGemini } from './services/transcriber.js';
import { rewriteScriptWithGemini } from './services/rewriter.js';
import { transcribeAudioWithGroq, rewriteScriptWithGroq } from './services/groqService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload_' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Extract audio from video URL
app.post('/api/extract-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Đường dẫn video không hợp lệ!' });
    }
    const filePath = await downloadMediaFromUrl(url.trim());
    res.json({ success: true, filePath, fileName: path.basename(filePath) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload direct media file
app.post('/api/upload-file', upload.single('mediaFile'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không nhận được file tải lên!' });
    res.json({ success: true, filePath: req.file.path, fileName: req.file.originalname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transcribe audio using selected provider (groq | gemini)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { filePath, apiKey, provider = 'groq' } = req.body;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File media không tồn tại!' });
    }

    let transcriptText = '';

    if (provider === 'groq') {
      console.log(`[API /transcribe] Using Groq Whisper Provider...`);
      transcriptText = await transcribeAudioWithGroq(filePath, apiKey);
    } else {
      console.log(`[API /transcribe] Using Gemini Provider...`);
      transcriptText = await transcribeAudioWithGemini(filePath, apiKey);
    }

    // Cleanup local temp audio file
    try { fs.unlinkSync(filePath); } catch (e) {}

    res.json({ success: true, transcript: transcriptText });
  } catch (error) {
    console.error('[API /transcribe Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rewrite script using selected provider (groq | gemini)
app.post('/api/rewrite', async (req, res) => {
  try {
    const {
      originalTranscript,
      style,
      targetDuration,
      targetAudience,
      customPrompt,
      apiKey,
      provider = 'groq'
    } = req.body;

    if (!originalTranscript || originalTranscript.trim().length === 0) {
      return res.status(400).json({ error: 'Nội dung lời thoại gốc không được để trống!' });
    }

    let rewrittenScript = '';

    if (provider === 'groq') {
      console.log(`[API /rewrite] Using Groq Llama 3.3 Provider...`);
      rewrittenScript = await rewriteScriptWithGroq({
        originalTranscript,
        style,
        targetDuration,
        targetAudience,
        customPrompt,
        apiKey
      });
    } else {
      console.log(`[API /rewrite] Using Gemini Provider...`);
      rewrittenScript = await rewriteScriptWithGemini({
        originalTranscript,
        style,
        targetDuration,
        targetAudience,
        customPrompt,
        userApiKey: apiKey
      });
    }

    res.json({ success: true, rewrittenScript });
  } catch (error) {
    console.error('[API /rewrite Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`=================================================`);
});
