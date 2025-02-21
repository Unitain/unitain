import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '../lib/utils';

/**
 * MaterialCard component props following Material Design v1.8.0 specifications
 * @typedef {Object} MaterialCardProps
 */
export interface MaterialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional CSS classes to apply to the card */
  className?: string;
  /** Primary content of the card */
  children: React.ReactNode;
  /** Optional elevation level (1-24) */
  elevation?: number;
  /** Whether the card is outlined instead of elevated */
  outlined?: boolean;
  /** Whether to apply hover elevation effect */
  hover?: boolean;
  /** Optional click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
}

/**
 * MaterialCard component ref interface
 * @typedef {Object} MaterialCardRef
 */
export interface MaterialCardRef {
  /** Reference to the underlying DOM element */
  element: HTMLDivElement | null;
  /** Forces a re-render of the card */
  forceUpdate: () => void;
  /** Scrolls the card into view */
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
}

/**
 * MaterialCard component following Material Design v1.8.0 specifications
 * @component
 * @example
 * ```tsx
 * <MaterialCard elevation={2} hover>
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </MaterialCard>
 * ```
 */
export const MaterialCard = forwardRef<MaterialCardRef, MaterialCardProps>(
  (
    {
      className,
      children,
      elevation = 1,
      outlined = false,
      hover = false,
      onClick,
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Validate elevation range
    const validElevation = Math.max(1, Math.min(24, elevation));
    const cardRef = useRef<HTMLDivElement>(null);

    // Handle errors and loading states
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [disabled, loading, onClick]
    );

    // Expose ref methods
    useImperativeHandle(
      ref,
      () => ({
        element: cardRef.current,
        forceUpdate: () => {
          if (cardRef.current) {
            const display = cardRef.current.style.display;
            cardRef.current.style.display = 'none';
            void cardRef.current.offsetHeight;
            cardRef.current.style.display = display;
          }
        },
        scrollIntoView: (options?: ScrollIntoViewOptions) => {
          cardRef.current?.scrollIntoView(options);
        },
      }),
      []
    );

    return (
      <div
        ref={cardRef}
        className={cn(
          // Base styles
          'rounded-lg transition-shadow duration-200',
          // Elevation or outline styles
          outlined
            ? 'border border-gray-200'
            : `shadow-md hover:shadow-lg`,
          // Hover effect
          hover && !disabled && !outlined && 'hover:shadow-xl',
          // Loading state
          loading && 'animate-pulse',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',
          // Custom classes
          className
        )}
        style={{
          '--md-elevation': outlined ? '0' : validElevation,
        } as React.CSSProperties}
        onClick={handleClick}
        aria-disabled={disabled}
        {...props}
      >
        <div className="relative overflow-hidden">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-gray-200 opacity-50 z-10" />
          )}
          
          {/* Card content */}
          <div className={cn('p-4', loading && 'opacity-50')}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

MaterialCard.displayName = 'MaterialCard';