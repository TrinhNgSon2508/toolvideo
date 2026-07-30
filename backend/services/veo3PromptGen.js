import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Generates Veo3 / Sora prompts and consistent channel strategy
 */
export async function generateVeo3ChannelPrompts({
  analysisData,
  newScriptText,
  apiKey,
  provider = 'gemini'
}) {
  const prompt = `
Bạn là Chuyên gia Prompt Engineering số 1 thế giới dành cho các mô hình tạo Video AI tiên tiến nhất hiện nay như Google Veo 3, OpenAI Sora, Runway Gen-3.

DƯỚI ĐÂY LÀ PHÂN TÍCH PHONG CÁCH KÊNH (MASTER STYLE):
- Thể loại Visual: ${analysisData.visualFormat || 'Cinematic AI Motion'}
- Phong cách chuyển động Camera: ${analysisData.motionType || 'Cinematic Motion'}
- Tông màu & Ánh sáng: ${analysisData.colorAndLighting || 'Dark Moody'}
- Master Visual Style Prompt: ${analysisData.masterStylePrompt || '8k cinematic, hyperrealistic'}

DƯỚI ĐÂY LÀ KỊCH BẢN MỚI CẦN TẠO PROMPT VEO3:
\`\`\`
${newScriptText}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy chia kịch bản trên thành các CẢNH HÌNH ẢNH (Scenes) ngắn 3s - 5s - 10s. Với mỗi Cảnh, hãy viết bộ Prompt tiếng Anh cực kỳ chi tiết chuẩn định dạng Google Veo 3 / Sora để người dùng chỉ cần bấm nút Copy dán vào Veo3 tạo ra video động chuẩn nhất quán với phong cách kênh.

Trả về kết quả chuẩn định dạng JSON theo cấu trúc sau (không kèm văn bản thừa):
{
  "channelName": "Tên kênh gợi ý",
  "channelConcept": "Tóm tắt chủ đề kênh",
  "masterStylePrompt": "Prompt style tổng thể tiếng Anh giữ nhất quán mọi video",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "0:00 - 0:03",
      "voiceover": "Lời thoại phân đoạn",
      "visualDescriptionVi": "Mô tả hình ảnh bằng Tiếng Việt",
      "veo3Prompt": "Full English Prompt cho Veo3: [Subject description], [action and movement], [camera shot/movement e.g. cinematic tracking shot, slow pan], [environment & lighting], [art style e.g. photorealistic 8k, Unreal Engine 5 render, cinematic lighting], 24fps",
      "negativePrompt": "blurry, low quality, deformed, static image, text watermark"
    }
  ]
}
`;

  if (provider === 'groq') {
    if (!apiKey) throw new Error('Chưa nhập Groq API Key!');
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } else {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('Chưa nhập Gemini API Key!');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt + "\nTrả về duy nhất định dạng JSON.");
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  }
}
