import React, { useState } from 'react';
import { Copy, Download, Edit3, ArrowRight, Check, FileText } from 'lucide-react';

export default function TranscriptView({ transcript, onUpdateTranscript, onProceedToRewrite }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcript || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `loi_thoai_goc_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveEdit = () => {
    onUpdateTranscript(editedText);
    setIsEditing(false);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="transcript-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={22} color="#06b6d4" /> Văn Bản Lời Thoại Gốc (Raw Transcript)
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginTop: 4 }}>
            Lời thoại đã được Gemini AI trích xuất và chép chính xác từ video của bạn.
          </p>
        </div>

        <div className="actions-group">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <><Check size={16} color="#10b981" /> Đã chép!</> : <><Copy size={16} /> Sao Chép</>}
          </button>
          <button className="btn-secondary" onClick={handleDownloadTxt}>
            <Download size={16} /> Tải File TXT
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setEditedText(transcript);
                setIsEditing(true);
              }
            }}
          >
            <Edit3 size={16} /> {isEditing ? 'Lưu chỉnh sửa' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        {isEditing ? (
          <textarea
            className="transcript-box"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Nhập hoặc chỉnh sửa lời thoại tại đây..."
          />
        ) : (
          <div 
            className="transcript-box"
            style={{ whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: 400 }}
          >
            {transcript || 'Chưa có dữ liệu lời thoại.'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
          Tổng số từ: <strong>{transcript ? transcript.trim().split(/\s+/).length : 0} từ</strong>
        </div>

        <button className="btn-primary" onClick={onProceedToRewrite}>
          Tiến Hành Xào Nấu Kịch Bản AI <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
