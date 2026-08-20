import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  goldGlow?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    goldGlow = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn admin-button',
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'tertiary' && 'btn-tertiary',
          variant === 'whatsapp' && 'btn-whatsapp',
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          fullWidth && 'btn-full',
          goldGlow && 'btn-glow-glow',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  goldGlow?: boolean;
  href: string;
  children: React.ReactNode;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    goldGlow = false,
    href,
    children, 
    ...props 
  }, ref) => {
    return (
      <Link
        ref={ref as any}
        href={href}
        className={cn(
          'btn',
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'tertiary' && 'btn-tertiary',
          variant === 'whatsapp' && 'btn-whatsapp',
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          fullWidth && 'btn-full',
          goldGlow && 'btn-glow-glow',
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

LinkButton.displayName = 'LinkButton';
