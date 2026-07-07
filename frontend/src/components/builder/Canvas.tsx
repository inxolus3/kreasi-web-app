import React from 'react';
import { useBuilder, Breakpoint } from '../../contexts/BuilderContext';
import { PageBlockData, PageSectionData } from '../../api/pages.api';
import { OptimizedImage } from '../OptimizedImage';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
  MapPin,
  Mail,
  Award,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const Canvas: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    selectedBlockId,
    activeBreakpoint,
    selectSection,
    selectBlock,
    addBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock
  } = useBuilder();

  const getCanvasWidthClass = (bp: Breakpoint) => {
    switch (bp) {
      case 'tablet':
        return 'max-w-[768px] border-x border-zinc-800 shadow-2xl';
      case 'mobile':
        return 'max-w-[375px] border-x border-zinc-800 shadow-2xl';
      default:
        return 'w-full max-w-7xl';
    }
  };

  // RECURSIVE BLOCK RENDERER
  const renderBlock = (block: PageBlockData, allBlocks: PageBlockData[], sectionIdx: number) => {
    const isSelected = selectedBlockId === block.id;
    const blockProps = block.props || {};
    const blockStyles = block.styles || {};

    // Gather children blocks belonging directly to this block (Container or Columns nested parenting)
    const childBlocks = allBlocks
      .filter((b) => b.parentId === block.id)
      .sort((a, b) => a.order - b.order);

    const handleSelectBlock = (e: React.MouseEvent) => {
      e.stopPropagation();
      selectBlock(block.id);
    };

    // Render inner content of specific block types
    const renderBlockContent = () => {
      switch (block.type) {
        case 'Hero':
          return (
            <div
              className="relative py-20 px-6 rounded-xl overflow-hidden bg-cover bg-center text-center"
              style={{
                backgroundImage: `url(${blockProps.backgroundImage})`,
                minHeight: blockProps.height || '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: blockProps.alignment || 'center',
              }}
            >
              {/* Cover Mask Overlay */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundColor: blockProps.overlayColor || '#000000',
                  opacity: blockProps.overlayOpacity || '0.4',
                }}
              />

              <div className="relative z-10 max-w-3xl px-4 space-y-4">
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  {blockProps.title || 'Masterful Digital Experience'}
                </h1>
                <p className="text-sm md:text-lg text-zinc-200">
                  {blockProps.subtitle || 'Create robust high conversions workflows using our drag drop canvas editor.'}
                </p>
                {blockProps.buttonText && (
                  <button className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold rounded-lg hover:bg-amber-600 transition-all text-sm inline-block shadow-lg shadow-amber-500/20">
                    {blockProps.buttonText}
                  </button>
                )}
              </div>
            </div>
          );

        case 'Heading':
          const HeadingTag = (blockProps.level || 'h2') as any;
          const headingSizes: Record<string, string> = {
            h1: 'text-3xl md:text-4xl font-extrabold tracking-tight',
            h2: 'text-2xl md:text-3xl font-bold tracking-tight',
            h3: 'text-xl md:text-2xl font-bold',
            h4: 'text-lg md:text-xl font-semibold',
            h5: 'text-base font-semibold',
            h6: 'text-sm font-semibold uppercase',
          };
          return (
            <HeadingTag
              className={`${headingSizes[blockProps.level || 'h2']}`}
              style={{
                color: blockStyles.color,
                textAlign: blockStyles.textAlign || 'left',
                fontWeight: blockStyles.fontWeight,
              }}
            >
              {blockProps.text || 'Section Headline Title'}
            </HeadingTag>
          );

        case 'Paragraph':
          return (
            <p
              className="text-sm md:text-base leading-relaxed text-zinc-300"
              style={{
                color: blockStyles.color,
                textAlign: blockStyles.textAlign || 'left',
                fontWeight: blockStyles.fontWeight,
              }}
            >
              {blockProps.text || 'Write fluid multi-line paragraphs in this content block.'}
            </p>
          );

        case 'Button':
          const isPrimary = blockProps.styleType !== 'secondary';
          return (
            <div style={{ textAlign: blockStyles.textAlign || 'left' }}>
              <button
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isPrimary
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600'
                    : 'border border-zinc-750 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {blockProps.text || 'Button Click'}
              </button>
            </div>
          );

        case 'Image':
          return (
            <div className="rounded-xl overflow-hidden border border-zinc-850">
              <OptimizedImage
                src={blockProps.src || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}
                alt={blockProps.alt || 'Visual asset'}
                className="w-full max-h-[500px]"
                objectFit="cover"
              />
            </div>
          );

        case 'Gallery':
          const images = blockProps.images || [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'
          ];
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((imgSrc: string, idx: number) => (
                <div key={idx} className="h-48 rounded-lg overflow-hidden border border-zinc-850 bg-zinc-950">
                  <OptimizedImage
                    src={imgSrc}
                    alt={`Gallery Media ${idx + 1}`}
                    className="w-full h-full hover:scale-105 transition-transform duration-300"
                    aspectRatio="aspect-auto"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          );

        case 'Video':
          return (
            <div className="rounded-xl overflow-hidden border border-zinc-850 bg-zinc-950 aspect-video flex items-center justify-center">
              <video
                src={blockProps.src || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                controls={blockProps.controls !== false}
                autoPlay={blockProps.autoplay === true}
                loop={blockProps.loop === true}
                className="w-full h-full"
              />
            </div>
          );

        case 'Divider':
          return (
            <hr
              style={{
                borderColor: blockProps.color || '#3f3f46',
                borderWidth: blockProps.thickness || '1px',
                borderStyle: blockProps.style || 'solid',
              }}
            />
          );

        case 'Spacer':
          return <div style={{ height: blockProps.height || '40px' }} />;

        case 'Container':
          return (
            <div
              className={`p-6 border border-dashed rounded-xl ${
                childBlocks.length === 0 ? 'border-zinc-800 bg-zinc-950/20 py-10' : 'border-zinc-800/40 bg-zinc-950/5'
              }`}
            >
              {childBlocks.length === 0 ? (
                <div className="text-center py-2">
                  <p className="text-[10px] text-zinc-600 font-medium">Empty Container Block</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addBlock(sectionIdx, block.id, 'Heading');
                    }}
                    className="mt-1 px-2.5 py-1 bg-zinc-850 hover:bg-zinc-800 text-[9px] font-semibold text-zinc-400 rounded hover:text-white"
                  >
                    + Add Element
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {childBlocks.map((cb) => renderBlock(cb, allBlocks, sectionIdx))}
                </div>
              )}
            </div>
          );

        case 'Columns':
          const colsCount = blockProps.count || 3;
          return (
            <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}>
              {Array.from({ length: colsCount }).map((_, colIdx) => {
                // Get blocks inside this column index
                const colBlockId = `${block.id}_col_${colIdx}`;
                const colChildren = childBlocks.filter((b) => b.parentId === colBlockId);

                return (
                  <div
                    key={colIdx}
                    className="p-4 border border-dashed border-zinc-800 bg-zinc-950/10 rounded-lg min-h-[120px] flex flex-col justify-center"
                  >
                    {colChildren.length === 0 ? (
                      <div className="text-center">
                        <span className="text-[9px] text-zinc-600">Col #{colIdx + 1}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addBlock(sectionIdx, colBlockId, 'Heading');
                          }}
                          className="block mx-auto mt-1 px-2 py-0.5 bg-zinc-850 hover:bg-zinc-800 text-[8px] font-bold text-zinc-500 hover:text-zinc-300 rounded"
                        >
                          + Add
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {colChildren.map((cb) => renderBlock(cb, allBlocks, sectionIdx))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );

        case 'Card':
          return (
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors space-y-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">{blockProps.title || 'Enterprise Strategy'}</h4>
              <p className="text-xs text-zinc-400">{blockProps.description || 'Pioneering cloud-native microservices customization for responsive design headers.'}</p>
              {blockProps.buttonText && (
                <button className="text-xs text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  {blockProps.buttonText} &rarr;
                </button>
              )}
            </div>
          );

        case 'Feature List':
          const features = blockProps.features || ['Checks SLA', 'Check check list item'];
          return (
            <div className="space-y-2">
              {features.map((f: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          );

        case 'Pricing':
          return (
            <div className={`p-6 rounded-xl border flex flex-col justify-between h-full bg-zinc-900 ${blockProps.active ? 'border-amber-500/80 shadow-lg shadow-amber-500/5' : 'border-zinc-800'}`}>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{blockProps.title || 'Pro Suite'}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{blockProps.price || '$99'}</span>
                  <span className="text-xs text-zinc-500">/{blockProps.period || 'mo'}</span>
                </div>
                <hr className="border-zinc-800" />
                <div className="space-y-2">
                  {(blockProps.features || []).map((f: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className={`w-full mt-6 py-2 rounded-lg text-xs font-bold transition-all ${blockProps.active ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}>
                Choose Plan
              </button>
            </div>
          );

        case 'FAQ':
          return (
            <div className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                {blockProps.question || 'Is the Google Maps API key preseeded?'}
              </h4>
              <p className="text-xs text-zinc-400 pl-6 leading-relaxed">
                {blockProps.answer || 'Yes, maps resolve using custom iframe embedding coordinates.'}
              </p>
            </div>
          );

        case 'Accordion':
          return (
            <div className="border border-zinc-850 rounded-lg overflow-hidden bg-zinc-950/10">
              <div className="px-4 py-3 bg-zinc-950/30 flex items-center justify-between border-b border-zinc-850">
                <h4 className="text-xs font-bold text-white">{blockProps.title || 'FAQ Accordion folder title'}</h4>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="p-4 text-xs text-zinc-400 leading-relaxed">
                {blockProps.content || 'Content detail elements are revealed on dropdown clicks.'}
              </div>
            </div>
          );

        case 'Testimonials':
          return (
            <div className="p-6 bg-zinc-950/30 border border-zinc-850 rounded-2xl italic relative text-zinc-300 space-y-4">
              <p className="text-sm leading-relaxed relative z-10">
                "{blockProps.quote || 'This visual builder transformed our entire enterprise landing pipeline.'}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-amber-500 text-xs shrink-0">
                  {blockProps.author?.substring(0, 2) || 'VS'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white not-italic">{blockProps.author || 'Victoria Sterling'}</h5>
                  <p className="text-[10px] text-zinc-500 not-italic">{blockProps.role || 'Marketing Coordinator'}</p>
                </div>
              </div>
            </div>
          );

        case 'CTA':
          return (
            <div className="p-8 bg-gradient-to-r from-amber-500/10 to-amber-500/0 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-black text-white">{blockProps.title || 'Ready to Scale?'}</h3>
                <p className="text-xs text-zinc-400 mt-1">{blockProps.subtitle || 'Deploy responsive custom landing systems today.'}</p>
              </div>
              <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg text-xs shrink-0 shadow-lg shadow-amber-500/20">
                {blockProps.buttonText || 'Contact Us'}
              </button>
            </div>
          );

        case 'Google Maps':
          return (
            <div className="rounded-xl overflow-hidden border border-zinc-850 h-64 bg-zinc-950 relative flex items-center justify-center">
              <MapPin className="w-6 h-6 text-amber-500 animate-bounce absolute z-10 pointer-events-none" />
              {/* Iframe dynamic embed representing search */}
              <iframe
                title="Google Maps Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(blockProps.location || 'Jakarta')}&t=&z=${blockProps.zoom || 12}&ie=UTF8&iwloc=&output=embed`}
                className="opacity-60 saturate-50 contrast-125"
              />
            </div>
          );

        case 'HTML':
          return (
            <div
              className="p-1 border border-zinc-850 rounded bg-zinc-950/20 font-mono text-[10px] text-zinc-400"
              dangerouslySetInnerHTML={{ __html: blockProps.code || '<!-- Empty HTML -->' }}
            />
          );

        case 'Rich Text':
          return (
            <div
              className="prose prose-invert prose-sm max-w-none text-zinc-300"
              dangerouslySetInnerHTML={{ __html: blockProps.content || '<p>Configure rich text formatting inside the properties panel.</p>' }}
            />
          );

        case 'Contact Form':
          return (
            <div className="p-6 bg-zinc-950/40 border border-zinc-850 rounded-xl space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Email Address</label>
                  <input type="email" placeholder={blockProps.emailPlaceholder || 'email@domain.com'} disabled className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Company / Organization</label>
                  <input type="text" placeholder="Enterprise Inc." disabled className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Project Summary Query</label>
                <textarea rows={3} placeholder={blockProps.messagePlaceholder || 'Workflow context details...'} disabled className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-xs text-zinc-500 focus:outline-none" />
              </div>
              <button disabled className="px-4 py-2 bg-zinc-800 text-zinc-500 font-bold rounded text-xs">
                {blockProps.submitText || 'Submit Form'}
              </button>
            </div>
          );

        case 'Embed':
          return (
            <div className="rounded-xl overflow-hidden border border-zinc-850 aspect-video bg-zinc-950">
              <iframe
                title="Iframe Embed"
                src={blockProps.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          );

        default:
          return <div className="p-3 bg-zinc-950 border border-zinc-850 text-xs text-zinc-500 text-center rounded">{block.type} Block</div>;
      }
    };

    return (
      <div
        key={block.id}
        id={`canvas-block-${block.id}`}
        onClick={handleSelectBlock}
        style={{
          paddingTop: blockStyles.paddingTop,
          paddingBottom: blockStyles.paddingBottom,
          paddingLeft: blockStyles.paddingLeft,
          paddingRight: blockStyles.paddingRight,
          marginTop: blockStyles.marginTop,
          marginBottom: blockStyles.marginBottom,
          borderRadius: blockStyles.borderRadius,
        }}
        className={`relative group/block transition-all duration-150 ${
          isSelected
            ? 'outline-2 outline-amber-500 shadow-xl shadow-amber-500/5'
            : 'hover:outline-1 hover:outline-dashed hover:outline-zinc-600 outline-offset-2'
        }`}
      >
        {/* Selection / Micro Actions toolbar */}
        {isSelected && (
          <div className="absolute -top-7 right-0 z-40 bg-amber-500 text-zinc-950 px-2 py-1 rounded-t flex items-center gap-1.5 shadow-lg select-none">
            <span className="text-[10px] font-black uppercase tracking-wider">{block.type}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              className="p-0.5 hover:bg-amber-600 rounded text-zinc-950"
              title="Duplicate"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="p-0.5 hover:bg-amber-600 rounded text-rose-950"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {renderBlockContent()}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      <div className={`w-full bg-zinc-950 min-h-[600px] transition-all duration-300 ${getCanvasWidthClass(activeBreakpoint)}`}>
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[450px] border-2 border-dashed border-zinc-850 rounded-2xl text-center px-4 bg-zinc-900/10">
            <Plus className="w-10 h-10 text-zinc-700 mb-3 animate-bounce" />
            <h3 className="text-sm font-bold text-zinc-400">Empty Page Builder Canvas</h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-sm">
              Use the sidebar Palette to add blocks or structure sections recursively. Start from a pre-made template above to pre-seed layouts.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((sec, sIdx) => {
              const isSelected = selectedSectionId === sIdx;
              
              // Only filter blocks at root-level of this section (parentId is null)
              const rootBlocks = sec.blocks
                .filter((b) => !b.parentId)
                .sort((a, b) => a.order - b.order);

              return (
                <section
                  key={sIdx}
                  id={`canvas-section-${sIdx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectSection(sIdx);
                  }}
                  style={{
                    paddingTop: sec.styles?.paddingTop || '64px',
                    paddingBottom: sec.styles?.paddingBottom || '64px',
                    backgroundColor: sec.styles?.backgroundColor || '#09090b',
                    backgroundImage: sec.styles?.backgroundImage ? `url(${sec.styles.backgroundImage})` : undefined,
                  }}
                  className={`relative group/section px-6 border-b border-zinc-900 transition-all ${
                    isSelected
                      ? 'outline-2 outline-amber-500/60 shadow-inner'
                      : 'hover:outline-1 hover:outline-dashed hover:outline-zinc-850'
                  }`}
                >
                  {/* Floating Action elements inside Sections */}
                  {isSelected && (
                    <div className="absolute top-2 left-6 z-40 bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-500">Section #{sIdx + 1}</span>
                    </div>
                  )}

                  {/* Section blocks nested contents */}
                  <div className="max-w-5xl mx-auto space-y-6">
                    {rootBlocks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 border border-dashed border-zinc-850/60 rounded-xl bg-zinc-950/20 text-center">
                        <Plus className="w-6 h-6 text-zinc-700 mb-2" />
                        <span className="text-xs text-zinc-600">No blocks added here yet.</span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addBlock(sIdx, null, 'Hero');
                            }}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white rounded border border-zinc-800"
                          >
                            + Add Hero
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addBlock(sIdx, null, 'Heading');
                            }}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white rounded border border-zinc-800"
                          >
                            + Add Heading
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {rootBlocks.map((b) => renderBlock(b, sec.blocks, sIdx))}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Canvas;
