import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Analyzes competitor video content and visual style
 */
export async function analyzeCompetitorVideo({
  transcript,
  apiKey,
  provider = 'gemini'
}) {
  const prompt = `
Bạn là một Đạo diễn Điện ảnh & Chuyên gia Phân tích Content Video Ngắn (TikTok/Reels/Shorts/YouTube) hàng đầu.

Dưới đây là LỜI THOẠI VÀ NỘI DUNG trích xuất từ video của đối thủ:
\`\`\`
${transcript}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy phân tích chuyên sâu video này về mặt NỘI DUNG, HÌNH ẢNH và CHUYỂN ĐỘNG (Visual & Motion Type), sau đó đúc kết phong cách để xây dựng một kênh mới nhất quán.

Hãy trả về kết quả định dạng JSON chuẩn xác theo cấu trúc sau (không kèm văn bản thừa ngoài JSON):
{
  "visualFormat": "Ảnh tĩnh ghép chuyển động / Video AI Motion chuyển động / AI Avatar nói chuyện / Footage điện ảnh B-Roll",
  "motionType": "Góc quay tĩnh / Zoom in - Zoom out dồn dập / Camera Pan ngang / Cinematic Motion 3D / Slow motion",
  "pacing": "Nhanh dồn dập (1-2s đổi cảnh) / Trung bình (3-4s đổi cảnh) / Chậm lắng đọng",
  "colorAndLighting": "Tông màu tối bí ẩn (Dark Moody) / Rực rỡ hiện đại (Vibrant Modern) / Cổ điển Cinematic / Tối giản (Minimalist)",
  "contentHookType": "Gây tò mò bí ẩn / Đặt câu hỏi nhức nhối / Tình huống Drama / Thách thức suy nghĩ",
  "targetAudience": "Đối tượng khán giả phù hợp nhất",
  "channelThemeSuggestion": "Gợi ý Tên & Chủ đề Kênh độc đáo dựa trên phong cách đối thủ",
  "masterStylePrompt": "Một đoạn Prompt Tiếng Anh (Master Visual Prompt) mô tả nhân vật, bối cảnh, tông màu, độ phân giải 8k hyperrealistic, nhất quán 100% để dùng chung cho mọi video trên kênh",
  "videoStructureAnalysis": "Tóm tắt cấu trúc cách đối thủ giữ chân người xem từ đầu đến cuối"
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
