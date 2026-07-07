/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${className || ''}`}
      {...props}
    />
  );
}

export function LocationCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0c1226] border border-slate-200 dark:border-white/5 p-4 flex gap-4 animate-pulse">
      <Skeleton className="w-24 h-24 shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 w-1/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 w-1/2"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 w-1/3 mt-4"></div>
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 overflow-hidden animate-pulse">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 w-1/4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 w-5/6"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 w-2/3"></div>
        </div>
      </div>
    </div>
  );
}
