import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Generates Veo3/Sora Video Prompts AND Gemini/ChatGPT DALL-E Image Prompts
 */
export async function generateVeo3ChannelPrompts({
  analysisData,
  newScriptText,
  apiKey,
  provider = 'gemini'
}) {
  const prompt = `
Bạn là Chuyên gia Prompt Engineering số 1 thế giới dành cho các AI Generator hàng đầu như Google Gemini Imagen 3, ChatGPT DALL-E 3, Midjourney, Google Veo 3, và OpenAI Sora.

DƯỚI ĐÂY LÀ PHÂN TÍCH PHONG CÁCH KÊNH (MASTER STYLE):
- Thể loại Visual: ${analysisData.videoAnalysis?.visualFormat || 'Cinematic AI Motion'}
- Phong cách chuyển động Camera: ${analysisData.videoAnalysis?.motionType || 'Cinematic Motion'}
- Tông màu & Ánh sáng: ${analysisData.visualStyleAnalysis?.colorGrading || 'Dark Moody'}
- Master Visual Style Prompt: ${analysisData.visualStyleAnalysis?.masterStylePrompt || '8k cinematic, hyperrealistic'}

DƯỚI ĐÂY LÀ KỊCH BẢN MỚI CẦN TẠO PROMPT HÌNH ẢNH & VIDEO:
\`\`\`
${newScriptText}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy chia kịch bản thành từng CẢNH HÌNH ẢNH (Scenes) ngắn 3s - 5s - 10s. 
Với MỖI CẢNH, hãy tạo ra 3 BỘ PROMPT TIẾNG ANH CHUYÊN NGHIỆP:
1. **Gemini / Imagen 3 Prompt**: Tối ưu chuẩn tạo ảnh siêu nét 8K, độ phân giải cực cao trên Google Gemini.
2. **ChatGPT / DALL-E 3 Prompt**: Tối ưu chuẩn tạo ảnh nghệ thuật giàu chi tiết trên ChatGPT (DALL-E 3).
3. **Veo3 / Sora Video Prompt**: Tối ưu tạo video chuyển động điện ảnh 24fps (Cinematic motion, camera movement).

Trả về kết quả chuẩn định dạng JSON theo cấu trúc sau (không chứa bất kỳ văn bản thừa nào ngoài JSON):
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
      "geminiImagePrompt": "Full English Prompt cho Google Gemini Imagen 3: Highly detailed 8k photorealistic image of [subject], [environment & lighting], cinematic style, ratio 9:16, --no text watermark",
      "chatgptImagePrompt": "Full English Prompt cho ChatGPT DALL-E 3: Create a cinematic 9:16 vertical image showing [subject] in [setting], dramatic lighting, hyper-realistic 8k resolution, vivid details, no text overlay",
      "veo3VideoPrompt": "Full English Prompt cho Veo3/Sora Video: [Subject], [action and movement], [cinematic camera movement e.g. slow pan, tracking shot], [environment & lighting], 8k render, 24fps",
      "negativePrompt": "blurry, low quality, deformed, text watermark, ugly"
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
