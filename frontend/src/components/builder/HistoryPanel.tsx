import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import { pagesApi, PageVersionData } from '../../api/pages.api';
import { History, Calendar, RefreshCcw, Loader, ArrowLeftRight, PlusSquare, Check } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { page, restoreVersion, historyIndex, history, autosavePage } = useBuilder();
  const [versions, setVersions] = useState<PageVersionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingCheckpoint, setIsSavingCheckpoint] = useState(false);

  const fetchVersions = async () => {
    if (!page) return;
    setIsLoading(true);
    try {
      const vList = await pagesApi.getVersions(page.id);
      setVersions(vList);
    } catch (e) {
      console.error('Failed to load version checkpoints:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page) {
      fetchVersions();
    }
  }, [page]);

  const handleCreateCheckpoint = async () => {
    if (!page) return;
    setIsSavingCheckpoint(true);
    try {
      await autosavePage();
      await fetchVersions();
      alert('Checkpoint saved successfully!');
    } catch (err) {
      console.error('Failed to save manual checkpoint:', err);
      alert('Failed to save checkpoint.');
    } finally {
      setIsSavingCheckpoint(false);
    }
  };

  const handleRestore = async (vId: number) => {
    if (window.confirm('Are you sure you want to restore this version? This will overwrite your active builder state.')) {
      try {
        await restoreVersion(vId);
        alert('Page structure rolled back successfully!');
      } catch (err) {
        console.error('Failed to restore checkpoint:', err);
        alert('Failed to rollback page structure.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-300">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/20">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500 animate-pulse" />
          Version Checkpoints
        </h3>
        <p className="text-[10px] text-zinc-500 mt-1 font-medium">
          Every autosave cycle and publish event saves an automated checkpoint.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Undo Redo Quick Info */}
        <div className="bg-zinc-950/50 border border-zinc-850 p-3 rounded-lg space-y-1.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
            Session Undo/Redo
          </h4>
          <p className="text-[10px] text-zinc-400">
            Active Undo/Redo stack size: <span className="font-semibold text-white">{history.length}</span> states.
          </p>
          <p className="text-[10px] text-zinc-400">
            Current pointer location: index <span className="font-semibold text-white">{historyIndex}</span>.
          </p>
        </div>

        {/* Database checkpoint history */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Saved Checkpoints</span>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCreateCheckpoint}
                disabled={isSavingCheckpoint}
                className="text-[10px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
                title="Create an on-demand version checkpoint"
              >
                {isSavingCheckpoint ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <PlusSquare className="w-3 h-3" />
                )}
                New Checkpoint
              </button>
              <span className="text-zinc-700">|</span>
              <button
                onClick={fetchVersions}
                className="text-[10px] text-zinc-400 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                title="Fetch latest database versions"
              >
                <RefreshCcw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader className="w-5 h-5 text-amber-500 animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Fetching history...</span>
            </div>
          ) : versions.length === 0 ? (
            <p className="text-xs text-zinc-600 italic py-6 text-center">No persistent checkpoints saved yet.</p>
          ) : (
            <div className="space-y-2">
              {versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  id={`checkpoint-${ver.id}`}
                  className="p-3 bg-zinc-950/30 border border-zinc-850 rounded-lg flex items-center justify-between hover:border-zinc-800 transition-colors"
                >
                  <div className="space-y-1 pr-2 min-w-0">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Version #{ver.version}</span>
                      {idx === 0 && (
                        <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1 py-0.2 rounded uppercase font-bold">
                          Latest
                        </span>
                      )}
                    </h5>
                    <p className="text-[9px] text-zinc-500 flex items-center gap-1 truncate">
                      <Calendar className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                      <span>{new Date(ver.createdAt).toLocaleString()}</span>
                    </p>
                  </div>

                  <button
                    id={`btn-restore-checkpoint-${ver.id}`}
                    onClick={() => handleRestore(ver.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 rounded text-[10px] font-bold transition-all border border-zinc-750 hover:border-transparent flex-shrink-0"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
