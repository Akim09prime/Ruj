
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useI18n } from '../../lib/i18n';

export const AIExpert: React.FC = () => {
  const { lang } = useI18n();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<{web: {uri: string, title: string}}[]>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResponse('');
    setSources([]);

    try {
      // Fix: Initialize with named parameter apiKey as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // Fix: Use ai.models.generateContent directly with correct model and parameter structure
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [{
            text: `You are the technical expert at CARVELLO, a CNC and premium furniture brand. 
            Answer this customer question with professional precision: ${query}. 
            Focus on technical details of MDF, CNC, 2K finishes, and custom assembly. 
            Answer in ${lang === 'ro' ? 'Romanian' : 'English'}.`
          }]
        }],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      // Fix: Use .text property instead of text()
      setResponse(res.text || '');
      
      // Fix: Extract grounding metadata from candidates and groundingChunks
      const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          web: {
            uri: c.web.uri,
            title: c.web.title
          }
        }));
      setSources(webSources);
    } catch (err) {
      console.error(err);
      setResponse(lang === 'ro' ? "Eroare la conectarea cu expertul AI." : "Error connecting to the AI expert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border p-12 shadow-sm max-w-4xl mx-auto">
      <h3 className="font-serif text-3xl mb-8">{lang === 'ro' ? 'Întreabă Expertul Tehnic (AI)' : 'Ask the Technical Expert (AI)'}</h3>
      <p className="text-muted mb-8 font-light">
        {lang === 'ro' 
          ? 'Ai întrebări tehnice despre frezarea CNC, finisaje 2K sau materiale? Expertul nostru AI îți oferă răspunsuri documentate în timp real.' 
          : 'Have technical questions about CNC milling, 2K finishes, or materials? Our AI expert provides documented answers in real-time.'}
      </p>
      
      <form onSubmit={handleAsk} className="flex flex-col space-y-4 mb-10">
        <textarea 
          placeholder={lang === 'ro' ? "Ex: Care sunt avantajele vopsirii 2K față de melamină?" : "Ex: What are the benefits of 2K paint vs melamine?"}
          className="w-full bg-surface-2 border border-border p-4 h-32 focus:border-accent outline-none"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button 
          disabled={loading}
          className="bg-accent text-white py-4 uppercase font-bold tracking-widest text-xs hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (lang === 'ro' ? 'Consultare...' : 'Consulting...') : (lang === 'ro' ? 'Cere Expertiză' : 'Ask Expertise')}
        </button>
      </form>

      {response && (
        <div className="animate-fade-in">
          <div className="prose dark:prose-invert max-w-none text-muted leading-relaxed bg-surface-2 p-8 border-l-2 border-accent whitespace-pre-wrap">
            {response}
          </div>
          {sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">
                {lang === 'ro' ? 'Surse de Documentare:' : 'Documentation Sources:'}
              </h4>
              <div className="flex flex-wrap gap-4">
                {sources.map((s, i) => (
                  <a key={i} href={s.web.uri} target="_blank" rel="noreferrer" className="text-[10px] underline text-muted hover:text-accent truncate max-w-[200px]">
                    {s.web.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
