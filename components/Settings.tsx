
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    alert('Ajustes salvos!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="px-2 flex justify-between items-end">
        <h2 className="text-3xl font-bold tracking-tight">Ajustes</h2>
        <button
          onClick={handleSave}
          className="text-violet-600 font-bold text-sm bg-violet-50 px-6 py-2 rounded-full hover:bg-violet-100 transition-all"
        >
          Salvar
        </button>
      </header>

      <div className="space-y-6">
        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">Câmbio Metical</h3>
          <div className="bg-white rounded-3xl border border-[#D1D1D6] shadow-sm divide-y divide-[#F2F2F7]">
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-semibold">Rand (ZAR)</span>
              <input
                type="number"
                step="0.1"
                className="w-20 text-right bg-transparent outline-none font-bold text-lg"
                value={localSettings.zarRate}
                onChange={e => setLocalSettings({...localSettings, zarRate: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-semibold">Dólar (USD)</span>
              <input
                type="number"
                step="0.1"
                className="w-20 text-right bg-transparent outline-none font-bold text-lg"
                value={localSettings.usdRate}
                onChange={e => setLocalSettings({...localSettings, usdRate: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">Taxas de Logística</h3>
          <div className="bg-white rounded-3xl border border-[#D1D1D6] shadow-sm divide-y divide-[#F2F2F7]">
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-semibold">Peça Leve / Média</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-20 text-right bg-transparent outline-none font-bold text-lg"
                  value={localSettings.lightPieceTax}
                  onChange={e => setLocalSettings({...localSettings, lightPieceTax: parseInt(e.target.value) || 0})}
                />
                <span className="text-xs text-[#C7C7CC] font-bold">MT</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-semibold">Peça Pesada</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-20 text-right bg-transparent outline-none font-bold text-lg"
                  value={localSettings.heavyPieceTax}
                  onChange={e => setLocalSettings({...localSettings, heavyPieceTax: parseInt(e.target.value) || 0})}
                />
                <span className="text-xs text-[#C7C7CC] font-bold">MT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">Negócio</h3>
          <div className="bg-white rounded-3xl border border-[#D1D1D6] shadow-sm p-6 text-center space-y-4">
            <span className="text-sm font-semibold text-[#8E8E93]">Margem de Lucro Padrão</span>
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => setLocalSettings({...localSettings, marginPercentage: Math.max(0, localSettings.marginPercentage - 5)})}
                className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all"
              >
                <i className="fas fa-minus"></i>
              </button>
              <div className="text-4xl font-black tracking-tighter w-24">
                {localSettings.marginPercentage}%
              </div>
              <button 
                onClick={() => setLocalSettings({...localSettings, marginPercentage: localSettings.marginPercentage + 5})}
                className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-20"></div>
    </div>
  );
};

export default Settings;
