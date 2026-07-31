import React, { useState } from 'react';
import { Copy, Check, Download, Film, Sparkles, Video, Zap, MessageSquare, AlertCircle } from 'lucide-react';

export default function Veo3Studio({ veo3Data }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!veo3Data || !veo3Data.scenes) return null;

  const handleCopyPrompt = (promptText, key) => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const defaultStylePrefix = "CRITICAL ART STYLE REQUIRED: 2D Minimalist hand-drawn white pencil chalk line-art sketch on pure dark charcoal blackboard background. Simple cute 2D monochrome line art characters ONLY. ABSOLUTELY NO REALISTIC PHOTOGRAPHY, NO REAL HUMANS, NO 3D RENDER.";

  const handleDownloadAllPrompts = () => {
    let fullText = `# 🚀 BỘ PROMPT TẠO ẢNH & VIDEO (GEMINI, CHATGPT DALL-E 3, VEO3 / SORA)\n\n`;
    fullText += `📌 Phong cách: Vẽ chì phác thảo 2D nền đen\n`;
    fullText += `📌 Kênh: ${veo3Data.channelName || 'Kênh Mới'}\n\n`;
    fullText += `---------------------------------------------------\n\n`;

    veo3Data.scenes.forEach((sc) => {
      const gPrompt = sc.geminiImagePrompt || sc.geminiPrompt || `${defaultStylePrefix} Scene: ${sc.visualDescriptionVi || sc.voiceover} --ar 9:16`;
      const cPrompt = sc.chatgptImagePrompt || sc.chatgptPrompt || `${defaultStylePrefix} Scene: ${sc.visualDescriptionVi || sc.voiceover}, 9:16 ratio`;
      const vPrompt = sc.veo3VideoPrompt || sc.veo3Prompt || sc.videoPrompt;

      fullText += `🎬 CẢNH ${sc.sceneNumber} (${sc.timestamp})\n`;
      fullText += `🗣️ Voiceover: ${sc.voiceover}\n`;
      fullText += `🖼️ Mô tả: ${sc.visualDescriptionVi}\n\n`;
      fullText += `🔷 PROMPT GEMINI IMAGEN 3:\n${gPrompt}\n\n`;
      fullText += `🟢 PROMPT CHATGPT DALL-E 3:\n${cPrompt}\n\n`;
      fullText += `⚡ PROMPT VEO3 / SORA VIDEO:\n${vPrompt}\n\n`;
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
            Đã khóa đúng phong cách nghệ thuật: <strong style={{ color: '#06b6d4' }}>Vẽ chì phác thảo 2D nền đen (Đúng đối thủ)</strong>
          </p>
        </div>

        <div className="actions-group">
          <button className="btn-secondary" onClick={handleDownloadAllPrompts}>
            <Download size={16} /> Tải Bộ Prompt (.md)
          </button>
        </div>
      </div>

      {/* Alert Guidance */}
      <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: 16, borderRadius: 14, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5' }}>
          <AlertCircle size={18} /> ⚠️ LƯU Ý KHI TẠO ẢNH GEMINI & CHATGPT:
        </div>
        <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#e5e7eb' }}>
          Bấm nút <strong>"Copy Prompt Gemini"</strong> bên dưới dán vào Gemini. Đoạn Prompt đã được chèn lệnh ép buộc Gemini vẽ ra đúng <strong>Nét chì phác thảo 2D nền đen (Hình 1)</strong>, tuyệt đối không ra ảnh thật 3D!
        </div>
      </div>

      {/* Scenes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {veo3Data.scenes.map((sc, idx) => {
          // Resolve prompts with multi-key fallbacks
          const geminiPrompt = sc.geminiImagePrompt || sc.geminiPrompt || `${defaultStylePrefix} ${sc.visualDescriptionVi || sc.voiceover} --ar 9:16`;
          const chatgptPrompt = sc.chatgptImagePrompt || sc.chatgptPrompt || `${defaultStylePrefix} ${sc.visualDescriptionVi || sc.voiceover}, 9:16 vertical ratio`;
          const veo3Prompt = sc.veo3VideoPrompt || sc.veo3Prompt || sc.videoPrompt || `${defaultStylePrefix} 2D animation`;
          const negativePrompt = sc.negativePrompt || 'photorealistic, 3d render, real human, realistic photography, colorful background';

          return (
            <div key={idx} style={{ background: 'rgba(8, 12, 23, 0.95)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: '#06b6d4', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Video size={18} /> Cảnh {sc.sceneNumber} ({sc.timestamp || '0:00'})
                </span>
              </div>

              <div style={{ marginBottom: 10, fontSize: '0.88rem', color: '#e5e7eb' }}>
                <strong>🗣️ Lời thoại Voiceover:</strong> "{sc.voiceover}"
              </div>

              <div style={{ marginBottom: 14, fontSize: '0.85rem', color: '#9ca3af' }}>
                <strong>🖼️ Mô tả hình ảnh:</strong> {sc.visualDescriptionVi}
              </div>

              {/* 3 Prompts Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* 1. Gemini Imagen 3 Prompt */}
                <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: 14, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={16} color="#6366f1" /> 🔷 PROMPT TẠO ẢNH GEMINI (KHÓA NÉT CHÌ 2D NỀN ĐEN HÌNH 1):
                    </span>
                    <button className="btn-secondary" onClick={() => handleCopyPrompt(geminiPrompt, `gemini_${idx}`)} style={{ padding: '4px 12px', fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.3)' }}>
                      {copiedKey === `gemini_${idx}` ? <><Check size={14} color="#10b981" /> Đã Copy!</> : <><Copy size={14} /> Copy Prompt Gemini</>}
                    </button>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.86rem', color: '#c7d2fe', lineHeight: 1.5, wordBreak: 'break-word', background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
                    {geminiPrompt}
                  </div>
                </div>

                {/* 2. ChatGPT DALL-E 3 Prompt */}
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: 14, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: '#6ee7b7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={16} color="#10b981" /> 🟢 PROMPT TẠO ẢNH CHATGPT (DALL-E 3 NÉT CHÌ 2D):
                    </span>
                    <button className="btn-secondary" onClick={() => handleCopyPrompt(chatgptPrompt, `chatgpt_${idx}`)} style={{ padding: '4px 12px', fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.3)' }}>
                      {copiedKey === `chatgpt_${idx}` ? <><Check size={14} color="#10b981" /> Đã Copy!</> : <><Copy size={14} /> Copy Prompt ChatGPT</>}
                    </button>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.86rem', color: '#a7f3d0', lineHeight: 1.5, wordBreak: 'break-word', background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
                    {chatgptPrompt}
                  </div>
                </div>

                {/* 3. Veo3 / Sora Video Prompt */}
                <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: 14, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: '#06b6d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Zap size={16} color="#06b6d4" /> ⚡ PROMPT TẠO VIDEO VEO3 / SORA (MOTION 24FPS):
                    </span>
                    <button className="btn-secondary" onClick={() => handleCopyPrompt(veo3Prompt, `veo3_${idx}`)} style={{ padding: '4px 12px', fontSize: '0.78rem', background: 'rgba(6, 182, 212, 0.3)' }}>
                      {copiedKey === `veo3_${idx}` ? <><Check size={14} color="#10b981" /> Đã Copy!</> : <><Copy size={14} /> Copy Veo3 Prompt</>}
                    </button>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.86rem', color: '#67e8f9', lineHeight: 1.5, wordBreak: 'break-word', background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
                    {veo3Prompt}
                  </div>
                </div>

                {/* Negative Prompt */}
                <div style={{ fontSize: '0.78rem', color: '#fca5a5', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <strong>🚫 Từ khóa cấm (Negative Prompt):</strong> {negativePrompt}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
