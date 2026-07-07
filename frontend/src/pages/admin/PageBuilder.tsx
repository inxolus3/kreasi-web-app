import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BuilderProvider, useBuilder } from '../../contexts/BuilderContext';
import { Toolbar } from '../../components/builder/Toolbar';
import { Sidebar } from '../../components/builder/Sidebar';
import { Canvas } from '../../components/builder/Canvas';
import { PropertyPanel } from '../../components/builder/PropertyPanel';
import { Loader2 } from 'lucide-react';

const BuilderInner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loadPage, isLoading, page } = useBuilder();

  useEffect(() => {
    if (id) {
      loadPage(parseInt(id, 10));
    }
  }, [id]);

  if (isLoading && !page) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-zinc-400 text-sm font-semibold tracking-wide">
          Loading Page Canvas Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top action toolbar */}
      <Toolbar />

      {/* Main Builder Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidepanel: Palette, Navigator, History */}
        <Sidebar />

        {/* Center Live Interactive Canvas Viewport */}
        <Canvas />

        {/* Right Sidepanel: Property and Styling Inspector */}
        <div className="w-80 h-full border-l border-zinc-800 bg-zinc-900 flex flex-col shrink-0 overflow-hidden">
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
};

export const PageBuilder: React.FC = () => {
  return (
    <BuilderProvider>
      <BuilderInner />
    </BuilderProvider>
  );
};

export default PageBuilder;
