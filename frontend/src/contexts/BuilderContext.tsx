import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { pagesApi, PageData, PageSectionData, PageBlockData } from '../api/pages.api';

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';
export type SidebarTab = 'palette' | 'navigator' | 'history' | 'seo';

interface ClipboardData {
  type: 'section' | 'block';
  data: any;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface BuilderContextType {
  page: PageData | null;
  sections: PageSectionData[];
  selectedSectionId: number | null;
  selectedBlockId: string | null;
  activeBreakpoint: Breakpoint;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  history: PageSectionData[][];
  historyIndex: number;
  clipboard: ClipboardData | null;
  globalTheme: any;
  isLoading: boolean;
  isAutosaving: boolean;
  saveStatus: SaveStatus;
  
  // Actions
  loadPage: (id: number) => Promise<void>;
  savePage: () => Promise<void>;
  publishPage: () => Promise<void>;
  autosavePage: () => Promise<void>;
  
  // Sections
  addSection: (type: string) => void;
  deleteSection: (id: number) => void;
  duplicateSection: (id: number) => void;
  moveSection: (id: number, direction: 'up' | 'down') => void;
  selectSection: (id: number | null) => void;
  updateSectionProps: (id: number, props: any) => void;
  updateSectionStyles: (id: number, styles: any) => void;
  
  // Blocks
  addBlock: (sectionId: number, parentId: string | null, type: string) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  selectBlock: (blockId: string | null) => void;
  updateBlockProps: (blockId: string, props: any) => void;
  updateBlockStyles: (blockId: string, styles: any) => void;
  
  // History Control
  undo: () => void;
  redo: () => void;
  restoreVersion: (versionId: number) => Promise<void>;
  
  // Breakpoint Control
  setBreakpoint: (bp: Breakpoint) => void;
  
  // Clipboard Controls
  copySelected: () => void;
  pasteSelected: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const initialBlockProps = (type: string) => {
  switch (type) {
    case 'Hero':
      return {
        title: 'Enterprise Digital Solutions',
        subtitle: 'Unlocking exceptional brand experiences and business performance globally.',
        buttonText: 'Get Started Today',
        buttonLink: '#',
        height: '600px',
        overlayColor: '#000000',
        overlayOpacity: '0.4',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600',
        alignment: 'center',
      };
    case 'Heading':
      return { text: 'Outstanding Design System Header', level: 'h2', alignment: 'left' };
    case 'Paragraph':
      return { text: 'Deploy highly resilient web portals, headless microservices, and interactive dashboards using our crafted page builder core.', alignment: 'left' };
    case 'Button':
      return { text: 'Discover More', link: '#', styleType: 'primary', size: 'md' };
    case 'Image':
      return { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', alt: 'Corporate presentation' };
    case 'Gallery':
      return {
        images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
        ]
      };
    case 'Video':
      return { src: 'https://www.w3schools.com/html/mov_bbb.mp4', autoplay: false, loop: false, controls: true };
    case 'Divider':
      return { color: '#3f3f46', thickness: '1px', style: 'solid' };
    case 'Spacer':
      return { height: '40px' };
    case 'Container':
      return { width: 'full' };
    case 'Columns':
      return { count: 3 };
    case 'Card':
      return { title: 'Tailored Strategy', description: 'Transforming corporate workflows via automated services.', icon: 'award', buttonText: 'Explore', buttonLink: '#' };
    case 'Feature List':
      return { features: ['99.9% High Availability Slates', 'Pristine Drag & Drop Customizer', 'JSON-LD Integrated SEO Headers'] };
    case 'Pricing':
      return { title: 'Enterprise Tier', price: '$299', period: 'month', features: ['Unlimited Nesting Pages', 'Realtime Analytics Integration', '24/7 SLA Engineering Access'], active: true };
    case 'FAQ':
      return { question: 'How secure is the dynamic autosave pipeline?', answer: 'All visual layouts compile to standard, isolated, relational database structures with high-availability replication.' };
    case 'Accordion':
      return { title: 'Advanced Nesting Systems', content: 'You can combine Containers, Rows, and Columns into infinite layouts.' };
    case 'Testimonials':
      return { quote: 'The Elementor-like canvas and real-time previews enabled our marketing team to push multi-channel promotions in minutes.', author: 'Victoria Sterling', role: 'Head of Brand Marketing' };
    case 'CTA':
      return { title: 'Ready to Transform Your Corporate Web Presence?', subtitle: 'Speak with our design engineers today.', buttonText: 'Schedule Consult', buttonLink: '#' };
    case 'Google Maps':
      return { location: 'Jakarta, Indonesia', zoom: 12 };
    case 'HTML':
      return { code: '<div class="p-6 bg-amber-500 text-zinc-950 font-bold rounded-xl shadow-lg">Custom HTML Element</div>' };
    case 'Rich Text':
      return { content: '<h3>Accelerating Business Evolution</h3><p>We combine design <strong>craftsmanship</strong> with database consistency.</p>' };
    case 'Contact Form':
      return { submitText: 'Send Message', emailPlaceholder: 'your.email@enterprise.com', messagePlaceholder: 'Describe your custom workflow' };
    case 'Embed':
      return { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' };
    default:
      return {};
  }
};

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('desktop');
  const [activeTab, setActiveTab] = useState<SidebarTab>('palette');
  const [history, setHistory] = useState<PageSectionData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);
  const [globalTheme, setGlobalTheme] = useState<any>({
    primaryColor: '#f59e0b',
    backgroundColor: '#09090b',
    textColor: '#f4f4f5',
    fontFamily: 'font-sans',
    buttonRadius: 'rounded-lg',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAutosaving, setIsAutosaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Push new state onto undo stack
  const pushHistory = useCallback((newSections: PageSectionData[]) => {
    // Deep clone to prevent mutating state reference in the stack
    const cloned = JSON.parse(JSON.stringify(newSections));
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, cloned]);
    setHistoryIndex(nextHistory.length);
    setSaveStatus('unsaved');
  }, [history, historyIndex]);

  // Load page builder details
  const loadPage = async (id: number) => {
    setIsLoading(true);
    try {
      const p = await pagesApi.getPage(id);
      setPage(p);
      const initialSections = p.sections || [];
      
      // Parse JSON fields from string databases
      const parsedSections = initialSections.map((sec: any) => ({
        ...sec,
        props: typeof sec.props === 'string' ? JSON.parse(sec.props) : sec.props,
        styles: typeof sec.styles === 'string' ? JSON.parse(sec.styles) : sec.styles,
        blocks: (sec.blocks || []).map((b: any) => ({
          ...b,
          props: typeof b.props === 'string' ? JSON.parse(b.props) : b.props,
          styles: typeof b.styles === 'string' ? JSON.parse(b.styles) : b.styles,
        })),
      }));

      setSections(parsedSections);
      setHistory([JSON.parse(JSON.stringify(parsedSections))]);
      setHistoryIndex(0);
    } catch (e) {
      console.error('Failed to load page builder data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Save builder sections and blocks
  const savePage = async () => {
    if (!page) return;
    try {
      const updated = await pagesApi.saveBuilder(page.id, sections);
      setPage(updated);
    } catch (err) {
      console.error('Failed to save manual state:', err);
    }
  };

  // Publish workflow
  const publishPage = async () => {
    if (!page) return;
    try {
      const published = await pagesApi.publishPage(page.id);
      setPage(published);
    } catch (err) {
      console.error('Failed to publish page:', err);
    }
  };

  // Autosave action
  const autosavePage = useCallback(async () => {
    if (!page || sections.length === 0) return;
    setIsAutosaving(true);
    setSaveStatus('saving');
    try {
      const result = await pagesApi.autosave(page.id, sections);
      if (result && result.page) {
        setPage(result.page);
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('Autosave pipeline issue:', err);
      setSaveStatus('error');
    } finally {
      setIsAutosaving(false);
    }
  }, [page, sections]);

  const debouncedAutosave = useDebouncedCallback(() => {
    autosavePage();
  }, 5000);

  // Trigger debounced autosave on unsaved changes
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      debouncedAutosave();
    }
  }, [saveStatus, debouncedAutosave]);

  // Section Core Controls
  const addSection = (type: string) => {
    const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1;
    const newSection: PageSectionData = {
      order: nextOrder,
      type: type,
      props: { name: `Section ${nextOrder}` },
      styles: {
        paddingTop: '64px',
        paddingBottom: '64px',
        backgroundColor: '#09090b',
        backgroundImage: '',
      },
      blocks: [],
    };
    const nextSections = [...sections, newSection];
    setSections(nextSections);
    pushHistory(nextSections);
  };

  const deleteSection = (id: number) => {
    const nextSections = sections.filter((s, idx) => idx !== id);
    // Recalculate orders
    const reordered = nextSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reordered);
    pushHistory(reordered);
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const duplicateSection = (idx: number) => {
    const sectionToDup = sections[idx];
    if (!sectionToDup) return;
    const duplicated: PageSectionData = JSON.parse(JSON.stringify(sectionToDup));
    // Generate new unique ids for child blocks to prevent duplicate keys
    duplicated.blocks = duplicated.blocks.map((b) => ({
      ...b,
      id: `${b.type}_dup_${Math.random().toString(36).substr(2, 9)}`,
    }));
    const nextSections = [...sections];
    nextSections.splice(idx + 1, 0, duplicated);
    const reordered = nextSections.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(reordered);
    pushHistory(reordered);
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;
    
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const nextSections = [...sections];
    const temp = nextSections[idx];
    nextSections[idx] = nextSections[targetIdx];
    nextSections[targetIdx] = temp;

    const reordered = nextSections.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(reordered);
    pushHistory(reordered);
  };

  const selectSection = (idx: number | null) => {
    setSelectedSectionId(idx);
    setSelectedBlockId(null);
  };

  const updateSectionProps = (idx: number, props: any) => {
    const nextSections = [...sections];
    nextSections[idx] = {
      ...nextSections[idx],
      props: { ...nextSections[idx].props, ...props },
    };
    setSections(nextSections);
    pushHistory(nextSections);
  };

  const updateSectionStyles = (idx: number, styles: any) => {
    const nextSections = [...sections];
    nextSections[idx] = {
      ...nextSections[idx],
      styles: { ...nextSections[idx].styles, ...styles },
    };
    setSections(nextSections);
    pushHistory(nextSections);
  };

  // Block Controls
  const addBlock = (sectionIdx: number, parentId: string | null, type: string) => {
    const section = sections[sectionIdx];
    if (!section) return;

    // Generate unique random string ID for block
    const uniqueId = `${type}_${Math.random().toString(36).substr(2, 9)}`;
    const siblings = section.blocks.filter((b) => b.parentId === parentId);
    const nextOrder = siblings.length > 0 ? Math.max(...siblings.map(b => b.order)) + 1 : 1;

    const newBlock: PageBlockData = {
      id: uniqueId,
      parentId,
      order: nextOrder,
      type,
      props: initialBlockProps(type),
      styles: {
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '12px',
        paddingRight: '12px',
        color: '#f4f4f5',
        backgroundColor: 'transparent',
      },
    };

    const nextSections = [...sections];
    nextSections[sectionIdx] = {
      ...section,
      blocks: [...section.blocks, newBlock],
    };

    setSections(nextSections);
    pushHistory(nextSections);
    setSelectedBlockId(uniqueId);
  };

  const deleteBlock = (blockId: string) => {
    const nextSections = sections.map((sec) => {
      // Filter out block and its descendants
      const idsToDelete = new Set([blockId]);
      
      // Multi-pass to gather children
      let progress = true;
      while (progress) {
        const sizeBefore = idsToDelete.size;
        sec.blocks.forEach((b) => {
          if (b.parentId && idsToDelete.has(b.parentId)) {
            idsToDelete.add(b.id);
          }
        });
        progress = idsToDelete.size > sizeBefore;
      }

      return {
        ...sec,
        blocks: sec.blocks.filter((b) => !idsToDelete.has(b.id)),
      };
    });

    setSections(nextSections);
    pushHistory(nextSections);
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const duplicateBlock = (blockId: string) => {
    let parentSectionIdx = -1;
    let originalBlock: PageBlockData | null = null;

    sections.forEach((sec, sIdx) => {
      const match = sec.blocks.find(b => b.id === blockId);
      if (match) {
        parentSectionIdx = sIdx;
        originalBlock = match;
      }
    });

    if (parentSectionIdx === -1 || !originalBlock) return;
    const sec = sections[parentSectionIdx];

    // Gather children to duplicate them too
    const blockTreeIds = new Set([blockId]);
    let progress = true;
    while (progress) {
      const sizeBefore = blockTreeIds.size;
      sec.blocks.forEach((b) => {
        if (b.parentId && blockTreeIds.has(b.parentId)) {
          blockTreeIds.add(b.id);
        }
      });
      progress = blockTreeIds.size > sizeBefore;
    }

    const nextSections = [...sections];
    const mapOldToNew: Record<string, string> = {};

    const duplicatedBlocks: PageBlockData[] = [];
    sec.blocks.forEach((b) => {
      if (blockTreeIds.has(b.id)) {
        const newId = `${b.type}_dup_${Math.random().toString(36).substr(2, 9)}`;
        mapOldToNew[b.id] = newId;
        
        duplicatedBlocks.push({
          ...JSON.parse(JSON.stringify(b)),
          id: newId,
        });
      }
    });

    // Remap parent IDs
    duplicatedBlocks.forEach((b) => {
      if (b.parentId && mapOldToNew[b.parentId]) {
        b.parentId = mapOldToNew[b.parentId];
      } else if (b.id === mapOldToNew[blockId]) {
        // Keeps the same sibling parent
        b.parentId = (originalBlock as PageBlockData).parentId;
      }
    });

    nextSections[parentSectionIdx] = {
      ...sec,
      blocks: [...sec.blocks, ...duplicatedBlocks],
    };

    setSections(nextSections);
    pushHistory(nextSections);
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    let secIdx = -1;
    sections.forEach((sec, sIdx) => {
      if (sec.blocks.some(b => b.id === blockId)) secIdx = sIdx;
    });

    if (secIdx === -1) return;
    const sec = sections[secIdx];
    const block = sec.blocks.find(b => b.id === blockId)!;
    
    // Sort siblings under same parentId
    const siblings = sec.blocks
      .filter((b) => b.parentId === block.parentId)
      .sort((a, b) => a.order - b.order);

    const idx = siblings.findIndex(s => s.id === blockId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === siblings.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const siblingTarget = siblings[targetIdx];

    // Swap orders
    const nextSections = [...sections];
    nextSections[secIdx] = {
      ...sec,
      blocks: sec.blocks.map((b) => {
        if (b.id === blockId) {
          return { ...b, order: siblingTarget.order };
        }
        if (b.id === siblingTarget.id) {
          return { ...b, order: block.order };
        }
        return b;
      }),
    };

    setSections(nextSections);
    pushHistory(nextSections);
  };

  const selectBlock = (blockId: string | null) => {
    setSelectedBlockId(blockId);
    setSelectedSectionId(null);
  };

  const updateBlockProps = (blockId: string, props: any) => {
    const nextSections = sections.map((sec) => ({
      ...sec,
      blocks: sec.blocks.map((b) =>
        b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b
      ),
    }));
    setSections(nextSections);
    pushHistory(nextSections);
  };

  const updateBlockStyles = (blockId: string, styles: any) => {
    const nextSections = sections.map((sec) => ({
      ...sec,
      blocks: sec.blocks.map((b) =>
        b.id === blockId ? { ...b, styles: { ...b.styles, ...styles } } : b
      ),
    }));
    setSections(nextSections);
    pushHistory(nextSections);
  };

  // Undo / Redo Control
  const undo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setSections(JSON.parse(JSON.stringify(history[prevIdx])));
      setHistoryIndex(prevIdx);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setSections(JSON.parse(JSON.stringify(history[nextIdx])));
      setHistoryIndex(nextIdx);
    }
  };

  const restoreVersion = async (versionId: number) => {
    if (!page) return;
    setIsLoading(true);
    try {
      const updated = await pagesApi.restoreVersion(page.id, versionId);
      setPage(updated);
      const initialSections = updated.sections || [];
      const parsedSections = initialSections.map((sec: any) => ({
        ...sec,
        props: typeof sec.props === 'string' ? JSON.parse(sec.props) : sec.props,
        styles: typeof sec.styles === 'string' ? JSON.parse(sec.styles) : sec.styles,
        blocks: (sec.blocks || []).map((b: any) => ({
          ...b,
          props: typeof b.props === 'string' ? JSON.parse(b.props) : b.props,
          styles: typeof b.styles === 'string' ? JSON.parse(b.styles) : b.styles,
        })),
      }));

      setSections(parsedSections);
      pushHistory(parsedSections);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Set Breakpoint
  const setBreakpoint = (bp: Breakpoint) => {
    setActiveBreakpoint(bp);
  };

  // Copy paste operations
  const copySelected = () => {
    if (selectedBlockId) {
      // Find block
      let found: PageBlockData | null = null;
      sections.forEach((sec) => {
        const b = sec.blocks.find(bk => bk.id === selectedBlockId);
        if (b) found = b;
      });
      if (found) {
        setClipboard({ type: 'block', data: found });
      }
    } else if (selectedSectionId !== null) {
      const sec = sections[selectedSectionId];
      if (sec) {
        setClipboard({ type: 'section', data: sec });
      }
    }
  };

  const pasteSelected = () => {
    if (!clipboard) return;

    if (clipboard.type === 'section') {
      const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1;
      const pastedSec: PageSectionData = JSON.parse(JSON.stringify(clipboard.data));
      pastedSec.order = nextOrder;
      pastedSec.blocks = pastedSec.blocks.map((b) => ({
        ...b,
        id: `${b.type}_pasted_${Math.random().toString(36).substr(2, 9)}`,
      }));

      const nextSections = [...sections, pastedSec];
      setSections(nextSections);
      pushHistory(nextSections);
    } else if (clipboard.type === 'block' && selectedSectionId !== null) {
      const sec = sections[selectedSectionId];
      if (!sec) return;

      const pastedBlock: PageBlockData = JSON.parse(JSON.stringify(clipboard.data));
      const newId = `${pastedBlock.type}_pasted_${Math.random().toString(36).substr(2, 9)}`;
      
      pastedBlock.id = newId;
      pastedBlock.parentId = null; // pasted at root of section
      pastedBlock.order = sec.blocks.length > 0 ? Math.max(...sec.blocks.map(b => b.order)) + 1 : 1;

      const nextSections = [...sections];
      nextSections[selectedSectionId] = {
        ...sec,
        blocks: [...sec.blocks, pastedBlock],
      };

      setSections(nextSections);
      pushHistory(nextSections);
      setSelectedBlockId(newId);
    }
  };

  // Listen to keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Make sure we are not typing in input
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          if (selectedBlockId) {
            e.preventDefault();
            deleteBlock(selectedBlockId);
          } else if (selectedSectionId !== null) {
            e.preventDefault();
            deleteSection(selectedSectionId);
          }
        }
      }
      // Copy Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          copySelected();
        }
      }
      // Paste Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          pasteSelected();
        }
      }
      // Duplicate Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          if (selectedBlockId) {
            duplicateBlock(selectedBlockId);
          } else if (selectedSectionId !== null) {
            duplicateSection(selectedSectionId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, selectedSectionId, sections, clipboard, historyIndex, history]);

  return (
    <BuilderContext.Provider
      value={{
        page,
        sections,
        selectedSectionId,
        selectedBlockId,
        activeBreakpoint,
        activeTab,
        setActiveTab,
        history,
        historyIndex,
        clipboard,
        globalTheme,
        isLoading,
        isAutosaving,
        loadPage,
        savePage,
        publishPage,
        autosavePage,
        addSection,
        deleteSection,
        duplicateSection,
        moveSection,
        selectSection,
        updateSectionProps,
        updateSectionStyles,
        addBlock,
        deleteBlock,
        duplicateBlock,
        moveBlock,
        selectBlock,
        updateBlockProps,
        updateBlockStyles,
        undo,
        redo,
        restoreVersion,
        setBreakpoint,
        copySelected,
        pasteSelected,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
