import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import TranscriptView from './components/TranscriptView';
import RewriteStudio from './components/RewriteStudio';
import ScriptComparison from './components/ScriptComparison';
import CompetitorAnalyzer from './components/CompetitorAnalyzer';
import Veo3Studio from './components/Veo3Studio';
import { CheckCircle, AlertCircle, Eye, Sparkles, Wand2 } from 'lucide-react';
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

  // Competitor Visual Analysis & Veo3 Prompts State
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);
  const [veo3Data, setVeo3Data] = useState(null);
  const [isGeneratingVeo3, setIsGeneratingVeo3] = useState(false);

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

  /**
   * Browser-Side Auto Extractor: Directly fetches media stream via Client Browser
   * (Circumvents Cloud Serverless Data-Center IP blocks for Facebook Reels)
   */
  const tryClientSideBrowserExtract = async (targetUrl) => {
    try {
      console.log('[Browser Auto-Extractor] Attempting direct client media fetch for:', targetUrl);
      const res = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: targetUrl, isAudioOnly: true })
      });

      if (!res.ok) return null;
      const data = await res.json();

      const mediaUrl = data.url || (data.picker && data.picker[0] ? data.picker[0].url : null);
      if (!mediaUrl) return null;

      console.log('[Browser Auto-Extractor] Direct stream URL obtained, downloading Blob in browser...');
      const blobRes = await fetch(mediaUrl);
      const blob = await blobRes.blob();
      
      const file = new File([blob], `fb_auto_extract_${Date.now()}.mp3`, { type: blob.type || 'audio/mp3' });
      return file;
    } catch (err) {
      console.warn('[Browser Auto-Extractor] Client-side fetch failed, falling back to backend:', err.message);
      return null;
    }
  };

  // Step 1 Handler: Download URL & Transcribe Audio
  const handleProcessUrl = async (url) => {
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setErrorMessage(`Vui lòng nhập ${provider === 'groq' ? 'Groq' : 'Gemini'} API Key trước khi bắt đầu!`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setLoadingStatus('1/3. Trình duyệt đang tự động bóc tách stream âm thanh từ video...');

    // Attempt 1: Browser-Side Auto Extraction (Instant & Bypass Cloud IP block)
    const clientExtractedFile = await tryClientSideBrowserExtract(url);
    if (clientExtractedFile) {
      console.log('[Browser Auto-Extractor] Client extraction succeeded! Passing file directly...');
      await handleProcessFile(clientExtractedFile);
      return;
    }

    // Attempt 2: Server Backend Extraction
    try {
      setLoadingStatus('1/3. Đang kết nối server trích xuất audio từ đường dẫn...');
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
      
      setLoadingStatus(`2/3. ${provider === 'groq' ? 'Groq Whisper' : 'Gemini AI'} đang chép lời thoại...`);
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

      // Analyze competitor
      setLoadingStatus('3/3. AI đang phân tích Định dạng Visual, Loại chuyển động & Tông màu video đối thủ...');
      const analyzeRes = await fetch(`${API_BASE}/analyze-competitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcribeData.transcript,
          apiKey: activeKey,
          provider: provider
        })
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeRes.ok && analyzeData.analysis) {
        setCompetitorAnalysis(analyzeData.analysis);
      }

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
    setLoadingStatus('1/3. Đang tải file video đối thủ lên...');

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

      setLoadingStatus(`2/3. ${provider === 'groq' ? 'Groq Whisper' : 'Gemini AI'} đang chép lời thoại...`);
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

      // Analyze competitor
      setLoadingStatus('3/3. AI đang phân tích Định dạng Visual, Loại chuyển động & Tông màu video đối thủ...');
      const analyzeRes = await fetch(`${API_BASE}/analyze-competitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcribeData.transcript,
          apiKey: activeKey,
          provider: provider
        })
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeRes.ok && analyzeData.analysis) {
        setCompetitorAnalysis(analyzeData.analysis);
      }

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
    setLoadingStatus('AI đang sáng tạo kịch bản mới & cấu trúc kênh...');

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

  // Generate Veo3 Prompts Step with selected Art Style
  const handleGenerateVeo3Prompts = async (selectedArtStyle = 'blackboard_sketch') => {
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setErrorMessage('Vui lòng nhập API Key!');
      return;
    }

    setIsGeneratingVeo3(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE}/generate-veo3-prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData: competitorAnalysis || {},
          newScriptText: rewrittenScript || originalTranscript,
          selectedArtStyle: selectedArtStyle,
          apiKey: activeKey,
          provider: provider
        })
      });

      const data = await res.json();
      if (!res.ok || !data.veo3Data) {
        throw new Error(data.error || 'Không thể tạo bộ prompt Veo3.');
      }

      setVeo3Data(data.veo3Data);
      setCurrentStep(5);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsGeneratingVeo3(false);
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
      <nav className="steps-nav" style={{ flexWrap: 'wrap' }}>
        <div 
          className={`step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <div className="step-num">{currentStep > 1 ? <CheckCircle size={16} /> : '1'}</div>
          <div className="step-title">1. Link / File Đối Thủ</div>
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
          className={`step-item ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`}
          onClick={() => rewrittenScript && setCurrentStep(4)}
        >
          <div className="step-num">{currentStep > 4 ? <CheckCircle size={16} /> : '4'}</div>
          <div className="step-title">4. Phân Tích Visual Đối Thủ</div>
        </div>

        <div 
          className={`step-item ${currentStep === 5 ? 'active' : ''}`}
          onClick={() => veo3Data && setCurrentStep(5)}
        >
          <div className="step-num">5</div>
          <div className="step-title">5. Bộ Prompt Veo3 / Sora</div>
        </div>
      </nav>

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
        <div>
          <ScriptComparison 
            originalTranscript={originalTranscript}
            rewrittenScript={rewrittenScript}
            onReGenerate={() => setCurrentStep(3)}
          />
          <div style={{ marginTop: 24 }}>
            <CompetitorAnalyzer 
              analysis={competitorAnalysis}
              onGenerateVeo3={handleGenerateVeo3Prompts}
              isGeneratingVeo3={isGeneratingVeo3}
            />
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <Veo3Studio veo3Data={veo3Data} />
      )}
    </div>
  );
}
