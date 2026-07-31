import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Advanced Competitor Video Analyzer with Visual DNA Extraction
 */
export async function analyzeCompetitorVideo({
  transcript,
  apiKey,
  provider = 'groq'
}) {
  const prompt = `
Bạn là một Đạo diễn Điện ảnh & Chuyên gia Phân tích Visual Content Video Ngắn (TikTok/Reels/Shorts/YouTube) số 1 thị trường.

Dưới đây là NỘI DUNG VÀ LỜI THOẠI TRÍCH XUẤT TỪ VIDEO ĐỐI THỦ:
\`\`\`
${transcript}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy bóc tách "DNA HÌNH ẢNH & VISUAL ANCHORS" chi tiết nhất của đối thủ để các ảnh/video AI tạo ra sau này BÁM SÁT 100% GIỐNG HỆT PHONG CÁCH VÀ BỐI CẢNH CỦA ĐỐI THỦ.

Trả về kết quả định dạng JSON chuẩn xác theo cấu trúc sau (không kèm văn bản thừa):

{
  "videoAnalysis": {
    "visualFormat": "Ảnh tĩnh ghép hiệu ứng / Video AI chuyển động 3D / AI Avatar nói chuyện / B-Roll điện ảnh",
    "motionType": "Góc quay tĩnh / Zoom dồn dập / Camera Tracking / Pan ngang / Cinematic Slow motion",
    "pacing": "Rất nhanh (1-2s đổi cảnh) / Trung bình (3-5s) / Chậm lắng đọng",
    "retentionTechnique": "Kỹ thuật giữ chân người xem của đối thủ"
  },
  "visualDNA": {
    "characterSubjectDetails": "Mô tả siêu chi tiết nhân vật/vật thể chính đối thủ (Tuổi tác, giới tính, kiểu tóc, trang phục đặc trưng, biểu cảm)",
    "environmentAndSetting": "Bối cảnh chi tiết đối thủ hay dùng (Phòng làm việc hiện đại, đường phố ban đêm, studio ánh sáng neon, phong cảnh núi rừng...)",
    "colorPaletteAndLighting": "Tông màu & Ánh sáng đặc trưng (Ánh sáng tím Cyberpunk, Tông tối Dark Moody, Nắng vàng Warm Golden, Ánh sáng Studio chuyên nghiệp)",
    "cameraFramingStyle": "Cách xếp khung hình đặc trưng (Cận cảnh khuôn mặt, Góc nhìn thứ nhất 1st person, Góc rộng cinematic 9:16)"
  },
  "visualStyleAnalysis": {
    "colorGrading": "Tông màu chủ đạo",
    "subjectAndEnvironment": "Tóm tắt bối cảnh",
    "masterStylePrompt": "Một đoạn Prompt Tiếng Anh chuẩn (Master Visual DNA Prompt) mô tả nhân vật, bối cảnh, ánh sáng, góc quay 9:16, 8k resolution, photorealistic để tạo ảnh bám sát 100% giống video đối thủ"
  },
  "voiceAnalysis": {
    "recommendedGenderAndDialect": "Giọng Nam/Nữ, vùng miền",
    "toneAndEmotion": "Cảm xúc đọc",
    "speakingSpeed": "Tốc độ đọc",
    "bgmAndSfxRecommendation": "Gợi ý BGM & SFX"
  },
  "outperformStrategy": {
    "competitorWeakness": "Điểm yếu lớn nhất của đối thủ",
    "fiveImprovementKeys": [
      "Bí quyết 1",
      "Bí quyết 2",
      "Bí quyết 3",
      "Bí quyết 4",
      "Bí quyết 5"
    ],
    "actionPlanSummary": "Đút rút hành động"
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
