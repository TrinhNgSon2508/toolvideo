import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import TranscriptView from './components/TranscriptView';
import RewriteStudio from './components/RewriteStudio';
import ScriptComparison from './components/ScriptComparison';
import { CheckCircle, AlertCircle, Zap } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [provider, setProvider] = useState('groq'); // 'groq' | 'gemini'
  const [apiKey, setApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');

  const [currentStep, setCurrentStep] = useState(1);

  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [extractedFilePath, setExtractedFilePath] = useState('');
  const [originalTranscript, setOriginalTranscript] = useState('');
  const [rewrittenScript, setRewrittenScript] = useState('');

  // Load API Keys and Provider from localStorage on startup
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('GEMINI_API_KEY');
    const savedGroqKey = localStorage.getItem('GROQ_API_KEY');
    const savedProvider = localStorage.getItem('AI_PROVIDER');

    if (savedGeminiKey) setApiKey(savedGeminiKey);
    if (savedGroqKey) setGroqApiKey(savedGroqKey);
    if (savedProvider) setProvider(savedProvider);
  }, []);

  const getActiveApiKey = () => {
    return provider === 'groq' ? groqApiKey : apiKey;
  };

  // Step 1 Handler: Download URL & Transcribe Audio
  const handleProcessUrl = async (url) => {
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setErrorMessage(`Vui lòng nhập ${provider === 'groq' ? 'Groq' : 'Gemini'} API Key trước khi bắt đầu! Click vào nút 'API Key' ở góc trên bên phải màn hình.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setLoadingStatus('1/2. Đang kết nối và trích xuất audio từ URL video...');

    try {
      const extractRes = await fetch(`${API_BASE}/extract-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const extractData = await extractRes.json();

      if (!extractRes.ok || !extractData.filePath) {
        throw new Error(extractData.error || 'Không thể tải audio từ URL này.');
      }

      setExtractedFilePath(extractData.filePath);
      
      setLoadingStatus(`2/2. ${provider === 'groq' ? 'Groq Whisper' : 'Gemini AI'} đang chép lời tiếng Việt...`);
      const transcribeRes = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: extractData.filePath,
          apiKey: activeKey,
          provider: provider
        })
      });
      const transcribeData = await transcribeRes.json();

      if (!transcribeRes.ok || !transcribeData.transcript) {
        throw new Error(transcribeData.error || 'Chép lời thất bại.');
      }

      setOriginalTranscript(transcribeData.transcript);
      setCurrentStep(2);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 Handler: Process uploaded File
  const handleProcessFile = async (file) => {
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setErrorMessage(`Vui lòng nhập ${provider === 'groq' ? 'Groq' : 'Gemini'} API Key trước khi bắt đầu!`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setLoadingStatus('1/2. Đang tải file video/audio lên máy chủ...');

    try {
      const formData = new FormData();
      formData.append('mediaFile', file);

      const uploadRes = await fetch(`${API_BASE}/upload-file`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.filePath) {
        throw new Error(uploadData.error || 'Upload file thất bại.');
      }

      setExtractedFilePath(uploadData.filePath);

      setLoadingStatus(`2/2. ${provider === 'groq' ? 'Groq Whisper' : 'Gemini AI'} đang chép lời tiếng Việt...`);
      const transcribeRes = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: uploadData.filePath,
          apiKey: activeKey,
          provider: provider
        })
      });
      const transcribeData = await transcribeRes.json();

      if (!transcribeRes.ok || !transcribeData.transcript) {
        throw new Error(transcribeData.error || 'Chép lời thất bại.');
      }

      setOriginalTranscript(transcribeData.transcript);
      setCurrentStep(2);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 Handler: Generate AI Rewrite Script
  const handleGenerateRewrite = async (options) => {
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setErrorMessage('Vui lòng kiểm tra lại API Key!');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setLoadingStatus(`${provider === 'groq' ? 'Groq Llama 3.3' : 'Gemini AI'} đang sáng tạo & xào nấu kịch bản mới...`);

    try {
      const res = await fetch(`${API_BASE}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalTranscript,
          style: options.style,
          targetDuration: options.targetDuration,
          targetAudience: options.targetAudience,
          customPrompt: options.customPrompt,
          apiKey: activeKey,
          provider: provider
        })
      });

      const data = await res.json();
      if (!res.ok || !data.rewrittenScript) {
        throw new Error(data.error || 'Lỗi xào nấu kịch bản AI.');
      }

      setRewrittenScript(data.rewrittenScript);
      setCurrentStep(4);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header 
        provider={provider}
        setProvider={setProvider}
        apiKey={apiKey} 
        setApiKey={setApiKey} 
        groqApiKey={groqApiKey}
        setGroqApiKey={setGroqApiKey}
      />

      {/* Navigation Progress Steps */}
      <nav className="steps-nav">
        <div 
          className={`step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <div className="step-num">{currentStep > 1 ? <CheckCircle size={16} /> : '1'}</div>
          <div className="step-title">1. Nhập Link / File Video</div>
        </div>

        <div 
          className={`step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
          onClick={() => originalTranscript && setCurrentStep(2)}
        >
          <div className="step-num">{currentStep > 2 ? <CheckCircle size={16} /> : '2'}</div>
          <div className="step-title">2. Lời Thoại Gốc</div>
        </div>

        <div 
          className={`step-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}
          onClick={() => originalTranscript && setCurrentStep(3)}
        >
          <div className="step-num">{currentStep > 3 ? <CheckCircle size={16} /> : '3'}</div>
          <div className="step-title">3. Studio Xào Nấu AI</div>
        </div>

        <div 
          className={`step-item ${currentStep === 4 ? 'active' : ''}`}
          onClick={() => rewrittenScript && setCurrentStep(4)}
        >
          <div className="step-num">4</div>
          <div className="step-title">4. Kịch Bản Mới & Export</div>
        </div>
      </nav>

      {/* Provider Recommendation Banner */}
      {provider === 'groq' && !groqApiKey && (
        <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', color: '#06b6d4', padding: '14px 20px', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={20} color="#06b6d4" />
            <span style={{ fontSize: '0.88rem', color: '#e5e7eb' }}>
              <strong>Khuyên dùng Groq AI Engine:</strong> Tốc độ cực nhanh (1 giây), chép lời tiếng Việt chuẩn xác và <strong>100% không bao giờ gặp lỗi 429 Quota Exceeded</strong>.
            </span>
          </div>
          <a 
            href="https://console.groq.com/keys" 
            target="_blank" 
            rel="noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 14px', background: '#06b6d4', color: '#000', fontWeight: 700, border: 'none' }}
          >
            Lấy Groq API Key Miễn Phí (5s)
          </a>
        </div>
      )}

      {/* Error Alert Display */}
      {errorMessage && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '16px 20px', borderRadius: 14, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={22} color="#ef4444" />
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'block', color: '#fff' }}>Thông báo lỗi!</strong>
              <span style={{ fontSize: '0.88rem' }}>{errorMessage}</span>
            </div>
          </div>
          <button 
            className="btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '4px 12px' }}
            onClick={() => setErrorMessage('')}
          >
            Đóng
          </button>
        </div>
      )}

      {/* Dynamic Step Panels */}
      {currentStep === 1 && (
        <InputSection 
          onProcessUrl={handleProcessUrl} 
          onProcessFile={handleProcessFile}
          isLoading={isLoading}
          loadingStatus={loadingStatus}
        />
      )}

      {currentStep === 2 && (
        <TranscriptView 
          transcript={originalTranscript}
          onUpdateTranscript={(newText) => setOriginalTranscript(newText)}
          onProceedToRewrite={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <RewriteStudio 
          onGenerateRewrite={handleGenerateRewrite}
          isGenerating={isLoading}
        />
      )}

      {currentStep === 4 && (
        <ScriptComparison 
          originalTranscript={originalTranscript}
          rewrittenScript={rewrittenScript}
          onReGenerate={() => setCurrentStep(3)}
        />
      )}
    </div>
  );
}
