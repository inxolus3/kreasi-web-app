import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder, Breakpoint } from '../../contexts/BuilderContext';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Save,
  Globe,
  Loader2,
  CloudLightning,
  AlertCircle,
  Copy,
  Clipboard,
  History
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    page,
    activeBreakpoint,
    setBreakpoint,
    undo,
    redo,
    historyIndex,
    history,
    savePage,
    publishPage,
    isAutosaving,
    saveStatus,
    clipboard,
    pasteSelected,
    activeTab,
    setActiveTab
  } = useBuilder();

  const handleManualSave = async () => {
    await savePage();
    alert('Progress saved successfully!');
  };

  const handlePublish = async () => {
    if (window.confirm('Are you ready to publish this layout changes?')) {
      await publishPage();
      alert('Page published successfully to client routing!');
    }
  };

  const renderSaveStatus = () => {
    if (saveStatus === 'saving') {
      return (
        <span className="flex items-center gap-1 text-amber-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Saving...
        </span>
      );
    }
    if (saveStatus === 'unsaved') {
      return (
        <span className="flex items-center gap-1 text-zinc-400">
          <AlertCircle className="w-3.5 h-3.5" />
          Unsaved changes
        </span>
      );
    }
    if (saveStatus === 'error') {
      return (
        <span className="flex items-center gap-1 text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          Failed to save
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-emerald-500">
        <CloudLightning className="w-3.5 h-3.5" />
        Saved
      </span>
    );
  };

  return (
    <div className="h-16 border-b border-zinc-800 bg-zinc-900 text-zinc-300 px-6 flex items-center justify-between shrink-0 select-none">
      {/* Title & Back flow */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/pages')}
          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all border border-zinc-800 hover:border-zinc-750"
          title="Back to Pages list"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white max-w-[180px] md:max-w-[280px] truncate">
              {page?.title || 'Design Layout Editor'}
            </h2>
            <span className="text-[10px] bg-zinc-800 border border-zinc-750 text-zinc-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              {page?.status || 'DRAFT'}
            </span>
          </div>

          <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5 font-medium">
            <span>Slug: /pages/{page?.slug}</span>
            <span>&bull;</span>
            {renderSaveStatus()}
          </p>
        </div>
      </div>

      {/* Breakpoints Switcher (Desktop, Tablet, Mobile) */}
      <div className="flex items-center bg-zinc-950 border border-zinc-855 rounded-lg p-1.5 gap-1 shadow-inner">
        {(['desktop', 'tablet', 'mobile'] as Breakpoint[]).map((bp) => {
          const isActive = activeBreakpoint === bp;
          const getIcon = () => {
            if (bp === 'tablet') return <Tablet className="w-4 h-4" />;
            if (bp === 'mobile') return <Smartphone className="w-4 h-4" />;
            return <Monitor className="w-4 h-4" />;
          };
          return (
            <button
              key={bp}
              id={`bp-selector-${bp}`}
              onClick={() => setBreakpoint(bp)}
              className={`p-2 rounded-md transition-all ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title={`${bp.toUpperCase()} Viewport Width`}
            >
              {getIcon()}
            </button>
          );
        })}
      </div>

      {/* Actions and States (Undo, Redo, Save, Publish) */}
      <div className="flex items-center gap-3">
        {/* Clipboard indicators */}
        {clipboard && (
          <button
            onClick={pasteSelected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-amber-500 border border-zinc-800 rounded-lg text-xs font-semibold transition-all"
            title="Paste copied element"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste ({clipboard.type})</span>
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center border border-zinc-800 bg-zinc-950/20 rounded-lg overflow-hidden">
          <button
            id="btn-undo"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-all border-r border-zinc-800"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="btn-redo"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Save & Publish */}
        <button
          id="btn-save-builder"
          onClick={handleManualSave}
          className="flex items-center gap-2 px-3.5 py-2 border border-zinc-850 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 rounded-lg text-xs font-bold text-zinc-200 transition-all"
        >
          <Save className="w-4 h-4 text-amber-500" />
          <span>Save Backup</span>
        </button>

        <button
          id="btn-toggle-history-sidebar"
          onClick={() => setActiveTab(activeTab === 'history' ? 'palette' : 'history')}
          className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
              : 'border-zinc-850 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 text-zinc-200'
          }`}
          title="Open Version History Sidebar"
        >
          <History className="w-4 h-4 text-amber-500" />
          <span>Version History</span>
        </button>

        <button
          id="btn-publish-builder"
          onClick={handlePublish}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg text-xs font-black shadow-lg shadow-amber-500/10 transition-all"
        >
          <Globe className="w-4 h-4" />
          <span>Publish Page</span>
        </button>
      </div>
    </div>
  );
};
export default Toolbar;
