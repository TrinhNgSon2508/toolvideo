import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import path from 'path';

/**
 * Transcribes audio/video file using Google Gemini API with robust model fallback
 */
export async function transcribeAudioWithGemini(filePath, userApiKey) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa cấu hình Gemini API Key! Vui lòng nhập API Key ở menu Cài đặt trên giao diện hoặc trong file .env.');
  }

  const fileManager = new GoogleAIFileManager(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(`[Transcriber] Uploading file to Gemini File API: ${filePath}`);
  
  // Determine mime type
  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'audio/mp3';
  if (ext === '.mp4') mimeType = 'video/mp4';
  else if (ext === '.m4a') mimeType = 'audio/m4a';
  else if (ext === '.wav') mimeType = 'audio/wav';
  else if (ext === '.webm') mimeType = 'audio/webm';
  else if (ext === '.ogg') mimeType = 'audio/ogg';

  // Upload file to Gemini File API
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType: mimeType,
    displayName: `video_audio_${Date.now()}`,
  });

  console.log(`[Transcriber] Upload successful. URI: ${uploadResult.file.uri}. Processing audio...`);

  // Wait for processing if needed
  let fileState = await fileManager.getFile(uploadResult.file.name);
  while (fileState.state === 'PROCESSING') {
    console.log('[Transcriber] Waiting for file processing...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fileState = await fileManager.getFile(uploadResult.file.name);
  }

  if (fileState.state === 'FAILED') {
    throw new Error('Gemini không thể xử lý file audio này.');
  }

  const prompt = `
Bạn là một chuyên gia Chuyển âm thanh thành văn bản (Speech-to-Text) hàng đầu thế giới.
Nhiệm vụ của bạn: Hãy lắng nghe thật kỹ file âm thanh/video này và chép chính xác 100% từng từ lời thoại tiếng Việt (hoặc ngôn ngữ phát ra trong video).

Yêu cầu định dạng đầu ra bao gồm 2 phần chính:

---PHẦN 1: LỜI THOẠI HOÀN CHỈNH (RAW TRANSCRIPT)---
(Viết liền mạch, đúng chính tả tiếng Việt, có chấm phẩy rõ ràng, giữ nguyên các từ ngữ lóng hay thuật ngữ trong video).

---PHẦN 2: LỜI THOẠI KÈM MỐC THỜI GIAN (TIMESTAMPED TRANSCRIPT)---
Định dạng từng dòng:
[mm:ss] Nội dung lời thoại trong khoảng thời gian đó.

Hãy thực hiện chính xác, không tự ý tóm tắt ở bước chép lời này.
`;

  // Try flash models that are supported for audio input
  const modelsToTry = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash'
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Transcriber] Attempting transcription with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResult.file.mimeType,
            fileUri: uploadResult.file.uri
          }
        },
        { text: prompt }
      ]);

      const responseText = result.response.text();

      // Clean up file from Gemini storage
      try {
        await fileManager.deleteFile(uploadResult.file.name);
      } catch (e) {}

      return responseText;
    } catch (err) {
      console.warn(`[Transcriber] Model ${modelName} failed: ${err.message}`);
      lastError = err;
    }
  }

  // Attempt cleanup
  try {
    await fileManager.deleteFile(uploadResult.file.name);
  } catch (e) {}

  throw new Error(`Lỗi khi gọi Gemini API chép lời: ${lastError ? lastError.message : 'API key bị hạn chế'}. Vui lòng thử lại sau 15-30 giây.`);
}
