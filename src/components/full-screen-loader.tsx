'use client';

import type * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FullScreenLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the loader
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * The text to display below the loader
   */
  text?: string;

  /**
   * Whether to show the loader
   * @default true
   */
  isLoading?: boolean;

  /**
   * The opacity of the background
   * @default 100
   */
  opacity?: 0 | 25 | 50 | 75 | 90 | 95 | 100;
}

export function FullScreenLoader({
  size = 'md',
  text,
  isLoading = true,
  opacity = 100,
  className,
  ...props
}: FullScreenLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity / 100})` }}
      className='fixed inset-0 z-50 flex flex-col items-center justify-center h-screen'
      {...props}
    >
      <Loader2
        className={cn('animate-spin text-secondary', {
          'h-6 w-6': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-16 w-16': size === 'lg',
        })}
      />
      {text && (
        <p className='mt-4 text-center text-sm text-muted-foreground'>{text}</p>
      )}
    </div>
  );
}
