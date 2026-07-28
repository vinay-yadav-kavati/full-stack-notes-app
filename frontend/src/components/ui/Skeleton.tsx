import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Reusable Skeleton base component with smooth shimmer / pulse animation.
 */
export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/70 ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton Note Card representing a note while loading.
 * Contains title, content (2-3 lines), date, and action icons placeholders.
 */
export function NoteCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 bg-white dark:bg-[#1E293B] shadow-2xs flex flex-col justify-between space-y-4 animate-pulse">
      <div>
        {/* Top Header: Title & Action Icons Placeholders */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Title Placeholder */}
          <Skeleton className="h-5 w-2/3 rounded-md" />

          {/* Action Icons Placeholder (4 icon placeholders) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="w-7 h-7 rounded-lg" />
          </div>
        </div>

        {/* Content Placeholder (2-3 lines of text) */}
        <div className="space-y-2 mb-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded" />
          <Skeleton className="h-3.5 w-1/2 rounded" />
        </div>
      </div>

      {/* Footer: Category Tag & Date Placeholder */}
      <div className="pt-3 border-t border-[#E2E8F0]/60 dark:border-[#334155]/60 flex items-center justify-between">
        {/* Category Tag Placeholder */}
        <Skeleton className="h-6 w-16 rounded-lg" />

        {/* Date Placeholder */}
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton User Profile representing avatar and username while user data is loading.
 */
export function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-2.5 p-1 animate-pulse">
      {/* Avatar Skeleton */}
      <Skeleton className="w-9 h-9 rounded-xl shrink-0" />

      {/* Username & Email Skeleton */}
      <div className="hidden md:flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-2.5 w-16 rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for full page transitions.
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] p-6 flex flex-col justify-center items-center space-y-4">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-48 h-4 rounded-lg" />
      <Skeleton className="w-32 h-3 rounded-lg" />
    </div>
  );
}
