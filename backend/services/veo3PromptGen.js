import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Visual Art Style Prompt Presets dictionary
 */
export const ART_STYLE_PRESETS = {
  blackboard_sketch: {
    name: "Vẽ tay phác thảo nét chì nền đen (Minimalist Pencil Sketch on Dark Background)",
    styleKeywords: "Minimalist hand-drawn white pencil sketch art style on dark charcoal blackboard background, simple cute 2D monochrome line art characters, high contrast black and white drawing, emotional glowing element, clean vector aesthetic, 9:16 vertical ratio",
    negativePrompt: "photorealistic, 3D render, realistic landscape, colorful, real human photograph, detailed environment"
  },
  minimalist_2d: {
    name: "Hoạt hình 2D Tối giản (Minimalist 2D Vector Animation)",
    styleKeywords: "Minimalist 2D flat vector illustration, cute cartoon character design, pastel color palette, clean outlines, simple aesthetic, vertical 9:16",
    negativePrompt: "photorealistic, 3D render, realistic human, dark gloomy, complex textures"
  },
  photorealistic_cinematic: {
    name: "Ảnh chụp 8K Điện ảnh (3D Photorealistic Cinematic)",
    styleKeywords: "8k photorealistic cinematic image, dramatic lighting, shot on 35mm lens, depth of field, hyper-realistic detail, Unreal Engine 5 render, vertical 9:16",
    negativePrompt: "cartoon, 2d illustration, sketch, drawing, low quality, anime"
  },
  cyberpunk_neon: {
    name: "Cyberpunk Neon Đêm (Cyberpunk Neon City)",
    styleKeywords: "Cyberpunk aesthetic, glowing purple and cyan neon light reflections, futuristic dark city setting, highly detailed 8k cinematic render, vertical 9:16",
    negativePrompt: "daylight, minimalist, simple drawing, vintage, bright pastel"
  }
};

/**
 * Generates image & video prompts strictly locked onto selected Art Style
 */
export async function generateVeo3ChannelPrompts({
  analysisData = {},
  newScriptText,
  selectedArtStyle = 'blackboard_sketch', // Default to hand-drawn sketch if matching competitor
  apiKey,
  provider = 'gemini'
}) {
  const visualDNA = analysisData.visualDNA || {};

  // Find exact art style preset or default to blackboard sketch
  const stylePreset = ART_STYLE_PRESETS[selectedArtStyle] || ART_STYLE_PRESETS.blackboard_sketch;

  const prompt = `
Bạn là Chuyên gia Prompt Engineering số 1 thế giới dành cho các AI Image & Video Generators như Google Gemini (Imagen 3), ChatGPT (DALL-E 3), Midjourney, Google Veo 3 và OpenAI Sora.

BẮT BUỘC PHONG CÁCH NGHỆ THUẬT (ART STYLE):
- Tên phong cách: ${stylePreset.name}
- Từ khóa Prompt chuẩn: "${stylePreset.styleKeywords}"
- Từ khóa cần tránh (Negative Prompt): "${stylePreset.negativePrompt}"

DƯỚI ĐÂY LÀ KỊCH BẢN MỚI CẦN TẠO PROMPT HÌNH ẢNH & VIDEO:
\`\`\`
${newScriptText}
\`\`\`

YÊU CẦU QUAN TRỌNG NHẤT:
MỌI PROMPT TẠO ẢNH CHO GEMINI VÀ CHATGPT PHẢI TUÂN THỦ 100% THEO PHONG CÁCH NGHỆ THUẬT "${stylePreset.name}". 
Nếu phong cách là "Vẽ tay phác thảo nét chì nền đen", KHÔNG ĐƯỢC TẠO RA ẢNH 3D HAY PHONG CẢNH CHÂN THỰC, mà PHẢI LÀ NÉT VẼ TAY 2D TRẮNG ĐEN TRÊN NỀN TỐI ĐÚNG VỚI NGUYÊN BẢN ĐỐI THỦ.

Trả về kết quả chuẩn định dạng JSON theo cấu trúc sau (không chứa bất kỳ văn bản thừa nào ngoài JSON):

{
  "channelName": "Tên kênh gợi ý",
  "channelConcept": "Tóm tắt chủ đề kênh",
  "selectedArtStyleName": "${stylePreset.name}",
  "masterStylePrompt": "${stylePreset.styleKeywords}",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "0:00 - 0:03",
      "voiceover": "Lời thoại phân đoạn",
      "visualDescriptionVi": "Mô tả hình ảnh bằng Tiếng Việt theo đúng phong cách nghệ thuật",
      "geminiImagePrompt": "${stylePreset.styleKeywords}, [subject & action for scene 1], emotional glowing heart/light, no text overlay, ratio 9:16 --ar 9:16",
      "chatgptImagePrompt": "Create an image in ${stylePreset.name} style: ${stylePreset.styleKeywords}. Depict [subject & action for scene 1], 9:16 ratio vertical framing, no text overlay",
      "veo3VideoPrompt": "Vertical 9:16 video in ${stylePreset.name} style: ${stylePreset.styleKeywords}, [subject action], gentle animation, 24fps",
      "negativePrompt": "${stylePreset.negativePrompt}"
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
