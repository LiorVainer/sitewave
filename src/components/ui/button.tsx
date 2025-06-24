import { cn } from '@/lib/utils';
import React from 'react';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'gradient';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
    gradient:
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
  };

  const sizeClasses = {
    default: 'h-12 px-4 py-2',
    sm: 'h-9 rounded-lg px-3 text-xs',
    lg: 'h-12 rounded-lg px-6',
    icon: 'h-12 w-12',
  };

  return (
    <button className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';
