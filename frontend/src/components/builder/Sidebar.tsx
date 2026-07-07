import React from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import { BlockPalette } from './BlockPalette';
import { LayerTree } from './LayerTree';
import { HistoryPanel } from './HistoryPanel';
import { SEOPanel } from './SEOPanel';
import { PlusSquare, Layers, History, Search } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useBuilder();

  return (
    <div className="w-80 h-full border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0 select-none text-zinc-300">
      {/* Sidebar Tab Selectors */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/20 shrink-0">
        <button
          id="btn-sidebar-tab-palette"
          onClick={() => setActiveTab('palette')}
          className={`flex-1 py-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'palette'
              ? 'border-amber-500 text-amber-500 bg-zinc-900/30'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          title="Blocks Palette"
        >
          <PlusSquare className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Palette</span>
        </button>

        <button
          id="btn-sidebar-tab-navigator"
          onClick={() => setActiveTab('navigator')}
          className={`flex-1 py-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'navigator'
              ? 'border-amber-500 text-amber-500 bg-zinc-900/30'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          title="Layer Tree Navigator"
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Navigator</span>
        </button>

        <button
          id="btn-sidebar-tab-history"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'history'
              ? 'border-amber-500 text-amber-500 bg-zinc-900/30'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          title="Version Backups"
        >
          <History className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
        </button>
        <button
          id="btn-sidebar-tab-seo"
          onClick={() => setActiveTab('seo')}
          className={`flex-1 py-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'seo'
              ? 'border-amber-500 text-amber-500 bg-zinc-900/30'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          title="SEO Settings"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">SEO</span>
        </button>
      </div>

      {/* Sidebar View Area */}
      <div className="flex-1 overflow-hidden bg-zinc-900/30">
        {activeTab === 'palette' && <BlockPalette />}
        {activeTab === 'navigator' && <LayerTree />}
        {activeTab === 'history' && <HistoryPanel />}
        {activeTab === 'seo' && <SEOPanel />}
      </div>
    </div>
  );
};
export default Sidebar;
