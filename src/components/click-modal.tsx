import React, { useState, CSSProperties } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ClickModalProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  position: { x: number; y: number };
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function ClickModal({
  open,
  onOpenChange,
  position,
  title = 'Click Modal',
  description,
  children,
}: ClickModalProps) {
  const calculatePosition = (): CSSProperties => {
    if (typeof window === 'undefined') return {};

    const modalWidth = 320;
    const modalHeight = 200;
    let x = position.x;
    let y = position.y;

    if (x + modalWidth > window.innerWidth) x -= modalWidth;
    if (y + modalHeight > window.innerHeight) y -= modalHeight;

    return {
      position: 'fixed',
      top: `${y}px`,
      left: `${x}px`,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={calculatePosition()} className='w-96'>
        <DialogHeader className='flex flex-row items-center justify-between'>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <DialogDescription>{description}</DialogDescription>}
        <div className='mt-4'>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
