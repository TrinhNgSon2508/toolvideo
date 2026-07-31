import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Dynamic Prompt Generator: Clones & Binds 100% to THAT specific competitor's visual style
 */
export async function generateVeo3ChannelPrompts({
  analysisData = {},
  newScriptText,
  apiKey,
  provider = 'gemini'
}) {
  const detectedStyleName = analysisData.detectedArtMedium || 'Phong cách nghệ thuật của đối thủ';
  const extractedStylePrompt = analysisData.extractedVisualStylePrompt || analysisData.visualStyleAnalysis?.masterStylePrompt || 'photorealistic 8k, cinematic lighting';
  const negativePrompt = analysisData.negativePrompt || 'blurry, distorted, wrong style';
  const visualDNA = analysisData.visualDNA || {};

  const prompt = `
Bạn là Chuyên gia Prompt Engineering số 1 thế giới dành cho các AI Image & Video Generators như Google Gemini (Imagen 3), ChatGPT (DALL-E 3), Midjourney, Google Veo 3 và OpenAI Sora.

DƯỚI ĐÂY LÀ PHONG CÁCH NGHỆ THUẬT VÀ VISUAL DNA ĐỐI THỦ VỪA BÓC TÁCH:
- Tên phong cách nghệ thuật đối thủ: "${detectedStyleName}"
- Master Style Prompt đối thủ: "${extractedStylePrompt}"
- Nhân vật / Chủ thể đặc trưng: "${visualDNA.characterSubjectDetails || ''}"
- Bối cảnh & Không gian: "${visualDNA.environmentAndSetting || ''}"
- Tông màu & Ánh sáng: "${visualDNA.colorPaletteAndLighting || ''}"

DƯỚI ĐÂY LÀ KỊCH BẢN MỚI CẦN TẠO PROMPT HÌNH ẢNH & VIDEO:
\`\`\`
${newScriptText}
\`\`\`

YÊU CẦU BẮT BUỘC KHẮC KHEN:
BẤT KỲ VIDEO ĐỐI THỦ NÀO ĐƯỢC ĐƯA VÀO (Vẽ chì nền đen, Hoạt hình 2D, 3D Anime, Chân thực, hay Đất sét...), BẠN PHẢI TẠO RA BỘ PROMPT BÁM SÁT 100% THEO ĐÚNG PHONG CÁCH NGHỆ THUẬT "${detectedStyleName}" CỦA VIDEO ĐÓ!
- Không tự ý chuyển đổi sang 3D hay phong cảnh chân thực nếu video đối thủ dùng nét vẽ phác thảo hay hoạt hình!
- Mọi Prompt ảnh cho Gemini và ChatGPT ở từng cảnh phải chứa từ khóa style "${extractedStylePrompt}" và giữ đúng góc quay 9:16 vertical ratio.

Trả về kết quả chuẩn định dạng JSON theo cấu trúc sau (không chứa văn bản thừa):

{
  "channelName": "Tên kênh gợi ý",
  "channelConcept": "Tóm tắt chủ đề kênh",
  "detectedArtStyleName": "${detectedStyleName}",
  "masterStylePrompt": "${extractedStylePrompt}",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "0:00 - 0:03",
      "voiceover": "Lời thoại phân đoạn",
      "visualDescriptionVi": "Mô tả hình ảnh bằng Tiếng Việt bám sát 100% phong cách đối thủ",
      "geminiImagePrompt": "${extractedStylePrompt}, [subject & action in scene 1], vertical 9:16 ratio, clean framing, high quality --ar 9:16",
      "chatgptImagePrompt": "An image in ${detectedStyleName} style (${extractedStylePrompt}): [subject & action in scene 1], 9:16 vertical ratio, highly detailed",
      "veo3VideoPrompt": "Vertical 9:16 video in ${detectedStyleName} style (${extractedStylePrompt}): [subject action in scene 1], 24fps motion",
      "negativePrompt": "${negativePrompt}"
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
