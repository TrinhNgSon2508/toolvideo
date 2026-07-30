import React, { useState } from 'react';
import { Wand2, Zap, BookOpen, ShoppingBag, GraduationCap, Smile, Sliders } from 'lucide-react';

export default function RewriteStudio({ onGenerateRewrite, isGenerating }) {
  const [selectedStyle, setSelectedStyle] = useState('tiktok_viral');
  const [targetDuration, setTargetDuration] = useState('60s');
  const [targetAudience, setTargetAudience] = useState('Khán giả trẻ (18-35 tuổi)');
  const [customPrompt, setCustomPrompt] = useState('');

  const styles = [
    {
      id: 'tiktok_viral',
      name: 'TikTok / Reels Viral',
      icon: <Zap size={22} color="#ec4899" />,
      desc: 'Hook 3s gây sốc + nhịp điệu dồn dập + CTA follow/mua hàng.'
    },
    {
      id: 'storytelling',
      name: 'Kể Chuyện (Drama)',
      icon: <BookOpen size={22} color="#06b6d4" />,
      desc: 'Ghi dấu ấn bằng cảm xúc, tình huống đời thường và bài học sâu sắc.'
    },
    {
      id: 'sales_aida',
      name: 'Bán Hàng (AIDA)',
      icon: <ShoppingBag size={22} color="#10b981" />,
      desc: 'Công thức 4 bước chuyển đổi cao: Chú ý -> Hứng thú -> Khao khát -> Chốt đơn.'
    },
    {
      id: 'expert_educational',
      name: 'Chuyên Gia / Bài Học',
      icon: <GraduationCap size={22} color="#f59e0b" />,
      desc: 'Giọng văn súc tích, uy tín, chia sẻ dạng 3 bí mật / bài học thực chiến.'
    },
    {
      id: 'humor_genz',
      name: 'Hài Hước Gen-Z',
      icon: <Smile size={22} color="#a855f7" />,
      desc: 'Bắt trend Gen-Z, dùng từ lóng tự nhiên, tạo tiếng cười sảng khoái.'
    },
    {
      id: 'custom',
      name: 'Tùy Chỉnh Riêng',
      icon: <Sliders size={22} color="#6366f1" />,
      desc: 'Tự do sáng tạo theo đúng yêu cầu chi tiết của bạn.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateRewrite({
      style: selectedStyle,
      targetDuration,
      targetAudience,
      customPrompt
    });
  };

  return (
    <div className="glass-panel transcript-card">
      <div className="section-head">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wand2 size={24} color="#ec4899" /> Studio Xào Nấu Kịch Bản AI
        </h2>
        <p>Lựa chọn phong cách và công thức viral để AI Gemini biến tấu kịch bản của bạn trở nên hấp dẫn gấp 10 lần!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="studio-grid" style={{ marginBottom: 28 }}>
          <div>
            <label style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 10, display: 'block' }}>
              1. Chọn Phong Cách (Style) Kịch Bản:
            </label>
            <div className="style-options">
              {styles.map((s) => (
                <div
                  key={s.id}
                  className={`style-card ${selectedStyle === s.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(s.id)}
                >
                  <div style={{ marginBottom: 8 }}>{s.icon}</div>
                  <div className="style-name">{s.name}</div>
                  <div className="style-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="form-group">
              <label>2. Thời Lượng Mục Tiêu:</label>
              <select 
                className="form-control"
                value={targetDuration}
                onChange={(e) => setTargetDuration(e.target.value)}
              >
                <option value="30s">Video Ngắn (30 Giây)</option>
                <option value="60s">Video Tiêu Chuẩn (60 Giây / 1 Phút)</option>
                <option value="3min">Video Dài Chuyên Sâu (3 Phút)</option>
                <option value="original">Giữ nguyên độ dài bài gốc</option>
              </select>
            </div>

            <div className="form-group">
              <label>3. Đối Tượng Khán Giả Mục Tiêu:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Gen Z, Dân văn phòng, Mẹ bỉm sữa, Người kinh doanh..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>4. Yêu Cầu Bổ Sung (Custom Prompt):</label>
              <textarea
                className="form-control"
                style={{ height: 95, resize: 'none' }}
                placeholder="Ví dụ: Thêm chi tiết hài hước về thời tiết Sài Gòn, nhắc tên thương hiệu X, nhấn mạnh ưu đãi giảm giá 50%..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isGenerating}
            style={{ margin: '0 auto', padding: '16px 36px', fontSize: '1.05rem', boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)', background: 'linear-gradient(135deg, #ec4899, #6366f1)' }}
          >
            {isGenerating ? (
              <><div className="spinner"></div> AI Đang Biến Tấu Kịch Bản...</>
            ) : (
              <><Wand2 size={20} /> Xào Nấu Kịch Bản Ngay</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
