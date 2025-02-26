import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'touch-manipulation select-none',
        
        // Size variants
        {
          'text-sm h-9 px-3': size === 'sm',
          'text-base h-11 px-4': size === 'md',
          'text-lg h-12 px-6': size === 'lg',
          
          // Color variants
          'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500':
            variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400':
            variant === 'secondary',
          'border-2 border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400':
            variant === 'outline',
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500':
            variant === 'danger',
          
          // Width control
          'w-full': fullWidth,
        },
        
        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}