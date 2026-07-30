import React, { useState } from 'react';
import { Link, UploadCloud, Sparkles, FileAudio, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function InputSection({ onProcessUrl, onProcessFile, isLoading, loadingStatus }) {
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputMode, setInputMode] = useState('url'); // 'url' | 'file'
  const [errorMsg, setErrorMsg] = useState('');

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn video (YouTube, TikTok, Facebook...)');
      return;
    }
    setErrorMsg('');
    onProcessUrl(url.trim());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setErrorMsg('Dung lượng file tối đa là 100MB!');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const handleFileSubmit = () => {
    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn file video/audio từ thiết bị!');
      return;
    }
    setErrorMsg('');
    onProcessFile(selectedFile);
  };

  const setExampleUrl = (example) => {
    setUrl(example);
    setErrorMsg('');
  };

  return (
    <div className="glass-panel input-card">
      <div className="section-head">
        <h2>Nhập Nguồn Video Của Bạn</h2>
        <p>Hỗ trợ đường dẫn YouTube, TikTok, Facebook hoặc Tải trực tiếp file MP4/MP3 từ thiết bị (Khuyên dùng)</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          className={`btn-secondary ${inputMode === 'url' ? 'btn-primary' : ''}`}
          onClick={() => { setInputMode('url'); setErrorMsg(''); }}
          style={{ borderRadius: 30 }}
        >
          <Link size={16} /> Link Video (YT / TikTok / FB)
        </button>
        <button
          className={`btn-secondary ${inputMode === 'file' ? 'btn-primary' : ''}`}
          onClick={() => { setInputMode('file'); setErrorMsg(''); }}
          style={{ borderRadius: 30 }}
        >
          <UploadCloud size={16} /> Tải File Trực Tiếp (Siêu Nhanh & 100% Thành Công)
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '14px 18px', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 6 }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>
            💡 <strong>Giải pháp nhanh nhất:</strong> Hãy chuyển sang tab <strong style={{ color: '#06b6d4' }}>"Tải File Trực Tiếp"</strong> và chọn file MP4/MP3 từ máy tính/điện thoại. AI sẽ chép lời & xào nấu kịch bản ngay trong 1 giây mà không bị phụ thuộc vào chặn link Facebook!
          </div>
        </div>
      )}

      {inputMode === 'url' ? (
        <form onSubmit={handleUrlSubmit}>
          <div className="url-input-container">
            <div className="url-input-wrapper">
              <Link className="url-icon" size={20} />
              <input
                type="url"
                className="url-input"
                placeholder="Dán link YouTube, TikTok hoặc Facebook tại đây..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <><div className="spinner"></div> Đang xử lý...</>
              ) : (
                <><Sparkles size={18} /> Bắt Đầu Chép Lời</>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#9ca3af', flexWrap: 'wrap' }}>
            <span>Ví dụ thử nghiệm:</span>
            <button 
              type="button"
              className="btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={() => setExampleUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
            >
              YouTube Video
            </button>
            <button 
              type="button"
              className="btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              onClick={() => setExampleUrl('https://www.tiktok.com/@example/video/123456789')}
            >
              TikTok Video
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div 
            className="dropzone"
            onClick={() => document.getElementById('file-upload-input').click()}
            style={{ border: '2px dashed rgba(6, 182, 212, 0.4)', background: 'rgba(6, 182, 212, 0.04)' }}
          >
            <input 
              id="file-upload-input"
              type="file"
              accept="video/*,audio/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <div className="dropzone-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
              <FileAudio size={28} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4, color: '#fff' }}>
              {selectedFile ? selectedFile.name : 'Nhấp vào đây hoặc Kéo & thả file Video/Audio vào đây'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '⚡ 100% Thành công ngay lập tức - Hỗ trợ MP4, MP3, WAV, M4A'}
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <button 
              className="btn-primary" 
              onClick={handleFileSubmit} 
              disabled={isLoading || !selectedFile}
              style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              {isLoading ? (
                <><div className="spinner"></div> Đang xử lý...</>
              ) : (
                <><Zap size={18} /> Chép Lời & Xào Nấu Ngay</>
              )}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{ marginTop: 24, padding: 16, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="spinner" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#a5b4fc' }}>{loadingStatus || 'Đang xử lý dữ liệu...'}</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>AI đang tự động phân tích và tạo kịch bản mới cho bạn. Vui lòng chờ vài giây...</div>
          </div>
        </div>
      )}
    </div>
  );
}
