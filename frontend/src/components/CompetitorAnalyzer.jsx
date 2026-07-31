import React, { useState } from 'react';
import { Eye, Film, Mic, Palette, Sparkles, Check, Copy, Wand2, PlayCircle, Trophy, ShieldAlert, Zap, Compass } from 'lucide-react';

export default function CompetitorAnalyzer({ analysis, onGenerateVeo3, isGeneratingVeo3 }) {
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('pillars'); // 'pillars' | 'outperform'

  if (!analysis) return null;

  const { videoAnalysis = {}, visualStyleAnalysis = {}, voiceAnalysis = {}, outperformStrategy = {} } = analysis;

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(visualStyleAnalysis.masterStylePrompt || '');
    setCopiedMasterPrompt(true);
    setTimeout(() => setCopiedMasterPrompt(false), 2000);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="transcript-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: '#06b6d4' }}>
            <Eye size={26} /> Báo Cáo Phân Tích Video Đối Thủ & Bản Đút Rút Vượt Trội
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 4 }}>
            Mổ xẻ 3 trụ cột: <strong>Video chuyển động</strong>, <strong>Hình ảnh phong cách</strong> và <strong>Giọng đọc/Âm thanh</strong> để tạo ra sản phẩm hoàn chỉnh hơn đối thủ.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className={`btn-secondary ${activeTab === 'pillars' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('pillars')}
            style={{ borderRadius: 20, padding: '6px 14px', fontSize: '0.82rem' }}
          >
            Phân Tích 3 Trụ Cột
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'outperform' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('outperform')}
            style={{ borderRadius: 20, padding: '6px 14px', fontSize: '0.82rem', background: activeTab === 'outperform' ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : '' }}
          >
            <Trophy size={14} /> Chiến Lược Vượt Trội Đối Thủ
          </button>
        </div>
      </div>

      {activeTab === 'pillars' ? (
        <div>
          <div className="studio-grid" style={{ marginBottom: 24 }}>
            {/* Pillar 1: Video & Motion */}
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: 20, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#06b6d4', marginBottom: 12 }}>
                <Film size={20} /> 1. VIDEO & CHUYỂN ĐỘNG (MOTION)
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Định dạng Video:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{videoAnalysis.visualFormat || 'Video AI Motion'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Góc quay Camera:</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{videoAnalysis.motionType || 'Cinematic Pan / Tracking'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Nhịp độ đổi cảnh (Pacing):</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{videoAnalysis.pacing || 'Dồn dập 2-3s'}</div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#a5b4fc', background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 8 }}>
                💡 <strong>Kỹ thuật giữ chân:</strong> {videoAnalysis.retentionTechnique || 'Pattern Interrupt'}
              </div>
            </div>

            {/* Pillar 2: Visual & Image Style */}
            <div style={{ background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', padding: 20, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#ec4899', marginBottom: 12 }}>
                <Palette size={20} /> 2. HÌNH Ảnh & TÔNG MÀU (VISUAL STYLE)
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tông màu & Ánh sáng:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{visualStyleAnalysis.colorGrading || 'Dark Moody Cinematic'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Phong cách Nhân vật & Bối cảnh:</span>
                <div style={{ fontSize: '0.88rem', color: '#e5e7eb', lineHeight: 1.4 }}>{visualStyleAnalysis.subjectAndEnvironment || 'Nhân vật AI chi tiết 8k'}</div>
              </div>
            </div>

            {/* Pillar 3: Voiceover & Audio */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: 20, borderRadius: 14, gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#f59e0b', marginBottom: 12 }}>
                <Mic size={20} /> 3. GIỌNG ĐỌC AI & ÂM THANH (VOICEOVER & BGM)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Gợi ý Giọng đọc (TTS):</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{voiceAnalysis.recommendedGenderAndDialect || 'Giọng Nam Bắc trầm ấm'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tông cảm xúc:</span>
                  <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{voiceAnalysis.toneAndEmotion || 'Drama lôi cuốn'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tốc độ & Âm thanh (BGM/SFX):</span>
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{voiceAnalysis.bgmAndSfxRecommendation || 'Nhạc Epic Cinematic + SFX Riser'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Visual Style Prompt Box */}
          <div style={{ background: 'rgba(8, 12, 23, 0.95)', border: '1px solid var(--border-glow)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> Master Visual Prompt Tiếng Anh (Tạo ảnh/video đồng bộ 100% cho kênh):
              </span>
              <button className="btn-secondary" onClick={handleCopyMasterPrompt} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                {copiedMasterPrompt ? <><Check size={14} color="#10b981" /> Đã chép!</> : <><Copy size={14} /> Copy Master Prompt</>}
              </button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#67e8f9', background: 'rgba(0,0,0,0.5)', padding: 14, borderRadius: 8, lineHeight: 1.5, wordBreak: 'break-word' }}>
              {visualStyleAnalysis.masterStylePrompt || '8k photorealistic cinematic lighting, ultra-detailed Unreal Engine 5 render'}
            </div>
          </div>
        </div>
      ) : (
        /* Outperform Strategy Tab */
        <div style={{ marginBottom: 24 }}>
          {/* Competitor Weakness Alert */}
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 18, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#fca5a5', marginBottom: 6 }}>
              <ShieldAlert size={20} /> ⚠️ ĐIỂM YẾU CỦA ĐỐI THỦ (CƠ HỘI ĐỂ BẠN VƯỢT TRỘI):
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
              {outperformStrategy.competitorWeakness || 'Cần tối ưu lại kịch bản mở đầu và hình ảnh sắc nét hơn.'}
            </div>
          </div>

          {/* 5 Key Improvements */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: 20, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#10b981', marginBottom: 14 }}>
              <Trophy size={20} /> 🏆 5 BÍ QUYẾT ĐỂ VIDEO CỦA BẠN HOÀN CHỈNH & ĐẲNG CẤP HƠN:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {outperformStrategy.fiveImprovementKeys && Array.isArray(outperformStrategy.fiveImprovementKeys) ? (
                outperformStrategy.fiveImprovementKeys.map((keyStr, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 10, fontSize: '0.9rem', color: '#e5e7eb' }}>
                    <Zap size={16} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{keyStr}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#e5e7eb' }}>Tối ưu lại Hook 3 giây, nâng cấp nhịp độ cắt cảnh và dùng giọng đọc AI truyền cảm hơn.</div>
              )}
            </div>
          </div>

          {/* Action Plan */}
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: 18, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc', marginBottom: 6 }}>
              <Compass size={18} /> 📌 HÀNH ĐỘNG CỤ THỂ DỰNG VIDEO VƯỢT TRỘI:
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
              {outperformStrategy.actionPlanSummary || 'Sử dụng bộ Prompt Veo3 bên dưới để tạo video cực nét và áp dụng giọng đọc AI đã gợi ý.'}
            </div>
          </div>
        </div>
      )}

      {/* Veo3 Prompts Trigger Button */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
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
