'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

const Logo = ({ className, ...props }: React.ComponentProps<typeof Image>) => (
  <Image
    src="/logo.png"
    alt="Zuckky AI Logo"
    width={24}
    height={24}
    className={cn(className)}
    {...props}
  />
);

export default Logo;
