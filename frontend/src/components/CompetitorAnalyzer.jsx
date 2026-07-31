import React, { useState } from 'react';
import { Eye, Film, Mic, Palette, Sparkles, Check, Copy, Wand2, PlayCircle, Trophy, ShieldAlert, Zap, Compass, Dna, PenTool, Image, Sliders } from 'lucide-react';

export default function CompetitorAnalyzer({ analysis, onGenerateVeo3, isGeneratingVeo3 }) {
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('pillars'); // 'pillars' | 'outperform'
  const [selectedArtStyle, setSelectedArtStyle] = useState('blackboard_sketch'); // Default to pencil sketch

  if (!analysis) return null;

  const { videoAnalysis = {}, visualStyleAnalysis = {}, voiceAnalysis = {}, outperformStrategy = {}, visualDNA = {} } = analysis;

  const artStylePresets = [
    {
      id: 'blackboard_sketch',
      name: '✏️ Phác thảo nét chì nền đen (Giống Đối Thủ 100%)',
      desc: 'Nét vẽ phác thảo chì trắng trên nền bảng đen tối giản, phong cách 2D monochrome tràn đầy cảm xúc.',
      badge: 'ĐỐI THỦ ẢNH 1'
    },
    {
      id: 'minimalist_2d',
      name: '🎨 Hoạt hình 2D Tối giản (Flat Vector)',
      desc: 'Hình minh họa 2D phẳng, nét vẽ mượt mà, màu sắc hiện đại súc tích.'
    },
    {
      id: 'photorealistic_cinematic',
      name: '🖼️ 3D Photorealistic Điện ảnh 8K',
      desc: 'Ảnh chụp chân thực 8K, ánh sáng cinema 3D, độ sâu trường ảnh sâu.'
    },
    {
      id: 'cyberpunk_neon',
      name: '🤖 Cyberpunk Neon Đêm',
      desc: 'Ánh sáng neon tím & xanh rực rỡ trong bối cảnh tương lai huyền bí.'
    }
  ];

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
            <Eye size={26} /> Báo Cáo Phân Tích Visual DNA Đối Thủ & Khóa Phong Cách Nghệ Thuật
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: 4 }}>
            Khóa phong cách nghệ thuật chuẩn xác để Prompt sinh ảnh Gemini/ChatGPT <strong>BÁM SÁT 100% GIỐNG VIDEO ĐỐI THỦ</strong>.
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

      {/* Art Style Selector Section */}
      <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.4)', padding: 20, borderRadius: 14, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ec4899', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenTool size={20} /> CHỌN PHONG CÁCH NGHỆ THUẬT (ART STYLE LOCK):
        </div>
        <p style={{ fontSize: '0.85rem', color: '#e5e7eb', marginBottom: 16 }}>
          Chọn đúng phong cách để Prompt sinh ảnh Gemini / ChatGPT <strong>BÁM SÁT 100% GIỐNG VIDEO ĐỐI THỦ (Vẽ chì nền đen / 2D / 3D)</strong>:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {artStylePresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => setSelectedArtStyle(preset.id)}
              style={{
                background: selectedArtStyle === preset.id ? 'rgba(236, 72, 153, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                border: selectedArtStyle === preset.id ? '2px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                padding: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {preset.badge && (
                <span style={{ position: 'absolute', top: 10, right: 10, background: '#ec4899', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
                  {preset.badge}
                </span>
              )}
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: selectedArtStyle === preset.id ? '#fff' : '#d1d5db', marginBottom: 4 }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.4 }}>
                {preset.desc}
              </div>
            </div>
          ))}
        </div>
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
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>👤 Nhân vật / Phác thảo đặc trưng:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.characterSubjectDetails || 'Nhân vật 2D phác thảo chì trắng'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>🏞️ Bối cảnh & Không gian:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.environmentAndSetting || 'Nền đen phác thảo chì tối giản'}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700 }}>🎨 Tông màu & Ánh sáng:</span>
                <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: 4 }}>{visualDNA.colorPaletteAndLighting || 'Monochrome phác thảo trắng/đen'}</div>
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
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{videoAnalysis.visualFormat || 'Video 2D Sketch Motion'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Góc quay Camera:</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{videoAnalysis.motionType || 'Pan & Zoom nhẹ'}</div>
              </div>
            </div>

            {/* Pillar 2: Voiceover & Audio */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: 20, borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem', color: '#f59e0b', marginBottom: 12 }}>
                <Mic size={20} /> 2. GIỌNG ĐỌC AI & ÂM THANH
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Giọng đọc (TTS):</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{voiceAnalysis.recommendedGenderAndDialect || 'Giọng Nam/Nữ Bắc trầm ấm'}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tông cảm xúc:</span>
                <div style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{voiceAnalysis.toneAndEmotion || 'Kể chuyện cảm xúc'}</div>
              </div>
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
              {outperformStrategy.competitorWeakness || 'Cần tối ưu lại kịch bản mở đầu và hình ảnh nét phác thảo cảm xúc hơn.'}
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
                <div style={{ color: '#e5e7eb' }}>Tối ưu lại Hook 3 giây, dùng phong cách nét vẽ phác thảo chì trắng chuẩn bối cảnh.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button passing selectedArtStyle */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button 
          className="btn-primary" 
          onClick={() => onGenerateVeo3(selectedArtStyle)}
          disabled={isGeneratingVeo3}
          style={{ margin: '0 auto', padding: '14px 36px', background: 'linear-gradient(135deg, #ec4899, #6366f1)', boxShadow: '0 0 25px rgba(236, 72, 153, 0.4)' }}
        >
          {isGeneratingVeo3 ? (
            <><div className="spinner"></div> Đang Xuất Bộ Prompt Bám Sát Phong Cách {artStylePresets.find(p => p.id === selectedArtStyle)?.name}... </>
          ) : (
            <><Wand2 size={18} /> Xuất Bộ Prompt Ảnh (Gemini/ChatGPT) Bám Sát {artStylePresets.find(p => p.id === selectedArtStyle)?.name}</>
          )}
        </button>
      </div>
    </div>
  );
}
