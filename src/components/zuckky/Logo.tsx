'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const Logo = ({ className, ...props }: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => {
  const logoImage = PlaceHolderImages.find(img => img.id === 'logo') || PlaceHolderImages[0];
  
  return (
    <Image
      src={logoImage.imageUrl}
      alt="Zuckky AI Logo"
      width={24}
      height={24}
      className={cn('rounded-sm', className)}
      {...props}
    />
  );
};

export default Logo;
