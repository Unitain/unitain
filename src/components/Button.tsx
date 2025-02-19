import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'touch-manipulation select-none', // Optimize for touch
        // Improved tap target and spacing for mobile
        'min-w-[44px] min-h-[44px]',
        'text-base leading-normal tracking-normal',
        // Variants with improved contrast
        {
          'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500':
            variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400':
            variant === 'secondary',
          'border-2 border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400':
            variant === 'outline',
          // Responsive sizes with improved touch targets
          'px-4 py-2.5 text-sm md:text-base': size === 'sm',
          'px-6 py-3 text-base md:text-lg': size === 'md',
          'px-8 py-4 text-lg md:text-xl': size === 'lg',
        },
        // Mobile-specific adjustments
        'md:min-w-0 md:min-h-0', // Reset min dimensions on desktop
        'w-full md:w-auto', // Full width on mobile
        'mb-2 md:mb-0', // Add spacing between stacked buttons on mobile
        className
      )}
      {...props}
    />
  );
}