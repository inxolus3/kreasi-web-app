import React, { useState } from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import {
  Search,
  Layout,
  Type,
  Image,
  List,
  DollarSign,
  HelpCircle,
  MessageSquare,
  MapPin,
  Code,
  FileText,
  Mail,
  Video,
  MousePointer,
  Sparkles,
  Rows,
  Divide,
  Maximize,
  Grid
} from 'lucide-react';

interface BlockItem {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface BlockCategory {
  title: string;
  icon: React.ComponentType<any>;
  items: BlockItem[];
}

export const BlockPalette: React.FC = () => {
  const { addBlock, selectedSectionId, sections } = useBuilder();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: BlockCategory[] = [
    {
      title: 'Layout & Structuring',
      icon: Layout,
      items: [
        { type: 'Container', label: 'Container', description: 'Wrapper block to isolate content layouts.', icon: Maximize },
        { type: 'Columns', label: 'Columns', description: 'Multi-column fluid responsive grid wrapper.', icon: Grid },
        { type: 'Spacer', label: 'Spacer', description: 'Empty horizontal spacer block with custom height.', icon: Rows },
        { type: 'Divider', label: 'Divider', description: 'Horizontal thin separation bar line.', icon: Divide },
      ],
    },
    {
      title: 'Typography & Core Content',
      icon: Type,
      items: [
        { type: 'Heading', label: 'Heading', description: 'Standard SEO H1 to H6 headers.', icon: Type },
        { type: 'Paragraph', label: 'Paragraph', description: 'Multiline fluid paragraph text.', icon: FileText },
        { type: 'Button', label: 'Button', description: 'Interactive call-to-action link button.', icon: MousePointer },
        { type: 'Rich Text', label: 'Rich Text', description: 'Advanced formatting rich editor.', icon: FileText },
      ],
    },
    {
      title: 'Visual Media',
      icon: Image,
      items: [
        { type: 'Image', label: 'Image', description: 'Single high fidelity image asset.', icon: Image },
        { type: 'Gallery', label: 'Gallery', description: 'Fluid grid of multiple selected media assets.', icon: Grid },
        { type: 'Video', label: 'Video', description: 'Local or external video player widget.', icon: Video },
      ],
    },
    {
      title: 'Marketing & Landing',
      icon: Sparkles,
      items: [
        { type: 'Hero', label: 'Hero Block', description: 'Attention-grabbing full-width header.', icon: Sparkles },
        { type: 'Card', label: 'Feature Card', description: 'Content panel box with title and buttons.', icon: Layout },
        { type: 'Feature List', label: 'Feature List', description: 'Horizontal list of checklist items.', icon: List },
        { type: 'Pricing', label: 'Pricing Matrix', description: 'Enterprise tiered pricing matrices.', icon: DollarSign },
        { type: 'Testimonials', label: 'Testimonial', description: 'Client review card quote widget.', icon: MessageSquare },
        { type: 'CTA', label: 'Call-to-Action', description: 'High-conversion banner with prompt buttons.', icon: Sparkles },
      ],
    },
    {
      title: 'Interactive & Embeds',
      icon: HelpCircle,
      items: [
        { type: 'FAQ', label: 'FAQ Block', description: 'Individual dynamic Question and Answer box.', icon: HelpCircle },
        { type: 'Accordion', label: 'Accordion Group', description: 'Collapsible structured detail folders.', icon: List },
        { type: 'Google Maps', label: 'Google Maps', description: 'Embed maps location widget.', icon: MapPin },
        { type: 'HTML', label: 'Custom HTML', description: 'Direct standard code embed script.', icon: Code },
        { type: 'Contact Form', label: 'Contact Form', description: 'Secure custom contact form submit grid.', icon: Mail },
        { type: 'Embed', label: 'Embed Iframe', description: 'Inject external iframe documents.', icon: Code },
      ],
    },
  ];

  // Filter blocks by search query
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const handleAddBlock = (type: string) => {
    if (selectedSectionId === null && sections.length > 0) {
      // Auto-add to the first section if none is selected
      addBlock(0, null, type);
    } else if (selectedSectionId !== null) {
      addBlock(selectedSectionId, null, type);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-300">
      {/* Search Input */}
      <div className="p-4 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="search-blocks"
            type="text"
            placeholder="Search blocks (e.g. Hero, Map)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        
        {/* Helper Tip */}
        <p className="text-[10px] text-zinc-500 mt-2 font-medium">
          {selectedSectionId !== null
            ? `Click block to append under Section #${selectedSectionId + 1}`
            : 'Select a section first on the canvas to add blocks.'}
        </p>
      </div>

      {/* Blocks list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filteredCategories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.title} className="space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                <CatIcon className="w-4 h-4 text-amber-500" />
                {cat.title}
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                {cat.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.type}
                      id={`palette-block-${item.type.toLowerCase()}`}
                      onClick={() => handleAddBlock(item.type)}
                      className="flex flex-col items-center justify-center p-3.5 bg-zinc-950/40 border border-zinc-850 hover:border-amber-500/50 hover:bg-zinc-800/20 rounded-xl text-center group transition-all"
                      title={item.description}
                    >
                      <ItemIcon className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                      <span className="text-[11px] font-bold text-zinc-300 mt-2 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-zinc-500">No blocks found matching query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default BlockPalette;
