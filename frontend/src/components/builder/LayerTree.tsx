import React from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import {
  Layers,
  ChevronRight,
  Folder,
  FileText,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layout,
  Tag
} from 'lucide-react';

export const LayerTree: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    selectedBlockId,
    selectSection,
    selectBlock,
    deleteSection,
    deleteBlock,
    moveSection,
    moveBlock,
    duplicateSection,
    duplicateBlock
  } = useBuilder();

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-300">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/20">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500 animate-pulse" />
          Layer Tree Navigator
        </h3>
        <p className="text-[10px] text-zinc-500 mt-1 font-medium">
          Navigate your design layers or reorder them instantly below.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.length === 0 ? (
          <div className="text-center py-10">
            <Layout className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">No layout sections created yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((sec, sIdx) => {
              const isSelected = selectedSectionId === sIdx;
              
              // Get blocks belonging directly to this section (at root level, e.g., parentId is null)
              const rootBlocks = sec.blocks.filter(b => !b.parentId);

              return (
                <div
                  key={sIdx}
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    isSelected ? 'border-amber-500/40 bg-zinc-950/20' : 'border-zinc-800 bg-zinc-950/10'
                  }`}
                >
                  {/* Section Title Bar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/35 border-b border-zinc-850">
                    <button
                      id={`navigator-section-${sIdx}`}
                      onClick={() => selectSection(sIdx)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-400 transition-colors text-left"
                    >
                      <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{sec.props?.name || `Section #${sIdx + 1}`}</span>
                      <span className="text-[10px] text-zinc-500">({sec.type})</span>
                    </button>

                    {/* Section actions */}
                    <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveSection(sIdx, 'up')}
                        disabled={sIdx === 0}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveSection(sIdx, 'down')}
                        disabled={sIdx === sections.length - 1}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => duplicateSection(sIdx)}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
                        title="Duplicate Section"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteSection(sIdx)}
                        className="p-1 hover:bg-zinc-800 rounded text-rose-400"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Section Child Blocks */}
                  <div className="p-2 space-y-1">
                    {sec.blocks.length === 0 ? (
                      <p className="text-[10px] text-zinc-600 p-2 italic text-center">Empty Section. Add blocks from the palette!</p>
                    ) : (
                      <div className="space-y-1 pl-1">
                        {sec.blocks.map((b) => {
                          const isBlockSelected = selectedBlockId === b.id;
                          return (
                            <div
                              key={b.id}
                              id={`layer-block-${b.id}`}
                              className={`flex items-center justify-between px-2 py-1.5 rounded transition-all text-left ${
                                isBlockSelected
                                  ? 'bg-amber-500/10 border border-amber-500/20 text-white'
                                  : 'hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 border border-transparent'
                              }`}
                            >
                              <button
                                onClick={() => selectBlock(b.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold truncate flex-1"
                              >
                                <ChevronRight className="w-3 h-3 text-zinc-500" />
                                <Tag className="w-3 h-3 text-zinc-500" />
                                <span className="truncate">{b.type}</span>
                                {b.parentId && (
                                  <span className="text-[9px] text-zinc-600">(nested)</span>
                                )}
                              </button>

                              {/* Block actions */}
                              <div className="flex items-center gap-0.5 opacity-0 hover:opacity-100 focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => moveBlock(b.id, 'up')}
                                  className="p-0.5 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-300"
                                  title="Move Up Sibling"
                                >
                                  <ArrowUp className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={() => moveBlock(b.id, 'down')}
                                  className="p-0.5 hover:bg-zinc-700 rounded text-zinc-500 hover:text-zinc-300"
                                  title="Move Down Sibling"
                                >
                                  <ArrowDown className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={() => duplicateBlock(b.id)}
                                  className="p-0.5 hover:bg-zinc-700 rounded text-zinc-400"
                                  title="Duplicate Block"
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={() => deleteBlock(b.id)}
                                  className="p-0.5 hover:bg-zinc-700 rounded text-rose-400"
                                  title="Delete Block"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default LayerTree;
