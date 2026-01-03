'use client';
import { cn } from '@/lib/utils';
import React from 'react';

const Logo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 font-bold text-white',
        className
      )}
      {...props}
    >
      Z
    </div>
  );
};

export default Logo;
