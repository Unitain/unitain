import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${sizeClasses[size]} ${className}`}
        role="status"
        aria-label={t('common.loading')}
      />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}