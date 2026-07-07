import React, { useState } from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import { Sliders, Eye, Palette, Layout, Settings, FileText, Image, Check, Plus, Trash2 } from 'lucide-react';

export const PropertyPanel: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    selectedBlockId,
    updateSectionProps,
    updateSectionStyles,
    updateBlockProps,
    updateBlockStyles
  } = useBuilder();

  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

  // Find currently active element details
  let selectedElement: {
    type: 'section' | 'block';
    item: any;
    idx?: number;
    sectionIdx?: number;
  } | null = null;

  if (selectedSectionId !== null) {
    selectedElement = {
      type: 'section',
      item: sections[selectedSectionId],
      idx: selectedSectionId,
    };
  } else if (selectedBlockId !== null) {
    sections.forEach((sec, sIdx) => {
      const bIdx = sec.blocks.findIndex((b) => b.id === selectedBlockId);
      if (bIdx !== -1) {
        selectedElement = {
          type: 'block',
          item: sec.blocks[bIdx],
          sectionIdx: sIdx,
        };
      }
    });
  }

  if (!selectedElement) {
    return (
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-300">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/20">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            Properties Inspector
          </h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Sliders className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-xs text-zinc-500">
            Select a Section on the Navigator or any Block on the Canvas to inspect and customize styling properties.
          </p>
        </div>
      </div>
    );
  }

  const { type, item } = selectedElement;
  const props = item.props || {};
  const styles = item.styles || {};

  const handlePropChange = (key: string, value: any) => {
    if (type === 'section' && selectedSectionId !== null) {
      updateSectionProps(selectedSectionId, { [key]: value });
    } else if (type === 'block' && selectedBlockId) {
      updateBlockProps(selectedBlockId, { [key]: value });
    }
  };

  const handleStyleChange = (key: string, value: any) => {
    if (type === 'section' && selectedSectionId !== null) {
      updateSectionStyles(selectedSectionId, { [key]: value });
    } else if (type === 'block' && selectedBlockId) {
      updateBlockStyles(selectedBlockId, { [key]: value });
    }
  };

  // Render Specific Custom Block Content Properties Form
  const renderContentFields = () => {
    if (type === 'section') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Section Name</label>
            <input
              type="text"
              value={props.name || ''}
              onChange={(e) => handlePropChange('name', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      );
    }

    const blockType = item.type;

    switch (blockType) {
      case 'Hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Main Title</label>
              <input
                type="text"
                value={props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Subtitle / Description</label>
              <textarea
                value={props.subtitle || ''}
                onChange={(e) => handlePropChange('subtitle', e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Button Headline</label>
              <input
                type="text"
                value={props.buttonText || ''}
                onChange={(e) => handlePropChange('buttonText', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Button Link / Action</label>
              <input
                type="text"
                value={props.buttonLink || ''}
                onChange={(e) => handlePropChange('buttonLink', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Cover Background Image URL</label>
              <input
                type="text"
                value={props.backgroundImage || ''}
                onChange={(e) => handlePropChange('backgroundImage', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Section Height</label>
              <input
                type="text"
                value={props.height || ''}
                onChange={(e) => handlePropChange('height', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Overlay Mask Color</label>
              <input
                type="color"
                value={props.overlayColor || '#000000'}
                onChange={(e) => handlePropChange('overlayColor', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-1 py-1 h-8 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        );

      case 'Heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Header Text Content</label>
              <input
                type="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Header Tag Level</label>
              <select
                value={props.level || 'h2'}
                onChange={(e) => handlePropChange('level', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="h1">Heading H1</option>
                <option value="h2">Heading H2</option>
                <option value="h3">Heading H3</option>
                <option value="h4">Heading H4</option>
                <option value="h5">Heading H5</option>
                <option value="h6">Heading H6</option>
              </select>
            </div>
          </div>
        );

      case 'Paragraph':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Paragraph Text Content</label>
              <textarea
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                rows={5}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        );

      case 'Button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Button Text Label</label>
              <input
                type="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Button Link / Slug Action</label>
              <input
                type="text"
                value={props.link || ''}
                onChange={(e) => handlePropChange('link', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Visual Button Theme</label>
              <select
                value={props.styleType || 'primary'}
                onChange={(e) => handlePropChange('styleType', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="primary">Corporate Primary Accent</option>
                <option value="secondary">Outlined Ghost Element</option>
                <option value="danger">Rose Alert Accent</option>
              </select>
            </div>
          </div>
        );

      case 'Image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Image Asset URL</label>
              <input
                type="text"
                value={props.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Alt Text Accessibility</label>
              <input
                type="text"
                value={props.alt || ''}
                onChange={(e) => handlePropChange('alt', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        );

      case 'Gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Gallery Image URLs (one per line)</label>
              <textarea
                value={Array.isArray(props.images) ? props.images.join('\n') : ''}
                onChange={(e) => handlePropChange('images', e.target.value.split('\n').filter(Boolean))}
                rows={6}
                placeholder="https://images.unsplash.com/photo-1..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        );

      case 'Video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Video File MP4 URL</label>
              <input
                type="text"
                value={props.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        );

      case 'Google Maps':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Location Name / Address Query</label>
              <input
                type="text"
                value={props.location || ''}
                onChange={(e) => handlePropChange('location', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Map Zoom Scale</label>
              <input
                type="number"
                min="1"
                max="21"
                value={props.zoom || 12}
                onChange={(e) => handlePropChange('zoom', parseInt(e.target.value, 10))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        );

      case 'HTML':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">Embed Custom HTML Script Code</label>
              <textarea
                value={props.code || ''}
                onChange={(e) => handlePropChange('code', e.target.value)}
                rows={8}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        );

      case 'Rich Text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">HTML Rich Text Editor Markup</label>
              <textarea
                value={props.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                rows={8}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        );

      case 'CTA':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">CTA Display Headline</label>
              <input
                type="text"
                value={props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">CTA Subtitle</label>
              <input
                type="text"
                value={props.subtitle || ''}
                onChange={(e) => handlePropChange('subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1.5">CTA Button text</label>
              <input
                type="text"
                value={props.buttonText || ''}
                onChange={(e) => handlePropChange('buttonText', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        );

      default:
        return (
          <p className="text-[10px] text-zinc-500 italic">No custom attributes required for this static block.</p>
        );
    }
  };

  // Render Design Styling Properties Form (The APPEARANCE STYLE TAB)
  const renderStyleFields = () => {
    return (
      <div className="space-y-4">
        {/* Spacing Block */}
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-amber-500" />
            Margins & Paddings
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Padding Top</label>
              <input
                type="text"
                value={styles.paddingTop || ''}
                onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                placeholder="e.g. 24px"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Padding Bottom</label>
              <input
                type="text"
                value={styles.paddingBottom || ''}
                onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                placeholder="e.g. 24px"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Margin Top</label>
              <input
                type="text"
                value={styles.marginTop || ''}
                onChange={(e) => handleStyleChange('marginTop', e.target.value)}
                placeholder="0px"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Margin Bottom</label>
              <input
                type="text"
                value={styles.marginBottom || ''}
                onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
                placeholder="0px"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Core Colors & Background */}
        <div className="pt-3 border-t border-zinc-800">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            Backgrounds & Typography Colors
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Text Color</label>
              <input
                type="color"
                value={styles.color || '#f4f4f5'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-0.5 h-8 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Background Color</label>
              <input
                type="color"
                value={styles.backgroundColor || '#09090b'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-0.5 h-8 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Typography properties */}
        <div className="pt-3 border-t border-zinc-800">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <Settings className="w-3.5 h-3.5 text-amber-500" />
            Design Accents & Borders
          </h4>
          <div className="space-y-2">
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Border Radius</label>
              <input
                type="text"
                value={styles.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                placeholder="e.g. 12px, 9999px"
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Alignment Orientation</label>
              <select
                value={styles.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value="left">Left Align</option>
                <option value="center">Centered Align</option>
                <option value="right">Right Align</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-1">Font Weight</label>
              <select
                value={styles.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value="300">Light (300)</option>
                <option value="normal">Normal (400)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="bold">Heavy Bold (700)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-300">
      {/* Element Identity header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/20">
        <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
          {type}
        </span>
        <h3 className="text-sm font-bold text-white mt-1.5 flex items-center gap-2">
          {type === 'section' ? (
            <>
              <Layout className="w-4 h-4 text-amber-500" />
              {props.name || 'Layout Section'}
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 text-amber-500" />
              {item.type} Block
            </>
          )}
        </h3>
        <p className="text-[9px] text-zinc-500 font-mono mt-1 break-all">ID: {item.id || `section_${selectedSectionId}`}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/10 shrink-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Content Props
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
            activeTab === 'style'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Appearance Style
        </button>
      </div>

      {/* Inputs panel */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-900/60">
        {activeTab === 'content' ? renderContentFields() : renderStyleFields()}
      </div>
    </div>
  );
};
export default PropertyPanel;
