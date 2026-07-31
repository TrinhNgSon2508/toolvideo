import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Advanced Competitor Video Analyzer: Video Motion, Visual Style, Voiceover Tone, & Outperform Strategy
 */
export async function analyzeCompetitorVideo({
  transcript,
  apiKey,
  provider = 'groq'
}) {
  const prompt = `
Bạn là một Đạo diễn Điện ảnh & Chuyên gia Phân tích Content Video Ngắn (TikTok/Reels/Shorts/YouTube) số 1 thị trường.

Dưới đây là NỘI DUNG VÀ LỜI THOẠI TRÍCH XUẤT TỪ VIDEO ĐỐI THỦ:
\`\`\`
${transcript}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy phân tích mổ xẻ toàn diện video đối thủ trên 3 TRỤ CỘT CHÍNH: (1) VIDEO/CHUYỂN ĐỘNG, (2) HÌNH ẢNH/PHONG CÁCH NGHỆ THUẬT, (3) GIỌNG ĐỌC/ÂM THANH. Từ đó đưa ra BẢN ĐÚC KẾT ĐỂ BẠN LÀM VIDEO HOÀN CHỈNH & VƯỢT TRỘI HƠN ĐỐI THỦ (Outperform Strategy).

Hãy trả về kết quả định dạng JSON chuẩn xác theo cấu trúc sau (không chứa bất kỳ văn bản thừa nào ngoài JSON):

{
  "videoAnalysis": {
    "visualFormat": "Ảnh tĩnh ghép hiệu ứng / Video AI chuyển động 3D / AI Avatar nói chuyện / B-Roll điện ảnh",
    "motionType": "Góc quay tĩnh / Zoom dồn dập / Camera Tracking / Pan ngang / Cinematic Slow motion",
    "pacing": "Rất nhanh (1-2s đổi cảnh) / Trung bình (3-5s) / Chậm lắng đọng",
    "retentionTechnique": "Kỹ thuật giữ chân người xem của đối thủ (Pattern Interrupt, Hook 3s, Visual Loops...)"
  },
  "visualStyleAnalysis": {
    "colorGrading": "Tông màu tối bí ẩn (Dark Moody) / Rực rỡ hiện đại (Vibrant Modern) / Cổ điển Cinematic / Tối giản",
    "subjectAndEnvironment": "Mô tả phong cách nhân vật, bối cảnh và chất liệu chi tiết",
    "masterStylePrompt": "Đoạn Prompt Tiếng Anh (Master Visual Style Prompt) độ phân giải 8k, photorealistic, cinematic lighting, nhất quán 100% cho toàn bộ series video của kênh"
  },
  "voiceAnalysis": {
    "recommendedGenderAndDialect": "Giọng Nam/Nữ, vùng miền (Giọng Bắc trầm ấm / Giọng Nam sôi nổi / Giọng Nữ lôi cuốn)",
    "toneAndEmotion": "Cảm xúc đọc: Drama bí ẩn / Hào hứng truyền cảm hứng / Chuyên gia uy tín / Hài hước Gen-Z",
    "speakingSpeed": "Nhanh dồn dập / Vừa phải dễ nghe / Nhấn từng từ lắng đọng",
    "bgmAndSfxRecommendation": "Gợi ý thể loại Nhạc nền (BGM: Synthwave/Lo-Fi/Epic Cinematic) & Hiệu ứng âm thanh (SFX: Riser, Swoosh, Pop)"
  },
  "outperformStrategy": {
    "competitorWeakness": "Điểm yếu lớn nhất trong video của đối thủ (Ví dụ: Lời thoại lan man, thiếu hình ảnh minh họa đắt giá, kết bài chưa ấn tượng)",
    "fiveImprovementKeys": [
      "Bí quyết 1: Tối ưu lại 3 giây đầu tiên (Hook) cực mạnh chạm nỗi đau người xem",
      "Bí quyết 2: Đẩy nhanh nhịp chuyển cảnh gấp 1.5 lần",
      "Bí quyết 3: Nâng cấp hình ảnh chất lượng 8k Cinematic sinh động hơn",
      "Bí quyết 4: Dùng giọng đọc AI cảm xúc chuẩn tông hơn",
      "Bí quyết 5: Thêm Call-To-Action (CTA) chốt đơn/follow thuyết phục"
    ],
    "actionPlanSummary": "Đút rút hành động cụ thể để bạn làm kịch bản & dựng video vượt trội hơn đối thủ ngay hôm nay"
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
