import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Visual Style Prompt Rules Engine
 */
const ART_STYLE_STRICT_PREFIXES = {
  blackboard_sketch: {
    name: "Vẽ tay phác thảo nét chì 2D nền đen (ĐỐI THỦ HÌNH 1)",
    prefix: "CRITICAL ART STYLE REQUIRED: 2D Minimalist hand-drawn white pencil chalk line-art sketch on pure dark charcoal blackboard background. Simple cute 2D line art characters, black and white drawing aesthetic ONLY. Glowing white line details.",
    negative: "ABSOLUTELY NO REALISTIC PHOTOGRAPHY, NO REAL HUMANS, NO REALISTIC STREETS, NO 3D RENDER, NO REAL WORLD PHOTOS, NO COLORED REALISTIC PEOPLE, NO WATERMARK."
  },
  minimalist_2d: {
    name: "Hoạt hình 2D Tối giản (Flat Vector)",
    prefix: "CRITICAL ART STYLE REQUIRED: Minimalist 2D flat vector illustration, cute cartoon 2D character design, simple clean outlines, smooth pastel colors.",
    negative: "ABSOLUTELY NO REALISTIC PHOTOGRAPHY, NO REAL HUMANS, NO 3D RENDER, NO COMPLEX REAL WORLD TEXTURES."
  },
  photorealistic_cinematic: {
    name: "Ảnh chụp 8K Điện ảnh (3D Photorealistic)",
    prefix: "CRITICAL ART STYLE REQUIRED: 8k photorealistic cinematic photography, dramatic lighting, shot on 35mm lens, hyper-realistic details, Unreal Engine 5 render.",
    negative: "cartoon, 2d illustration, sketch, drawing, low quality, anime"
  }
};

/**
 * Generates image & video prompts strictly enforcing selected Art Style
 */
export async function generateVeo3ChannelPrompts({
  analysisData = {},
  newScriptText,
  selectedArtStyle = 'blackboard_sketch', // Default to pencil sketch
  apiKey,
  provider = 'gemini'
}) {
  const styleRule = ART_STYLE_STRICT_PREFIXES[selectedArtStyle] || ART_STYLE_STRICT_PREFIXES.blackboard_sketch;

  const prompt = `
Bạn là Chuyên gia Prompt Engineering hàng đầu thế giới dành cho Google Gemini (Imagen 3), ChatGPT (DALL-E 3), Veo 3 và Sora.

NHIỆM VỤ TỐI THƯỢNG:
BẠN PHẢI TẠO RA BỘ PROMPT BẮT BUỘC MÔ TẢ THEO ĐÚNG PHONG CÁCH:
👉 "${styleRule.name}"

CÚ PHÁP PROMPT PHẢI BẮT ĐẦU BẰNG TỪ KHÓA BẮT BUỘC SAU:
"${styleRule.prefix}"

TỪ KHÓA CẤM (NEGATIVE PROMPT):
"${styleRule.negative}"

DƯỚI ĐÂY LÀ KỊCH BẢN NỘI DUNG CẦN TẠO PROMPT:
\`\`\`
${newScriptText}
\`\`\`

BẮT BUỘC KHÔNG ĐƯỢC TẠO RA ẢNH NGƯỜI THẬT HOẶC ẢNH CHỤP PHONG CẢNH CHÂN THỰC NẾU PHONG CÁCH LÀ VẼ TAY 2D NÉT CHÌ TRÊN NỀN ĐEN!
Mọi Prompt Gemini & ChatGPT ở từng phân cảnh phải viết bằng Tiếng Anh, ép buộc tỉ lệ 9:16 vertical ratio.

Trả về kết quả chuẩn định dạng JSON theo cấu trúc sau (không chứa văn bản thừa):

{
  "channelName": "Tên kênh gợi ý",
  "channelConcept": "Tóm tắt chủ đề kênh",
  "selectedArtStyleName": "${styleRule.name}",
  "masterStylePrompt": "${styleRule.prefix}",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "0:00 - 0:03",
      "voiceover": "Lời thoại phân đoạn",
      "visualDescriptionVi": "Mô tả hình ảnh bằng Tiếng Việt theo đúng phong cách phác thảo nét chì 2D nền đen",
      "geminiImagePrompt": "${styleRule.prefix} Scene 1: [Simple 2D sketch character action for scene 1], vertical 9:16 aspect ratio, clean high contrast black and white drawing --ar 9:16",
      "chatgptImagePrompt": "${styleRule.prefix} Scene 1: Depict [Simple 2D sketch character action for scene 1], 9:16 vertical framing, strictly 2D pencil sketch on dark background, no real humans",
      "veo3VideoPrompt": "Vertical 9:16 video in ${styleRule.name} style: ${styleRule.prefix}, [2D character motion], 24fps",
      "negativePrompt": "${styleRule.negative}"
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
