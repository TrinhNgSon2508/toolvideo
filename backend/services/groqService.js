import Groq from 'groq-sdk';
import fs from 'fs';

/**
 * Transcribe audio using Groq Whisper-large-v3 (100% free & ultra fast)
 */
export async function transcribeAudioWithGroq(filePath, apiKey) {
  if (!apiKey) {
    throw new Error('Vui lòng nhập Groq API Key! (Lấy miễn phí tại https://console.groq.com/keys)');
  }

  const groq = new Groq({ apiKey });

  console.log(`[Groq Transcriber] Sending audio to Groq Whisper: ${filePath}`);
  
  const fileStream = fs.createReadStream(filePath);

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-large-v3',
      language: 'vi', // Vietnamese
      response_format: 'verbose_json',
      timestamp_granularities: ['segment']
    });

    let rawText = transcription.text || '';
    let timestampedText = '';

    if (transcription.segments && Array.isArray(transcription.segments)) {
      timestampedText = transcription.segments.map(seg => {
        const startMin = Math.floor(seg.start / 60);
        const startSec = Math.floor(seg.start % 60);
        const timeStr = `[${startMin < 10 ? '0' + startMin : startMin}:${startSec < 10 ? '0' + startSec : startSec}]`;
        return `${timeStr} ${seg.text.trim()}`;
      }).join('\n');
    }

    return `---PHẦN 1: LỜI THOẠI HOÀN CHỈNH (RAW TRANSCRIPT)---\n${rawText}\n\n---PHẦN 2: LỜI THOẠI KÈM MỐC THỜI GIAN (TIMESTAMPED TRANSCRIPT)---\n${timestampedText || rawText}`;
  } catch (error) {
    throw new Error(`Lỗi Groq Whisper API: ${error.message}`);
  }
}

/**
 * Rewrite script using Groq Llama-3.3-70b (Ultra fast & high quality)
 */
export async function rewriteScriptWithGroq({
  originalTranscript,
  style = 'tiktok_viral',
  targetDuration = '60s',
  targetAudience = 'Khán giả đại chúng',
  customPrompt = '',
  apiKey
}) {
  if (!apiKey) {
    throw new Error('Vui lòng nhập Groq API Key!');
  }

  const groq = new Groq({ apiKey });

  const styleInstructions = {
    tiktok_viral: 'Tạo Hook 3s cực mạnh, nhịp điệu dồn dập chuẩn TikTok/Reels, CTA chốt đơn.',
    storytelling: 'Kể chuyện cảm xúc, giàu hình ảnh, bài học lắng đọng.',
    sales_aida: 'Mô hình bán hàng AIDA: Attention -> Interest -> Desire -> Action.',
    expert_educational: 'Phong cách chuyên gia, súc tích, 3 bài học thực chiến.',
    humor_genz: 'Bắt trend Gen-Z, hài hước, ngôn ngữ tự nhiên.',
    custom: 'Thực hiện chính xác theo yêu cầu riêng.'
  };

  const prompt = `
Bạn là một Đạo diễn Kịch bản Video & AI Content Creator chuyên nghiệp.

Dưới đây là LỜI THOẠI GỐC trích xuất từ video:
\`\`\`
${originalTranscript}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy "xào nấu" lại lời thoại gốc trên để tạo ra một KỊCH BẢN VIDEO MỚI hay hơn, lôi cuốn hơn bằng tiếng Việt.

CẤU HÌNH:
- Phong cách: ${style} (${styleInstructions[style] || ''})
- Thời lượng mục tiêu: ${targetDuration}
- Đối tượng xem: ${targetAudience}
${customPrompt ? `- Yêu cầu thêm: ${customPrompt}` : ''}

ĐỊNH DẠNG ĐẦU RA MONG MUỐN (Markdown):

# 🚀 KỊCH BẢN VIDEO MỚI (REWRITTEN SCRIPT)

## 📌 1. TIÊU ĐỀ VIDEO SUGGESTIONS (3 Tiêu đề giật gân)
- Title 1: ...
- Title 2: ...
- Title 3: ...

---

## 🎬 2. KỊCH BẢN CHI TIẾT (VOICEOVER & HÌNH ẢNH MINH HỌA)

| Phân đoạn | Thời lượng | Lời thoại đọc (Voiceover) | Gợi ý hình ảnh / Góc quay (Visuals) |
|---|---|---|---|
| **HOOK (Mở đầu)** | 0:00 - 0:03 | ... | ... |
| **THÂN BÀI** | 0:03 - 0:45 | ... | ... |
| **CTA (Kết bài)** | 0:45 - 1:00 | ... | ... |

---

## 📝 3. LỜI THOẠI ĐỌC LIÊN MẠCH (Dùng để thu âm trực tiếp)
(Nội dung sạch dùng thu âm).
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096
    });

    return completion.choices[0]?.message?.content || 'Không có phản hồi từ Groq AI.';
  } catch (error) {
    throw new Error(`Lỗi Groq AI Rewrite: ${error.message}`);
  }
}
