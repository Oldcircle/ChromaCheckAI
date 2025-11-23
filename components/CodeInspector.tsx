import React from 'react';
import { ColorItem, Language } from '../types';
import { getAllFormats, generateShades, isDarkColor } from '../utils/colorUtils';
import { Copy, Hash, Droplet, Activity, Printer } from 'lucide-react';
import { translations } from '../utils/i18n';

interface CodeInspectorProps {
  color: ColorItem | null;
  onCopy: (text: string) => void;
  language: Language;
}

const CodeInspector: React.FC<CodeInspectorProps> = ({ color, onCopy, language }) => {
  const t = translations[language];

  if (!color) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <Droplet size={48} className="mb-4 opacity-20" />
        <p className="text-center">{t.selectColor}</p>
      </div>
    );
  }

  const formats = getAllFormats(color.hex);
  const shades = generateShades(color.hex, 12);

  const CodeRow = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-md text-gray-500">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="font-mono text-gray-800 font-medium">{value}</p>
        </div>
      </div>
      <button 
        onClick={() => onCopy(value)}
        className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
      >
        <Copy size={16} />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in h-full overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <div 
          className="w-20 h-20 rounded-2xl shadow-inner ring-1 ring-black/5 flex-shrink-0"
          style={{ backgroundColor: color.hex }}
        ></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{color.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{color.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            {t.colorCodes}
          </h3>
          <div className="space-y-2">
            <CodeRow label="HEX" value={formats.hex} icon={Hash} />
            <CodeRow label="RGB" value={formats.rgb} icon={Droplet} />
            <CodeRow label="HSL" value={formats.hsl} icon={Activity} />
            <CodeRow label="CMYK" value={formats.cmyk} icon={Printer} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.tintsAndShades}</h3>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
            {shades.map((shade, idx) => (
              <button
                key={idx}
                onClick={() => onCopy(shade)}
                className="group relative h-12 w-full first:rounded-l-md last:rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                style={{ backgroundColor: shade }}
                title={`${t.copyHex} ${shade}`}
              >
                <span className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono ${isDarkColor(shade) ? 'text-white' : 'text-black'}`}>
                   <Copy size={12} />
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">{t.clickToCopy}</p>
        </div>
      </div>
    </div>
  );
};

export default CodeInspector;
