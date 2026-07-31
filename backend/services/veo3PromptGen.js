import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Generates image & video prompts strictly locked onto Competitor Visual DNA
 */
export async function generateVeo3ChannelPrompts({
  analysisData,
  newScriptText,
  apiKey,
  provider = 'gemini'
}) {
  const visualDNA = analysisData.visualDNA || {};
  const masterPrompt = analysisData.visualStyleAnalysis?.masterStylePrompt || '';

  const prompt = `
Bạn là Chuyên gia Prompt Engineering số 1 thế giới dành cho các AI Image & Video Generators như Google Gemini (Imagen 3), ChatGPT (DALL-E 3), Midjourney, Google Veo 3 và OpenAI Sora.

DƯỚI ĐÂY LÀ "VISUAL DNA" ĐÃ BÓC TÁCH TỪ VIDEO ĐỐI THỦ:
- Nhân vật / Chủ thể chính đối thủ: ${visualDNA.characterSubjectDetails || 'Nhân vật AI đặc trưng'}
- Bối cảnh & Không gian: ${visualDNA.environmentAndSetting || 'Bối cảnh hiện đại'}
- Tông màu & Ánh sáng: ${visualDNA.colorPaletteAndLighting || 'Cinematic Lighting'}
- Kiểu xếp khung hình: ${visualDNA.cameraFramingStyle || '9:16 Vertical shot'}
- Master Visual DNA Prompt: ${masterPrompt || '8k photorealistic cinematic'}

DƯỚI ĐÂY LÀ KỊCH BẢN MỚI CẦN TẠO PROMPT HÌNH ẢNH & VIDEO:
\`\`\`
${newScriptText}
\`\`\`

YÊU CẦU BẮT BUỘC KHẮC KHEN:
Mọi Prompt Tạo Ảnh (cho Gemini và ChatGPT) của TỪNG CẢNH PHẢI BÁM SÁT 100% VÀO "VISUAL DNA" CỦA ĐỐI THỦ BÊN TRÊN! 
Cụ thể: Phải kế thừa đúng nhân vật/vật thể, kiểu trang phục, bối cảnh không gian và tông màu ánh sáng của đối thủ để các ảnh sinh ra GIỐNG HỆT NHƯ CÙNG MỘT VIDEO CỦA ĐỐI THỦ nhưng được nâng cấp đẹp sắc nét hơn.

Trả về kết quả chuẩn định dạng JSON theo cấu trúc sau (không chứa văn bản thừa):

{
  "channelName": "Tên kênh gợi ý",
  "channelConcept": "Tóm tắt chủ đề kênh",
  "masterStylePrompt": "Prompt style tổng thể tiếng Anh giữ nhất quán mọi video",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "0:00 - 0:03",
      "voiceover": "Lời thoại phân đoạn",
      "visualDescriptionVi": "Mô tả hình ảnh bằng Tiếng Việt bám sát đối thủ",
      "geminiImagePrompt": "Full English Prompt cho Google Gemini Imagen 3: Vertical 9:16 aspect ratio, highly detailed 8k photorealistic image of [EXACT COMPETITOR CHARACTER IN SPECIFIC OUTFIT AND ACTION], set in [EXACT COMPETITOR ENVIRONMENT], [EXACT COLOR PALETTE AND LIGHTING], shot on 35mm lens, cinematic depth of field, hyper-realistic, no text overlay --ar 9:16",
      "chatgptImagePrompt": "Full English Prompt cho ChatGPT DALL-E 3: Create a cinematic vertical 9:16 ratio image of [EXACT COMPETITOR CHARACTER], [ACTION], located in [EXACT COMPETITOR SETTING], featuring [EXACT LIGHTING AND COLOR TONE], ultra-detailed 8k resolution, photorealistic style, dramatic framing, no text overlay",
      "veo3VideoPrompt": "Full English Prompt cho Veo3/Sora Video: Vertical 9:16 cinematic video, [EXACT COMPETITOR CHARACTER AND ENVIRONMENT], [specific motion & action], [camera shot e.g. slow zoom in, smooth panning], 8k render, 24fps",
      "negativePrompt": "blurry, low quality, wrong character, inconsistent style, text watermark, 4:3, distorted"
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
