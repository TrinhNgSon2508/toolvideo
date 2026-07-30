import React, { useState } from 'react';
import { Video, Key, X, Check, ExternalLink, Cpu, Zap, ShieldCheck } from 'lucide-react';

export default function Header({ provider, setProvider, apiKey, setApiKey, groqApiKey, setGroqApiKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempGeminiKey, setTempGeminiKey] = useState(apiKey || '');
  const [tempGroqKey, setTempGroqKey] = useState(groqApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKeys = () => {
    setApiKey(tempGeminiKey);
    setGroqApiKey(tempGroqKey);
    localStorage.setItem('GEMINI_API_KEY', tempGeminiKey);
    localStorage.setItem('GROQ_API_KEY', tempGroqKey);
    localStorage.setItem('AI_PROVIDER', provider);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
    }, 1000);
  };

  const handleSelectProvider = (newProvider) => {
    setProvider(newProvider);
    localStorage.setItem('AI_PROVIDER', newProvider);
  };

  const activeKey = provider === 'groq' ? groqApiKey : apiKey;

  return (
    <>
      <header className="glass-panel header-bar">
        <div className="logo-group">
          <div className="logo-icon">
            <Video size={24} />
          </div>
          <div>
            <div className="logo-title">MediaScribe AI</div>
            <div className="logo-subtitle">Chép Lời Video & Xào Nấu Kịch Bản Viral</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Provider Switcher */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 30, padding: 4, display: 'flex', gap: 4 }}>
            <button
              onClick={() => handleSelectProvider('groq')}
              style={{
                background: provider === 'groq' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Zap size={14} color={provider === 'groq' ? '#fff' : '#06b6d4'} /> Groq AI (Khuyên dùng - Nhanh & Khắc phục lỗi Quota)
            </button>
            <button
              onClick={() => handleSelectProvider('gemini')}
              style={{
                background: provider === 'gemini' ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Cpu size={14} color={provider === 'gemini' ? '#fff' : '#a5b4fc'} /> Gemini AI
            </button>
          </div>

          <button 
            className="api-key-btn" 
            onClick={() => { 
              setTempGeminiKey(apiKey); 
              setTempGroqKey(groqApiKey); 
              setIsModalOpen(true); 
            }}
          >
            <Key size={16} />
            <span>API Key</span>
            <span className={`key-badge ${activeKey ? 'configured' : 'missing'}`}></span>
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="glass-panel modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={20} color="#06b6d4" /> Cấu hình API Engine
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Groq Key Input Section */}
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.92rem', color: '#06b6d4', marginBottom: 6 }}>
                <Zap size={18} /> Groq API Key (Không bao giờ bị lỗi 429 Quota Exceeded)
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 10 }}>
                Groq chạy mô hình <strong>Whisper Large v3</strong> chép lời thoại tiếng Việt chỉ mất 1 giây và <strong>Llama 3.3 70B</strong> xào nấu kịch bản 100% Free!
              </p>
              <input
                type="password"
                className="form-control"
                placeholder="gsk_..."
                value={tempGroqKey}
                onChange={e => setTempGroqKey(e.target.value)}
              />
              <div style={{ marginTop: 8, fontSize: '0.78rem' }}>
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#06b6d4', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  Lấy Groq API Key miễn phí ngay (Không cần thẻ ngân hàng) <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Gemini Key Input Section */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={16} color="#6366f1" /> Google Gemini API Key:
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="AIzaSy..."
                value={tempGeminiKey}
                onChange={e => setTempGeminiKey(e.target.value)}
              />
              <div style={{ marginTop: 6, fontSize: '0.78rem' }}>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#a5b4fc', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  Lấy Gemini API Key miễn phí tại Google AI Studio <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSaveKeys}
                style={{ padding: '8px 22px' }}
              >
                {savedSuccess ? <><Check size={16} /> Đã lưu!</> : 'Lưu Cấu Hình'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
