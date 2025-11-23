import React, { useState, useCallback, useEffect } from 'react';
import { Wand2, Palette as PaletteIcon, Loader2, Sparkles, Languages } from 'lucide-react';
import { ColorItem, GenerateStatus, Language } from './types';
import { generatePalette } from './services/aiService';
import { translations } from './utils/i18n';
import ColorCard from './components/ColorCard';
import CodeInspector from './components/CodeInspector';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh');
  const t = translations[language];

  const [prompt, setPrompt] = useState('');
  const [colorCount, setColorCount] = useState<number>(6);
  const [palette, setPalette] = useState<ColorItem[]>(t.sampleColors);
  const [selectedColor, setSelectedColor] = useState<ColorItem>(t.sampleColors[0]);
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  // Update sample palette when language changes if user hasn't generated anything yet
  useEffect(() => {
    if (!isGenerated) {
      setPalette(t.sampleColors);
      setSelectedColor(t.sampleColors[0]);
    }
  }, [language, isGenerated]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setStatus('loading');
    try {
      const newPalette = await generatePalette(prompt, language, colorCount);
      setPalette(newPalette);
      setIsGenerated(true);
      if (newPalette.length > 0) {
        setSelectedColor(newPalette[0]);
      }
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setToastMessage(t.failedToGenerate);
    }
  }, [prompt, language, colorCount, t.failedToGenerate]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${t.copied} ${text}`);
    });
  }, [t.copied]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <PaletteIcon size={28} strokeWidth={2} />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{t.appTitle}<span className="text-blue-600">{t.tagline}</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span className="hidden md:inline">{t.poweredBy}</span>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors border border-gray-200"
              title="Switch Language"
            >
              <Languages size={16} />
              <span>{language === 'en' ? '中文' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Input Section */}
        <div className="mb-10 max-w-3xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
             {t.heroTitle}
           </h2>
           <p className="text-gray-500 mb-8">{t.heroSubtitle}</p>
           
           <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.placeholder}
              className="w-full h-14 pl-6 pr-36 rounded-full border border-gray-200 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-lg outline-none"
              disabled={status === 'loading'}
            />
            <button
              onClick={handleGenerate}
              disabled={status === 'loading' || !prompt.trim()}
              className="absolute right-2 top-2 h-10 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Wand2 size={18} />
                  <span>{t.generate}</span>
                </>
              )}
            </button>
           </div>
           
           {/* Color Count Slider */}
           <div className="flex items-center justify-center gap-4 mt-6">
              <label htmlFor="color-count" className="text-sm font-medium text-gray-600 w-32 text-right">
                {t.colorCount}: <span className="text-blue-600 font-bold">{colorCount}</span>
              </label>
              <input 
                id="color-count"
                type="range" 
                min="2" 
                max="12" 
                step="1"
                value={colorCount} 
                onChange={(e) => setColorCount(Number(e.target.value))}
                className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:bg-gray-300 transition-colors"
              />
           </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Palette List (Left Side) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-500" />
                {t.currentPalette}
              </h3>
              <span className="text-sm text-gray-400">{palette.length} {t.colorsGenerated}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {palette.map((color, index) => (
                <ColorCard 
                  key={`${color.hex}-${index}`} 
                  color={color} 
                  isSelected={selectedColor?.hex === color.hex}
                  onClick={() => setSelectedColor(color)}
                  onCopy={copyToClipboard}
                  language={language}
                />
              ))}
            </div>
          </div>

          {/* Inspector (Right Side - Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
             <CodeInspector 
               color={selectedColor} 
               onCopy={copyToClipboard} 
               language={language}
             />
          </div>

        </div>
      </main>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};

export default App;