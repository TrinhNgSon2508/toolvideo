import React, { useState } from 'react';
import { Copy, Check, Download, Film, Sparkles, Video, Zap } from 'lucide-react';

export default function Veo3Studio({ veo3Data }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!veo3Data || !veo3Data.scenes) return null;

  const handleCopyPrompt = (promptText, index) => {
    navigator.clipboard.writeText(promptText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadAllPrompts = () => {
    let fullText = `# 🚀 BỘ PROMPT VEO3 / SORA XÂY KÊNH CHUẨN NHẤT QUÁN\n\n`;
    fullText += `📌 Kênh: ${veo3Data.channelName || 'Kênh Mới'}\n`;
    fullText += `📌 Chủ đề: ${veo3Data.channelConcept || ''}\n`;
    fullText += `🎨 Master Style Prompt: ${veo3Data.masterStylePrompt || ''}\n\n`;
    fullText += `---------------------------------------------------\n\n`;

    veo3Data.scenes.forEach((sc) => {
      fullText += `🎬 CẢNH ${sc.sceneNumber} (${sc.timestamp})\n`;
      fullText += `🗣️ Voiceover: ${sc.voiceover}\n`;
      fullText += `🖼️ Mô tả tiếng Việt: ${sc.visualDescriptionVi}\n`;
      fullText += `⚡ PROMPT VEO3 (ENGLISH):\n${sc.veo3Prompt}\n`;
      fullText += `🚫 Negative Prompt: ${sc.negativePrompt || 'blurry, static'}\n\n`;
      fullText += `---------------------------------------------------\n\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `bo_prompt_veo3_xao_nau_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="transcript-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: '#ec4899' }}>
            <Film size={24} /> Bộ Prompt Veo3 / Sora Chuẩn Từng Cảnh Video
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 4 }}>
            Đã chia nhỏ kịch bản mới thành từng phân cảnh ngắn kèm Prompt Tiếng Anh chuẩn điện ảnh cho Google Veo 3 / Sora.
          </p>
        </div>

        <div className="actions-group">
          <button className="btn-secondary" onClick={handleDownloadAllPrompts}>
            <Download size={16} /> Tải Bộ Prompt (.md)
          </button>
        </div>
      </div>

      {/* Master Channel Banner */}
      <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: 18, borderRadius: 14, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '0.95rem', marginBottom: 4 }}>
          📺 Định Hướng Kênh: {veo3Data.channelName || 'Kênh Video Chủ Đề'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
          {veo3Data.channelConcept}
        </div>
      </div>

      {/* Scenes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {veo3Data.scenes.map((sc, idx) => (
          <div key={idx} style={{ background: 'rgba(8, 12, 23, 0.95)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, color: '#06b6d4', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Video size={18} /> Cảnh {sc.sceneNumber} ({sc.timestamp})
              </span>
              <button className="btn-secondary" onClick={() => handleCopyPrompt(sc.veo3Prompt, idx)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                {copiedIndex === idx ? <><Check size={14} color="#10b981" /> Đã Copy Prompt!</> : <><Copy size={14} /> Copy Prompt Veo3</>}
              </button>
            </div>

            <div style={{ marginBottom: 10, fontSize: '0.88rem', color: '#e5e7eb' }}>
              <strong>🗣️ Lời thoại Voiceover:</strong> "{sc.voiceover}"
            </div>

            <div style={{ marginBottom: 12, fontSize: '0.85rem', color: '#9ca3af' }}>
              <strong>🖼️ Mô tả hình ảnh:</strong> {sc.visualDescriptionVi}
            </div>

            {/* Veo3 English Prompt Box */}
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={14} /> FULL VEO3 / SORA PROMPT (ENGLISH):
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#67e8f9', lineHeight: 1.5, wordBreak: 'break-word' }}>
                {sc.veo3Prompt}
              </div>
              {sc.negativePrompt && (
                <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#fca5a5' }}>
                  <strong>Negative Prompt:</strong> {sc.negativePrompt}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
