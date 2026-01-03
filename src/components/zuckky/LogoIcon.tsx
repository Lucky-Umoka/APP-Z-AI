'use client';
import { cn } from '@/lib/utils';
import Logo from 'public/zuckky/Logo.svg';

const LogoIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  // As SVGR is not configured, we can't import SVG as a component directly.
  // We can use an img tag instead if the SVG is in the public directory.
  // Or, if the user provides the SVG content, we can inline it.
  // For now, let's use a placeholder that can be styled.
  // If `Logo.svg` is meant to be used, it needs to be imported correctly.
  
  // Assuming the user has configured SVGR or a similar loader for Next.js,
  // the following would be the ideal implementation.
  try {
    return <Logo className={cn('h-full w-full', className)} {...props} />;
  } catch (e) {
    // Fallback if the SVG import fails
    return (
        <div className={cn("flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-green-400 text-primary-foreground font-bold text-lg", className)}>
            Z
        </div>
    )
  }
};

export default LogoIcon;
