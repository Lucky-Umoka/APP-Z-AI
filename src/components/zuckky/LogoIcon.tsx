'use client';
import { cn } from '@/lib/utils';
import Logo from '@/components/zuckky/Logo.svg';

const LogoIcon = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <Logo
      className={cn('h-full w-full', className)}
      {...props}
    />
  );
};

export default LogoIcon;
