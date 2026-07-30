import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Script Rewriter Engine using Gemini API with robust model fallback
 */
export async function rewriteScriptWithGemini({
  originalTranscript,
  style = 'tiktok_viral',
  targetDuration = '60s',
  targetAudience = 'Khán giả đại chúng',
  customPrompt = '',
  userApiKey
}) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa cấu hình Gemini API Key! Vui lòng kiểm tra lại Cài đặt.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const styleInstructions = {
    tiktok_viral: `
      - Phong cách: TikTok / Reels / Shorts Viral ngắn gọn.
      - 0-3 giây đầu tiên (HOOK): Phải cực kỳ gây tò mò, giật gân hoặc đặt một câu hỏi chạm đúng nỗi đau của người xem để họ dừng lướt!
      - Thân bài: Ngắn gọn, súc tích, dồn dập nhịp điệu, ngắt câu ngắn dễ đọc voiceover.
      - Kết bài: Call to action (CTA) kêu gọi thả tim, bình luận hoặc lưu lại video.
    `,
    storytelling: `
      - Phong cách: Kể chuyện (Storytelling), cảm xúc, sâu sắc.
      - Biến lời thoại thành một câu chuyện có bối cảnh, cao trào và bài học/thông điệp lắng đọng.
      - Dùng từ ngữ giàu hình ảnh (sensory words), tạo sự đồng cảm cao.
    `,
    sales_aida: `
      - Phong cách: Bán hàng / Review sản phẩm chuẩn mô hình AIDA.
      - Attention (Gây chú ý): Hook chạm đúng nhu cầu/vấn đề.
      - Interest (Tạo hứng thú): Giới thiệu giải pháp/sản phẩm độc đáo.
      - Desire (Khao khát): Nêu bật 3 lợi ích vượt trội nhất & bằng chứng.
      - Action (Hành động): Kêu gọi mua ngay / click vào giỏ hàng/bio.
    `,
    expert_educational: `
      - Phong cách: Chuyên gia / Đúc kết kiến thức chuyên sâu.
      - Giọng văn tự tin, uy tín, chia sẻ dưới dạng 3 bí quyết / 3 bài học thực chiến.
      - Rõ ràng, cấu trúc logic, không lan man.
    `,
    humor_genz: `
      - Phong cách: Hài hước, Gen-Z, dí dỏm, bắt trend.
      - Sử dụng ngôn ngữ thân thiện, vui nhộn, từ ngữ trending tự nhiên (không gượng ép).
      - Tạo tính giải trí cao.
    `,
    custom: `
      - Thực hiện chính xác theo yêu cầu tùy chỉnh của người dùng bên dưới.
    `
  };

  const prompt = `
Bạn là một Đạo diễn Kịch bản Video & AI Content Creator chuyên nghiệp xuất sắc nhất.

Dưới đây là LỜI THOẠI GỐC trích xuất từ video:
\`\`\`
${originalTranscript}
\`\`\`

NHIỆM VỤ CỦA BẠN:
Hãy "xào nấu" lại lời thoại gốc trên để tạo ra một KỊCH BẢN VIDEO MỚI hay hơn, lôi cuốn hơn, chuẩn cấu trúc video ngắn viral.

THÔNG SỐ CẤU HÌNH:
1. Phong cách mong muốn: ${style} (${styleInstructions[style] || ''})
2. Thời lượng mục tiêu: ${targetDuration}
3. Đối tượng khán giả mục tiêu: ${targetAudience}
${customPrompt ? `4. Yêu cầu tùy chỉnh bổ sung: ${customPrompt}` : ''}

ĐỊNH DẠNG ĐẦU RA MONG MUỐN (Hãy xuất dạng Markdown đẹp mắt, chuẩn cấu trúc):

# 🚀 KỊCH BẢN VIDEO MỚI (REWRITTEN SCRIPT)

## 📌 1. TIÊU ĐỀ VIDEO SUGGESTIONS (3 Tiêu đề giật gân để đặt tên Video)
- Title 1: ...
- Title 2: ...
- Title 3: ...

---

## 🎬 2. KỊCH BẢN CHI TIẾT (VOICEOVER & HÌNH ẢNH MINH HỌA)

| Phân đoạn | Thời lượng | Lời thoại đọc (Voiceover) | Gợi ý hình ảnh / Góc quay (Visuals) |
|---|---|---|---|
| **HOOK (Mở đầu)** | 0:00 - 0:03 | [Câu chẻ ngửa / Gây sốc] | [Cận cảnh / Hiệu ứng] |
| **DẪN DẮT** | 0:03 - 0:10 | ... | ... |
| **THÂN BÀI (Nội dung chính)** | 0:10 - 0:45 | ... | ... |
| **CTA (Kết bài)** | 0:45 - 1:00 | [Kêu gọi hành động] | [Icon / Text màn hình] |

---

## 📝 3. LỜI THOẠI ĐỌC LIÊN MẠCH (Dùng để thu âm trực tiếp / Chèn vào máy đọc AI)
(Trình bày dạng đoạn văn bản sạch không chứa ghi chú góc quay, dễ dàng sao chép để thu âm).

---

## 💡 4. ĐÁNH GIÁ CẢI TIẾN (So với bài gốc)
- Điểm khác biệt lớn nhất: ...
- Tại sao kịch bản mới này thu hút hơn: ...
`;

  const modelsToTry = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash'
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Rewriter] Attempting script rewrite with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`[Rewriter] Model ${modelName} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`Lỗi xào nấu kịch bản AI: ${lastError ? lastError.message : 'Dịch vụ bận'}`);
}
