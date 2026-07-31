import React, { useState } from 'react';
import { Eye, Film, Mic, Palette, Sparkles, Check, Copy, Wand2, PlayCircle, Trophy, ShieldAlert, Zap, Compass, Dna } from 'lucide-react';

export default function CompetitorAnalyzer({ analysis, onGenerateVeo3, isGeneratingVeo3 }) {
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('pillars'); // 'pillars' | 'outperform'

  if (!analysis) return null;

  const { videoAnalysis = {}, visualStyleAnalysis = {}, voiceAnalysis = {}, outperformStrategy = {}, visualDNA = {} } = analysis;

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
            <Eye size={26} /> Báo Cáo Phân Tích Visual DNA Đối Thủ & Bản Đút Rút Vượt Trội
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 4 }}>
            Mổ xẻ <strong>Visual DNA đối thủ</strong> (Nhân vật, Bối cảnh, Tông màu) để Prompt sinh ảnh Gemini/ChatGPT <strong>BÁM SÁT 100% GIỐNG VIDEO ĐỐI THỦ</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className={`btn-secondary ${activeTab === 'pillars' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('pillars')}
            style={{ borderRadius: 20, padding: '6px 14px', fontSize: '0.82rem' }}
          >
            Visual DNA & 3 Trụ Cột
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
          {/* Visual DNA Banner Section */}
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.35)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.05rem', color: '#06b6d4', marginBottom: 12 }}>
              <Dna size={22} color="#06b6d4" /> 🧬 BÓC TÁCH VISUAL DNA CỦA ĐỐI THỦ (KHÓA PROMPT ẢNH GIỐNG 100%):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>👤 Chủ thể / Nhân vật đặc trưng:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.characterSubjectDetails || 'Nhân vật AI đặc trưng'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>🏞️ Bối cảnh & Không gian:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.environmentAndSetting || 'Bối cảnh studio hiện đại'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>🎨 Tông màu & Ánh sáng:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.colorPaletteAndLighting || 'Cinematic Lighting 8k'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>📐 Khung hình & Góc quay:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.cameraFramingStyle || 'Khung hình dọc 9:16'}</div>
              </div>
            </div>
          </div>

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
            </div>

            {/* Pillar 2: Voiceover & Audio */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: 20, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#f59e0b', marginBottom: 12 }}>
                <Mic size={20} /> 2. GIỌNG ĐỌC AI & ÂM THANH
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Gợi ý Giọng đọc (TTS):</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{voiceAnalysis.recommendedGenderAndDialect || 'Giọng Nam Bắc trầm ấm'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tông cảm xúc:</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{voiceAnalysis.toneAndEmotion || 'Drama lôi cuốn'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>BGM & SFX:</span>
                <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{voiceAnalysis.bgmAndSfxRecommendation || 'Nhạc Epic Cinematic + SFX Riser'}</div>
              </div>
            </div>
          </div>

          {/* Master Visual Style Prompt Box */}
          <div style={{ background: 'rgba(8, 12, 23, 0.95)', border: '1px solid var(--border-glow)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> Master Visual DNA Prompt Tiếng Anh (Tạo ảnh bám sát 100% giống đối thủ):
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
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 18, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#fca5a5', marginBottom: 6 }}>
              <ShieldAlert size={20} /> ⚠️ ĐIỂM YẾU CỦA ĐỐI THỦ (CƠ HỘI ĐỂ BẠN VƯỢT TRỘI):
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
              {outperformStrategy.competitorWeakness || 'Cần tối ưu lại kịch bản mở đầu và hình ảnh sắc nét hơn.'}
            </div>
          </div>

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

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: 18, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc', marginBottom: 6 }}>
              <Compass size={18} /> 📌 HÀNH ĐỘNG CỤ THỂ DỰNG VIDEO VƯỢT TRỘI:
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
              {outperformStrategy.actionPlanSummary || 'Sử dụng bộ Prompt Gemini/ChatGPT bên dưới để tạo ảnh bám sát đối thủ và áp dụng giọng đọc AI đã gợi ý.'}
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
            <><div className="spinner"></div> Đang Xuất Bộ Prompt Bám Sát Visual DNA Đối Thủ...</>
          ) : (
            <><Wand2 size={18} /> Xuất Bộ Prompt Tạo Ảnh (Gemini/ChatGPT) Bám Sát Đối Thủ 100%</>
          )}
        </button>
      </div>
    </div>
  );
}
