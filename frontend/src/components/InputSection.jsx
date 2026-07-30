import React, { useState } from 'react';
import { Link, UploadCloud, Sparkles, FileAudio, AlertCircle } from 'lucide-react';

export default function InputSection({ onProcessUrl, onProcessFile, isLoading, loadingStatus }) {
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputMode, setInputMode] = useState('url'); // 'url' | 'file'
  const [errorMsg, setErrorMsg] = useState('');

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn video (Facebook, YouTube, TikTok...)');
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
      setErrorMsg('Vui lòng chọn file video/audio từ máy tính!');
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
        <p>Hỗ trợ đường dẫn từ Facebook, YouTube, TikTok, Reels hoặc Tải trực tiếp file MP4/MP3 từ thiết bị</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          className={`btn-secondary ${inputMode === 'url' ? 'btn-primary' : ''}`}
          onClick={() => { setInputMode('url'); setErrorMsg(''); }}
          style={{ borderRadius: 30 }}
        >
          <Link size={16} /> Link Video (FB / YT / TikTok)
        </button>
        <button
          className={`btn-secondary ${inputMode === 'file' ? 'btn-primary' : ''}`}
          onClick={() => { setInputMode('file'); setErrorMsg(''); }}
          style={{ borderRadius: 30 }}
        >
          <UploadCloud size={16} /> Tải File Trực Tiếp
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '12px 16px', borderRadius: 10, fontSize: '0.88rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={18} /> {errorMsg}
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
                placeholder="Dán link Facebook, YouTube, TikTok hoặc Shorts tại đây..."
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
              onClick={() => setExampleUrl('https://www.facebook.com/watch/?v=123456789')}
            >
              Facebook Video
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
          >
            <input 
              id="file-upload-input"
              type="file"
              accept="video/*,audio/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <div className="dropzone-icon">
              <FileAudio size={24} />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
              {selectedFile ? selectedFile.name : 'Kéo & thả file Video/Audio vào đây'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Hỗ trợ MP4, MKV, MP3, WAV, M4A (Tối đa 100MB)'}
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <button 
              className="btn-primary" 
              onClick={handleFileSubmit} 
              disabled={isLoading || !selectedFile}
              style={{ marginLeft: 'auto' }}
            >
              {isLoading ? (
                <><div className="spinner"></div> Đang xử lý...</>
              ) : (
                <><Sparkles size={18} /> Chép Lời Từ File</>
              )}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{ marginTop: 24, padding: 16, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="spinner" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#a5b4fc' }}>{loadingStatus || 'Đang trích xuất dữ liệu âm thanh...'}</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>AI Gemini đang tự động lắng nghe và dịch chuẩn xác tiếng Việt. Vui lòng chờ vài giây...</div>
          </div>
        </div>
      )}
    </div>
  );
}
