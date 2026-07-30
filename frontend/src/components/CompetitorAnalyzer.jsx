import React, { useState } from 'react';
import { Eye, Film, Sparkles, Check, Copy, Wand2, PlayCircle, Layers, Palette } from 'lucide-react';

export default function CompetitorAnalyzer({ analysis, onGenerateVeo3, isGeneratingVeo3 }) {
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);

  if (!analysis) return null;

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(analysis.masterStylePrompt || '');
    setCopiedMasterPrompt(true);
    setTimeout(() => setCopiedMasterPrompt(false), 2000);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="section-head">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: '#06b6d4' }}>
          <Eye size={24} /> Báo Cáo Phân Tích Visual & Motion Video Đối Thủ
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>
          AI đã mổ xẻ định dạng hình ảnh, loại chuyển động và phong cách nghệ thuật của video đối thủ để lên chiến lược làm kênh mới.
        </p>
      </div>

      <div className="studio-grid" style={{ marginBottom: 24 }}>
        {/* Visual Format Card */}
        <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#06b6d4', marginBottom: 8 }}>
            <Film size={18} /> Định Dạng Hình Ảnh (Visual Format)
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {analysis.visualFormat || 'Video AI Motion Điện Ảnh'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
            Phân loại: Video dùng ảnh tĩnh ghép nhạc hay Video AI chuyển động 3D/Cinematic.
          </div>
        </div>

        {/* Motion Type Card */}
        <div style={{ background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#ec4899', marginBottom: 8 }}>
            <PlayCircle size={18} /> Loaị Chuyển Động & Góc Quay (Motion & Camera)
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {analysis.motionType || 'Cinematic Pan & Tracking Shot'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
            Góc quay: {analysis.pacing || 'Dồn dập 2-3s'}
          </div>
        </div>

        {/* Lighting & Style */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#f59e0b', marginBottom: 8 }}>
            <Palette size={18} /> Tông Màu & Ánh Sáng (Color & Lighting)
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {analysis.colorAndLighting || 'Dark Moody Cinematic'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
            Audience: {analysis.targetAudience || 'Khán giả đại chúng'}
          </div>
        </div>

        {/* Channel Strategy */}
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#10b981', marginBottom: 8 }}>
            <Layers size={18} /> Gợi Ý Chủ Đề Kênh Độc Quyền
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {analysis.channelThemeSuggestion || 'Kênh Storytelling Bí Ẩn'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
            Cách đối thủ giữ chân: {analysis.contentHookType || 'Hook gây tò mò'}
          </div>
        </div>
      </div>

      {/* Master Style Prompt */}
      <div style={{ background: 'rgba(8, 12, 23, 0.9)', border: '1px solid var(--border-glow)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} /> Master Style Prompt Tiếng Anh (Dùng nhất quán 100% cho mọi video trên kênh):
          </span>
          <button className="btn-secondary" onClick={handleCopyMasterPrompt} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
            {copiedMasterPrompt ? <><Check size={14} color="#10b981" /> Đã chép!</> : <><Copy size={14} /> Copy Master Prompt</>}
          </button>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#67e8f9', background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 8, lineHeight: 1.5 }}>
          {analysis.masterStylePrompt || '8k photorealistic cinematic lighting, ultra-detailed Unreal Engine 5 render'}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={onGenerateVeo3}
          disabled={isGeneratingVeo3}
          style={{ margin: '0 auto', padding: '14px 32px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
        >
          {isGeneratingVeo3 ? (
            <><div className="spinner"></div> Đang Xuất Bộ Prompt Veo3 Chi Tiết...</>
          ) : (
            <><Wand2 size={18} /> Xuất Bộ Prompt Veo3 / Sora Chuẩn Từng Cảnh Video</>
          )}
        </button>
      </div>
    </div>
  );
}
