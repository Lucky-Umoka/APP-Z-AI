
'use client';

import { cn } from '@/lib/utils';

const Logo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-sm bg-gradient-to-br from-primary via-primary/70 to-green-400 font-bold text-primary-foreground',
        className
      )}
      {...props}
    >
      <span className="text-lg">Z</span>
    </div>
  );
};

export default Logo;
