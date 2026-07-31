import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Dynamic Competitor Video Analyzer: Auto-detects Exact Art Medium & Visual Style
 */
export async function analyzeCompetitorVideo({
  transcript,
  apiKey,
  provider = 'groq'
}) {
  const prompt = `
Bạn là một Đạo diễn Điện ảnh & Chuyên gia Phân tích Visual Content Video Ngắn (TikTok/Reels/Shorts/YouTube) số 1 thế giới.

DƯỚI ĐÂY LÀ NỘI DUNG VÀ LỜI THOẠI TRÍCH XUẤT TỪ VIDEO ĐỐI THỦ:
\`\`\`
${transcript}
\`\`\`

NHIỆM VỤ QUAN TRỌNG NHẤT:
Hãy phân tích và BÓC TÁCH TỰ ĐỘNG PHONG CÁCH NGHỆ THUẬT VẼ/DỰNG HÌNH (Exact Art Medium & Visual Style) của đối thủ.
Ví dụ:
- Nếu video đối thủ là nét vẽ phác thảo chì trắng trên nền tối 2D ➔ Phải bóc tách chuẩn "Minimalist 2D pencil sketch on dark background".
- Nếu video đối thủ là Hoạt hình 2D Anime ➔ Phải bóc tách "2D Anime Japanese Animation".
- Nếu video đối thủ là 3D Chân thực ➔ Phải bóc tách "3D Photorealistic 8K Render".
- Nếu video đối thủ là Đất sét / Sand art / Cyberpunk ➔ Bóc tách chính xác phong cách đó.

Trả về kết quả định dạng JSON chuẩn xác theo cấu trúc sau (không kèm văn bản thừa):

{
  "detectedArtMedium": "Tên tiếng Việt phong cách nghệ thuật bóc tách được từ đối thủ (Ví dụ: Vẽ phác thảo chì 2D nền đen / Hoạt hình Anime / 3D Điện ảnh)",
  "extractedVisualStylePrompt": "Đoạn Prompt Tiếng Anh chuẩn tả chính xác 100% phong cách nghệ thuật, chất liệu, màu sắc, bối cảnh của đối thủ",
  "negativePrompt": "Các từ khóa đối lập cần loại bỏ để không bị chệch phong cách đối thủ",
  "videoAnalysis": {
    "visualFormat": "Định dạng hình ảnh đối thủ",
    "motionType": "Loại chuyển động camera",
    "pacing": "Nhịp độ đổi cảnh"
  },
  "visualDNA": {
    "characterSubjectDetails": "Nhân vật / Chủ thể chính của đối thủ",
    "environmentAndSetting": "Bối cảnh & Không gian đối thủ",
    "colorPaletteAndLighting": "Tông màu & Ánh sáng đối thủ",
    "cameraFramingStyle": "Góc quay & Khung hình"
  },
  "voiceAnalysis": {
    "recommendedGenderAndDialect": "Giọng đọc AI phù hợp",
    "toneAndEmotion": "Tông cảm xúc",
    "bgmAndSfxRecommendation": "BGM & SFX"
  },
  "outperformStrategy": {
    "competitorWeakness": "Điểm yếu của đối thủ",
    "fiveImprovementKeys": [
      "Bí quyết 1",
      "Bí quyết 2",
      "Bí quyết 3",
      "Bí quyết 4",
      "Bí quyết 5"
    ],
    "actionPlanSummary": "Hành động đút rút"
  }
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
