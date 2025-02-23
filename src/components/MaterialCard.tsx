import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';

interface MaterialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: number;
  hover?: boolean;
  loading?: boolean;
  outlined?: boolean;
}

export const MaterialCard = forwardRef<HTMLDivElement, MaterialCardProps>(
  ({ className, elevation = 1, hover = false, loading = false, outlined = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg transition-all duration-200',
          outlined ? 'border border-gray-200' : `shadow-md`,
          hover && !outlined && 'hover:shadow-lg',
          loading && 'animate-pulse',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MaterialCard.displayName = 'MaterialCard';