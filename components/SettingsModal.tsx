import React, { useState, useEffect } from 'react';
import { X, Save, Settings as SettingsIcon, AlertCircle, Plus, Trash2, Check } from 'lucide-react';
import { UserSettings, AIProvider, Language, SettingsProfile } from '../types';
import { translations } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profiles: SettingsProfile[], activeId: string) => void;
  profiles: SettingsProfile[];
  activeProfileId: string;
  language: Language;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  profiles: initialProfiles,
  activeProfileId: initialActiveId,
  language 
}) => {
  // Initialize with props directly to avoid empty state on first render
  const [profiles, setProfiles] = useState<SettingsProfile[]>(initialProfiles);
  const [selectedId, setSelectedId] = useState<string>(initialActiveId);
  const t = translations[language];

  // Sync state when modal opens (creates a fresh deep copy for editing)
  useEffect(() => {
    if (isOpen) {
      setProfiles(JSON.parse(JSON.stringify(initialProfiles))); // Deep copy
      setSelectedId(initialActiveId);
    }
  }, [isOpen, initialProfiles, initialActiveId]);

  if (!isOpen) return null;

  // Find current profile, fallback safely
  const currentProfile = profiles.find(p => p.id === selectedId) || profiles[0];

  // Safety guard: if no profiles exist (shouldn't happen with defaults), render nothing to prevent crash
  if (!currentProfile) return null;

  const handleUpdateProfile = (field: keyof SettingsProfile, value: string) => {
    setProfiles(prev => prev.map(p => 
      p.id === selectedId ? { ...p, [field]: value } : p
    ));
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AIProvider;
    let defaultModel = currentProfile.model;
    let defaultBaseUrl = currentProfile.baseUrl || '';

    // Smart defaults
    switch (newProvider) {
      case 'gemini': defaultModel = 'gemini-2.5-flash'; defaultBaseUrl = ''; break;
      case 'deepseek': defaultModel = 'deepseek-chat'; defaultBaseUrl = 'https://api.deepseek.com'; break;
      case 'moonshot': defaultModel = 'moonshot-v1-8k'; defaultBaseUrl = 'https://api.moonshot.cn/v1'; break;
      case 'openai': defaultModel = 'gpt-4o'; defaultBaseUrl = 'https://api.openai.com/v1'; break;
      case 'groq': defaultModel = 'llama3-70b-8192'; defaultBaseUrl = 'https://api.groq.com/openai/v1'; break;
      case 'ollama': defaultModel = 'llama3'; defaultBaseUrl = 'http://localhost:11434/v1'; break;
      case 'openrouter': defaultModel = 'anthropic/claude-3.5-sonnet'; defaultBaseUrl = 'https://openrouter.ai/api/v1'; break;
      case 'siliconflow': defaultModel = 'deepseek-ai/DeepSeek-V3'; defaultBaseUrl = 'https://api.siliconflow.cn/v1'; break;
    }

    setProfiles(prev => prev.map(p => 
      p.id === selectedId ? { ...p, provider: newProvider, model: defaultModel, baseUrl: defaultBaseUrl } : p
    ));
  };

  const handleAddProfile = () => {
    const newProfile: SettingsProfile = {
      id: Date.now().toString(),
      name: `${t.newProfile} ${profiles.length + 1}`,
      provider: 'openai',
      apiKey: '',
      model: 'gpt-3.5-turbo',
      baseUrl: ''
    };
    setProfiles([...profiles, newProfile]);
    setSelectedId(newProfile.id);
  };

  const handleDeleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (profiles.length <= 1) return; // Cannot delete last profile
    if (window.confirm(t.confirmDelete)) {
      const newProfiles = profiles.filter(p => p.id !== id);
      setProfiles(newProfiles);
      if (selectedId === id) {
        setSelectedId(newProfiles[0].id);
      }
    }
  };

  const handleSaveAll = () => {
    onSave(profiles, selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] overflow-hidden animate-slide-up flex flex-col md:flex-row">
        
        {/* Sidebar - Profile List */}
        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">{t.profiles}</h3>
            <button 
              onClick={handleAddProfile}
              className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
              title={t.newProfile}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {profiles.map(profile => (
              <div 
                key={profile.id}
                onClick={() => setSelectedId(profile.id)}
                className={`
                  group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                  ${selectedId === profile.id ? 'bg-white shadow-sm ring-1 ring-blue-500' : 'hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className={`w-2 h-8 rounded-full flex-shrink-0 ${selectedId === profile.id ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                   <div className="truncate">
                     <p className={`text-sm font-medium truncate ${selectedId === profile.id ? 'text-gray-900' : 'text-gray-600'}`}>
                       {profile.name}
                     </p>
                     <p className="text-xs text-gray-400 capitalize">{profile.provider}</p>
                   </div>
                </div>
                
                {profiles.length > 1 && (
                  <button 
                    onClick={(e) => handleDeleteProfile(e, profile.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Form */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <SettingsIcon size={20} className="text-blue-600" />
              {t.configureAI}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Profile Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profileName}</label>
              <input
                type="text"
                value={currentProfile.name}
                onChange={(e) => handleUpdateProfile('name', e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="h-px bg-gray-100 my-2"></div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.provider}</label>
              <select
                value={currentProfile.provider}
                onChange={handleProviderChange}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <optgroup label="Google">
                  <option value="gemini">Google Gemini</option>
                </optgroup>
                <optgroup label="OpenAI Compatible">
                  <option value="openai">OpenAI (GPT)</option>
                  <option value="deepseek">DeepSeek (深度求索)</option>
                  <option value="moonshot">Moonshot (Kimi)</option>
                  <option value="groq">Groq (Llama)</option>
                  <option value="siliconflow">SiliconFlow (硅基流动)</option>
                  <option value="openrouter">OpenRouter (Aggregator)</option>
                </optgroup>
                <optgroup label="Local / Custom">
                  <option value="ollama">Ollama (Local)</option>
                  <option value="custom">Custom Endpoint</option>
                </optgroup>
              </select>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.apiKey}</label>
              <input
                type="password"
                value={currentProfile.apiKey}
                onChange={(e) => handleUpdateProfile('apiKey', e.target.value)}
                placeholder={currentProfile.provider === 'ollama' ? 'Optional for Ollama' : t.apiKeyPlaceholder}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">{t.useEnvDefault}</p>
            </div>

            {/* Base URL */}
            {currentProfile.provider !== 'gemini' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.baseUrl}</label>
                <input
                  type="text"
                  value={currentProfile.baseUrl || ''}
                  onChange={(e) => handleUpdateProfile('baseUrl', e.target.value)}
                  placeholder={t.baseUrlPlaceholder}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            )}

            {/* Model Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.modelName}</label>
              <input
                type="text"
                value={currentProfile.model}
                onChange={(e) => handleUpdateProfile('model', e.target.value)}
                placeholder="e.g., gpt-4o"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
              {currentProfile.provider === 'ollama' && (
                <div className="flex items-start gap-1.5 mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Ensure model is pulled (e.g. <code>ollama pull llama3</code>) and Ollama runs with <code>OLLAMA_ORIGINS="*"</code>.</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSaveAll}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;