import React from 'react';
import { cn } from '@/lib/utils';

export interface CtaGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const CtaGroup = React.forwardRef<HTMLDivElement, CtaGroupProps>(
  ({ 
    className, 
    size = 'md',
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cta-group',
          size === 'sm' && 'cta-group-sm',
          size === 'lg' && 'cta-group-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CtaGroup.displayName = 'CtaGroup';
