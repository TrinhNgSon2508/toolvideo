import React, { useState } from 'react';
import { Eye, Film, Mic, Palette, Sparkles, Check, Copy, Wand2, PlayCircle, Trophy, ShieldAlert, Zap, Compass, Dna, Sparkle } from 'lucide-react';

export default function CompetitorAnalyzer({ analysis, onGenerateVeo3, isGeneratingVeo3 }) {
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('pillars');

  if (!analysis) return null;

  const { videoAnalysis = {}, visualStyleAnalysis = {}, voiceAnalysis = {}, outperformStrategy = {}, visualDNA = {} } = analysis;
  const detectedStyleName = analysis.detectedArtMedium || visualStyleAnalysis.colorGrading || 'Phong cách nghệ thuật đối thủ';
  const masterStylePrompt = analysis.extractedVisualStylePrompt || visualStyleAnalysis.masterStylePrompt || '';

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(masterStylePrompt);
    setCopiedMasterPrompt(true);
    setTimeout(() => setCopiedMasterPrompt(false), 2000);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="transcript-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: '#06b6d4' }}>
            <Eye size={26} /> Báo Cáo Phân Tích & Nhân Bản Style Đối Thủ Trực Tiếp
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 4 }}>
            AI tự động bóc tách và nhân bản 100% phong cách nghệ thuật của video đối thủ vào bộ Prompt Gemini/ChatGPT.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className={`btn-secondary ${activeTab === 'pillars' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('pillars')}
            style={{ borderRadius: 20, padding: '6px 14px', fontSize: '0.82rem' }}
          >
            Visual DNA & Phong Cách
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'outperform' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('outperform')}
            style={{ borderRadius: 20, padding: '6px 14px', fontSize: '0.82rem', background: activeTab === 'outperform' ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : '' }}
          >
            <Trophy size={14} /> Chiến Lược Vượt Trội
          </button>
        </div>
      </div>

      {/* Auto Cloned Style Banner */}
      <div style={{ background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.4)', padding: 18, borderRadius: 14, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ec4899', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkle size={20} color="#ec4899" /> PHONG CÁCH NGHỆ THUẬT BÓC TÁCH TỪ ĐỐI THỦ:
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          ✨ {detectedStyleName}
        </div>
        <p style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>
          Mọi Prompt sinh ảnh cho <strong>Google Gemini (Imagen 3)</strong> và <strong>ChatGPT (DALL-E 3)</strong> bên dưới sẽ tự động bám sát 100% đúng phong cách nghệ thuật này của đối thủ!
        </p>
      </div>

      {activeTab === 'pillars' ? (
        <div>
          {/* Visual DNA Banner Section */}
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.35)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.05rem', color: '#06b6d4', marginBottom: 12 }}>
              <Dna size={22} color="#06b6d4" /> 🧬 BÓC TÁCH VISUAL DNA CỦA ĐỐI THỦ:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>👤 Nhân vật / Chủ thể đối thủ:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.characterSubjectDetails || 'Nhân vật đối thủ'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>🏞️ Bối cảnh & Không gian:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.environmentAndSetting || 'Bối cảnh đối thủ'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>🎨 Tông màu & Ánh sáng:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.colorPaletteAndLighting || 'Ánh sáng đối thủ'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>📐 Khung hình & Góc quay:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.cameraFramingStyle || 'Tỉ lệ 9:16'}</div>
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
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{videoAnalysis.visualFormat || 'Video Motion'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Góc quay Camera:</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{videoAnalysis.motionType || 'Cinematic Pan / Zoom'}</div>
              </div>
            </div>

            {/* Pillar 2: Voiceover & Audio */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: 20, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#f59e0b', marginBottom: 12 }}>
                <Mic size={20} /> 2. GIỌNG ĐỌC AI & ÂM THANH
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Giọng đọc (TTS):</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{voiceAnalysis.recommendedGenderAndDialect || 'Giọng đọc AI phù hợp'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tông cảm xúc:</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{voiceAnalysis.toneAndEmotion || 'Kể chuyện truyền cảm'}</div>
              </div>
            </div>
          </div>

          {/* Master Visual Style Prompt Box */}
          <div style={{ background: 'rgba(8, 12, 23, 0.95)', border: '1px solid var(--border-glow)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> Master Style Prompt Nhân Bản 100% Từ Video Đối Thủ:
              </span>
              <button className="btn-secondary" onClick={handleCopyMasterPrompt} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                {copiedMasterPrompt ? <><Check size={14} color="#10b981" /> Đã chép!</> : <><Copy size={14} /> Copy Master Prompt</>}
              </button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#67e8f9', background: 'rgba(0,0,0,0.5)', padding: 14, borderRadius: 8, lineHeight: 1.5, wordBreak: 'break-word' }}>
              {masterStylePrompt || 'photorealistic 8k, cinematic lighting'}
            </div>
          </div>
        </div>
      ) : (
        /* Outperform Strategy Tab */
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 18, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: '#fca5a5', marginBottom: 6 }}>
              <ShieldAlert size={20} /> ⚠️ ĐIỂM YẾU CỦA ĐỐI THỦ:
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
              {outperformStrategy.competitorWeakness || 'Cần tối ưu lại kịch bản mở đầu và hình ảnh sắc nét hơn.'}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: 20, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#10b981', marginBottom: 14 }}>
              <Trophy size={20} /> 🏆 5 BÍ QUYẾT ĐỂ VIDEO CỦA BẠN VƯỢT TRỘI HƠN:
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
                <div style={{ color: '#e5e7eb' }}>Tối ưu lại Hook 3 giây, áp dụng bóc tách nhân bản phong cách nghệ thuật đối thủ.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button 
          className="btn-primary" 
          onClick={onGenerateVeo3}
          disabled={isGeneratingVeo3}
          style={{ margin: '0 auto', padding: '14px 36px', background: 'linear-gradient(135deg, #ec4899, #6366f1)', boxShadow: '0 0 25px rgba(236, 72, 153, 0.4)' }}
        >
          {isGeneratingVeo3 ? (
            <><div className="spinner"></div> Đang Nhân Bản Bộ Prompt Bám Sát Video Đối Thủ...</>
          ) : (
            <><Wand2 size={18} /> Xuất Bộ Prompt Ảnh (Gemini/ChatGPT) Nhân Bản Style Đối Thủ 100%</>
          )}
        </button>
      </div>
    </div>
  );
}
