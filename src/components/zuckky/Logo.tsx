
'use client';
import { cn } from '@/lib/utils';

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H9V12H11V16ZM15 16H13V12H15V16ZM12 10C11.45 10 11 9.55 11 9V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V9C13 9.55 12.55 10 12 10Z"
        fill="url(#paint0_linear_1_2)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_2"
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#39FF14" />
          <stop offset="1" stopColor="#00C0FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
