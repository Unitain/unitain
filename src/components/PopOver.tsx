import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface PopOverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  offset?: number;
  closeOnClickOutside?: boolean;
}

export function PopOver({
  trigger,
  content,
  placement = 'bottom',
  className,
  offset = 8,
  closeOnClickOutside = true,
}: PopOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside]);

  const getPlacementStyles = () => {
    const baseStyles = 'absolute z-50';
    switch (placement) {
      case 'top':
        return `${baseStyles} bottom-full left-1/2 -translate-x-1/2 mb-${offset}`;
      case 'bottom':
        return `${baseStyles} top-full left-1/2 -translate-x-1/2 mt-${offset}`;
      case 'left':
        return `${baseStyles} right-full top-1/2 -translate-y-1/2 mr-${offset}`;
      case 'right':
        return `${baseStyles} left-full top-1/2 -translate-y-1/2 ml-${offset}`;
      default:
        return baseStyles;
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>
      <div
        ref={contentRef}
        className={cn(
          getPlacementStyles(),
          'bg-white rounded-lg shadow-lg border border-gray-200',
          'transition-all duration-200 ease-in-out',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}