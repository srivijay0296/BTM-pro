
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import * as ai from '../services/aiService';

const AILabPage: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'analysis' | 'global'>('visual');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setLoading(true);
        try {
          const base64 = await ai.fileToBase64(audioBlob);
          const transcription = await ai.transcribeAudio(base64, 'audio/webm');
          if (transcription) {
            setPrompt(prev => prev ? `${prev} ${transcription}` : transcription);
          }
        } catch (error) {
          console.error('Transcription failed:', error);
        }
        setLoading(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVisualGen = async () => {
    setLoading(true);
    try {
      if (prompt.toLowerCase().includes('video')) {
        const videoUrl = await ai.generateVideo(prompt, '16:9');
        setResult({ type: 'video', url: videoUrl });
      } else {
        const genAI = new (window as any).GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await genAI.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
        });
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) setResult({ type: 'image', url: `data:image/png;base64,${part.inlineData.data}` });
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      if (file) {
        const base64 = await ai.fileToBase64(file);
        const analysis = await ai.analyzeImage(base64, prompt || "Describe this fabric in detail.");
        setResult({ type: 'text', content: analysis });
      } else {
        const analysis = await ai.complexMarketAnalysis(prompt);
        setResult({ type: 'text', content: analysis });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResult = await ai.searchTextileHubs(prompt);
      setResult({ type: 'grounded', ...searchResult });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Lab <span className="text-indigo-600">Beta</span></h2>
          <p className="text-slate-500 mt-2 text-lg">Harness the power of Gemini to transform your textile business.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {['visual', 'analysis', 'global'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setResult(null); }}
              className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative">
            <h3 className="text-xl font-black text-slate-900 mb-6">Create with Prompt</h3>
            
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 pr-12 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-40 resize-none text-slate-700 font-medium"
                placeholder={activeTab === 'visual' ? "e.g. A 16:9 professional studio shot of organic denim fabric texture..." : "Describe what you want to analyze or search..."}
              />
              <button
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110' : 'bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                title="Hold to speak your prompt"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            
            {activeTab === 'analysis' && (
              <div className="mt-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Upload Image (Optional)</label>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            )}

            <button
              onClick={activeTab === 'visual' ? handleVisualGen : activeTab === 'analysis' ? handleAnalysis : handleSearch}
              disabled={loading || !prompt}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black mt-8 hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : <span>Process Request</span>}
            </button>
            
            {isRecording && (
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center mt-4 animate-pulse">Recording... Release to transcribe</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[500px] flex items-center justify-center p-10 overflow-hidden relative">
              {result.type === 'image' && <img src={result.url} className="max-w-full rounded-2xl shadow-2xl" />}
              {result.type === 'video' && <video src={result.url} controls className="max-w-full rounded-2xl shadow-2xl" />}
              {result.type === 'text' && (
                <div className="w-full max-h-full overflow-y-auto">
                   <div className="prose prose-slate max-w-none whitespace-pre-wrap font-medium text-slate-700 leading-relaxed">{result.content}</div>
                </div>
              )}
              {result.type === 'grounded' && (
                <div className="w-full space-y-6">
                  <p className="text-slate-800 font-medium leading-relaxed">{result.text}</p>
                  {result.chunks && (
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-sm font-black text-indigo-600 uppercase mb-4">Sources Found</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.chunks.map((chunk: any, i: number) => (
                          <a key={i} href={chunk.maps?.uri || chunk.web?.uri} target="_blank" className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center space-x-2">
                            <span>📍</span>
                            <span className="truncate">{chunk.maps?.title || chunk.web?.title || 'External Resource'}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 min-h-[500px] flex flex-col items-center justify-center text-center p-20">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                 <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-400">Your Generated Content Appears Here</h3>
              <p className="text-slate-400 max-w-xs mt-2">Try generating a high-res fabric photo or analyzing market trends for Cotton in 2025.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AILabPage;
