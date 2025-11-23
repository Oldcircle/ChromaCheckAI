import React from 'react';
import { Copy } from 'lucide-react';
import { ColorItem, Language } from '../types';
import { isDarkColor } from '../utils/colorUtils';
import { translations } from '../utils/i18n';

interface ColorCardProps {
  color: ColorItem;
  isSelected: boolean;
  onClick: () => void;
  onCopy: (text: string) => void;
  language: Language;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, isSelected, onClick, onCopy, language }) => {
  const isDark = isDarkColor(color.hex);
  const t = translations[language];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(color.hex);
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer rounded-xl overflow-hidden shadow-sm transition-all duration-300
        ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 scale-[1.02] shadow-md' : 'hover:shadow-md hover:scale-[1.01]'}
      `}
    >
      {/* Color Swatch Area */}
      <div 
        className="h-32 w-full transition-colors duration-500 flex items-center justify-center relative"
        style={{ backgroundColor: color.hex }}
      >
        {/* Overlay actions on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
           <button 
             onClick={handleCopy}
             className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-all text-white shadow-lg border border-white/20"
             title={t.copyHex}
           >
             <Copy size={20} />
           </button>
        </div>
        
        {isSelected && (
          <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md rounded-full p-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="bg-white p-4 border-x border-b border-gray-100 rounded-b-xl">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 truncate w-3/4" title={color.name}>{color.name}</h3>
          <span className="text-xs font-mono text-gray-400 uppercase">{color.hex}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 h-8 leading-tight">{color.description}</p>
      </div>
    </div>
  );
};

export default ColorCard;
