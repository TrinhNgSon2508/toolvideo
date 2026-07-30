import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Check, Sparkles, FileCode } from 'lucide-react';

export default function ScriptComparison({ originalTranscript, rewrittenScript, onReGenerate }) {
  const [copiedVoiceover, setCopiedVoiceover] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [activeTab, setActiveTab] = useState('rewritten'); // 'rewritten' | 'sidebyside'

  const handleCopyVoiceover = () => {
    // Extract continuous voiceover part from markdown if present
    let textToCopy = rewrittenScript;
    const match = rewrittenScript.match(/## 📝 3\. LỜI THOẠI ĐỌC LIÊN MẠCH[\s\S]*?(?=## 💡|$)/i);
    if (match) {
      textToCopy = match[0].replace(/## 📝 3\. LỜI THOẠI ĐỌC LIÊN MẠCH/i, '').trim();
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedVoiceover(true);
    setTimeout(() => setCopiedVoiceover(false), 2000);
  };

  const handleCopyFullMarkdown = () => {
    navigator.clipboard.writeText(rewrittenScript);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([rewrittenScript], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `kich_ban_xao_nau_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSrt = () => {
    // Convert transcript into simple SRT subtitle format
    const lines = originalTranscript.split('\n').filter(l => l.trim());
    let srtContent = '';
    let counter = 1;

    lines.forEach((line, index) => {
      const timeMatch = line.match(/\[(\d{2}:\d{2})\]/);
      const timeStr = timeMatch ? timeMatch[1] : `00:${index * 3 < 10 ? '0' + index * 3 : index * 3}`;
      const text = line.replace(/\[\d{2}:\d{2}\]/, '').trim() || line;

      const startTime = `00:${timeStr}:00,000`;
      const endTime = `00:${timeStr}:03,000`;

      srtContent += `${counter}\n${startTime} --> ${endTime}\n${text}\n\n`;
      counter++;
    });

    const element = document.createElement('a');
    const file = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `subtitles_${Date.now()}.srt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="transcript-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={22} color="#ec4899" /> Kịch Bản Mới Đã Được Xào Nấu Hoàn Tất!
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginTop: 4 }}>
            Sẵn sàng để thu âm voiceover và dựng video viral của bạn.
          </p>
        </div>

        <div className="actions-group" style={{ flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleCopyVoiceover}>
            {copiedVoiceover ? <><Check size={16} color="#10b981" /> Đã chép!</> : <><Copy size={16} /> Sao Chép Lời Voiceover</>}
          </button>
          <button className="btn-secondary" onClick={handleDownloadMarkdown}>
            <Download size={16} /> Tải Markdown (.md)
          </button>
          <button className="btn-secondary" onClick={handleDownloadSrt}>
            <FileCode size={16} /> Xuất SRT Phụ Đề
          </button>
          <button className="btn-secondary" onClick={onReGenerate}>
            <RefreshCw size={16} /> Thử Style Khác
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button 
          className={`btn-secondary ${activeTab === 'rewritten' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('rewritten')}
          style={{ borderRadius: 20, padding: '6px 16px', fontSize: '0.85rem' }}
        >
          Kịch Bản Mới (Rewritten)
        </button>
        <button 
          className={`btn-secondary ${activeTab === 'sidebyside' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('sidebyside')}
          style={{ borderRadius: 20, padding: '6px 16px', fontSize: '0.85rem' }}
        >
          So Sánh Song Song Gốc vs Mới
        </button>
      </div>

      {activeTab === 'sidebyside' ? (
        <div className="comparison-container">
          <div>
            <h3 style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: 10 }}>📜 Lời thoại video gốc:</h3>
            <div className="transcript-box" style={{ maxHeight: 520, overflowY: 'auto' }}>
              {originalTranscript}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#ec4899', marginBottom: 10 }}>🚀 Kịch bản mới "xào nấu" bởi AI:</h3>
            <div className="script-output-panel" style={{ maxHeight: 520 }}>
              <FormattedMarkdown text={rewrittenScript} />
            </div>
          </div>
        </div>
      ) : (
        <div className="script-output-panel" style={{ maxHeight: 600 }}>
          <FormattedMarkdown text={rewrittenScript} />
        </div>
      )}
    </div>
  );
}

// Simple Markdown Renderer component
function FormattedMarkdown({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div>
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} style={{ fontSize: '1.4rem', color: '#6366f1', margin: '16px 0 10px 0' }}>{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} style={{ fontSize: '1.15rem', color: '#06b6d4', margin: '18px 0 8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4 }}>{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} style={{ fontSize: '1rem', color: '#ec4899', margin: '12px 0 6px 0' }}>{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={idx} style={{ marginLeft: 20, marginBottom: 4, color: '#e5e7eb' }}>{line.substring(2)}</li>;
        }
        if (line.startsWith('|')) {
          // simple table display
          return <div key={idx} style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#a5b4fc', whiteSpace: 'pre' }}>{line}</div>;
        }
        if (line.trim() === '---') {
          return <hr key={idx} style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />;
        }
        return <p key={idx} style={{ marginBottom: 6, color: '#d1d5db', lineHeight: 1.6 }}>{line}</p>;
      })}
    </div>
  );
}
