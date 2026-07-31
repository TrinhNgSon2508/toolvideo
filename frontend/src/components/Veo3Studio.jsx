import React, { useState } from 'react';
import { Copy, Check, Download, Film, Sparkles, Video, Zap, MessageSquare, AlertCircle, Info } from 'lucide-react';

export default function Veo3Studio({ veo3Data }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!veo3Data || !veo3Data.scenes) return null;

  const handleCopyPrompt = (promptText, key) => {
    navigator.clipboard.writeText(promptText);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadAllPrompts = () => {
    let fullText = `# 🚀 BỘ PROMPT TẠO ẢNH & VIDEO (GEMINI, CHATGPT DALL-E 3, VEO3 / SORA)\n\n`;
    fullText += `📌 Phong cách nghệ thuật: ${veo3Data.selectedArtStyleName || 'Vẽ chì phác thảo 2D nền đen'}\n`;
    fullText += `📌 Kênh: ${veo3Data.channelName || 'Kênh Mới'}\n`;
    fullText += `🎨 Master Style Prompt: ${veo3Data.masterStylePrompt || ''}\n\n`;
    fullText += `---------------------------------------------------\n\n`;

    veo3Data.scenes.forEach((sc) => {
      fullText += `🎬 CẢNH ${sc.sceneNumber} (${sc.timestamp})\n`;
      fullText += `🗣️ Voiceover: ${sc.voiceover}\n`;
      fullText += `🖼️ Mô tả tiếng Việt: ${sc.visualDescriptionVi}\n\n`;
      fullText += `🔷 PROMPT GEMINI IMAGEN 3:\n${sc.geminiImagePrompt}\n\n`;
      fullText += `🟢 PROMPT CHATGPT DALL-E 3:\n${sc.chatgptImagePrompt}\n\n`;
      fullText += `⚡ PROMPT VEO3 / SORA VIDEO:\n${sc.veo3VideoPrompt || sc.veo3Prompt}\n\n`;
      fullText += `🚫 Negative Prompt (Từ khóa cấm): ${sc.negativePrompt || 'photorealistic, 3d render, real human'}\n\n`;
      fullText += `---------------------------------------------------\n\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `bo_prompt_anh_video_gemini_chatgpt_veo3_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="transcript-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: '#ec4899' }}>
            <Sparkles size={26} /> Bộ Prompt Tạo Ảnh (Gemini, ChatGPT) & Video (Veo3)
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 4 }}>
            Đã khóa đúng phong cách nghệ thuật: <strong style={{ color: '#06b6d4' }}>{veo3Data.selectedArtStyleName || 'Vẽ tay phác thảo 2D nền đen'}</strong>
          </p>
        </div>

        <div className="actions-group">
          <button className="btn-secondary" onClick={handleDownloadAllPrompts}>
            <Download size={16} /> Tải Bộ Prompt (.md)
          </button>
        </div>
      </div>

      {/* Guidance Alert Banner */}
      <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: 16, borderRadius: 14, marginBottom: 24, color: '#fee2e2' }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5' }}>
          <AlertCircle size={18} /> ⚠️ LƯU Ý QUAN TRỌNG KHI TẠO ẢNH TRÊN GEMINI VÀ CHATGPT:
        </div>
        <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#e5e7eb' }}>
          Để Gemini / ChatGPT <strong>KHÔNG VẼ NGUYÊN NGƯỜI THẬT HAY PHONG CẢNH 3D (như ảnh bạn vừa bị)</strong>, hãy sao chép toàn bộ đoạn <strong>"🔷 PROMPT GEMINI"</strong> bên dưới. Đoạn Prompt này đã bọc sẵn lệnh ép Gemini tạo ra đúng <strong>Nét vẽ phác thảo chì 2D trên nền đen (Hình 1)</strong>!
        </div>
      </div>

      {/* Master Channel Banner */}
      <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: 16, borderRadius: 14, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '0.95rem', marginBottom: 4 }}>
          📺 Định Hướng Kênh: {veo3Data.channelName || 'Kênh Phác Thảo Cảm Xúc'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
          {veo3Data.channelConcept}
        </div>
      </div>

      {/* Scenes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {veo3Data.scenes.map((sc, idx) => (
          <div key={idx} style={{ background: 'rgba(8, 12, 23, 0.95)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, color: '#06b6d4', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Video size={18} /> Cảnh {sc.sceneNumber} ({sc.timestamp})
              </span>
            </div>

            <div style={{ marginBottom: 10, fontSize: '0.88rem', color: '#e5e7eb' }}>
              <strong>🗣️ Lời thoại Voiceover:</strong> "{sc.voiceover}"
            </div>

            <div style={{ marginBottom: 14, fontSize: '0.85rem', color: '#9ca3af' }}>
              <strong>🖼️ Mô tả hình ảnh:</strong> {sc.visualDescriptionVi}
            </div>

            {/* 3 Prompts Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* 1. Gemini Imagen 3 Prompt */}
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: 14, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} color="#6366f1" /> 🔷 PROMPT TẠO ẢNH GEMINI (ĐÃ KHÓA NÉT CHÌ 2D NỀN ĐEN):
                  </span>
                  <button className="btn-secondary" onClick={() => handleCopyPrompt(sc.geminiImagePrompt, `gemini_${idx}`)} style={{ padding: '3px 10px', fontSize: '0.75rem' }}>
                    {copiedKey === `gemini_${idx}` ? <><Check size={12} color="#10b981" /> Đã Copy!</> : <><Copy size={12} /> Copy Prompt Gemini</>}
                  </button>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {sc.geminiImagePrompt}
                </div>
              </div>

              {/* 2. ChatGPT DALL-E 3 Prompt */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: 14, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={14} color="#10b981" /> 🟢 PROMPT TẠO ẢNH CHATGPT (DALL-E 3):
                  </span>
                  <button className="btn-secondary" onClick={() => handleCopyPrompt(sc.chatgptImagePrompt, `chatgpt_${idx}`)} style={{ padding: '3px 10px', fontSize: '0.75rem' }}>
                    {copiedKey === `chatgpt_${idx}` ? <><Check size={12} color="#10b981" /> Đã Copy!</> : <><Copy size={12} /> Copy Prompt ChatGPT</>}
                  </button>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#a7f3d0', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {sc.chatgptImagePrompt}
                </div>
              </div>

              {/* 3. Veo3 / Sora Video Prompt */}
              <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: 14, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14} color="#06b6d4" /> ⚡ PROMPT TẠO VIDEO VEO3 / SORA (24FPS MOTION):
                  </span>
                  <button className="btn-secondary" onClick={() => handleCopyPrompt(sc.veo3VideoPrompt || sc.veo3Prompt, `veo3_${idx}`)} style={{ padding: '3px 10px', fontSize: '0.75rem' }}>
                    {copiedKey === `veo3_${idx}` ? <><Check size={12} color="#10b981" /> Đã Copy!</> : <><Copy size={12} /> Copy Veo3 Prompt</>}
                  </button>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#67e8f9', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {sc.veo3VideoPrompt || sc.veo3Prompt}
                </div>
              </div>

              {/* Negative Prompt */}
              {sc.negativePrompt && (
                <div style={{ fontSize: '0.78rem', color: '#fca5a5', padding: '6px 10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6 }}>
                  <strong>🚫 Từ khóa cấm (Negative Prompt):</strong> {sc.negativePrompt}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
