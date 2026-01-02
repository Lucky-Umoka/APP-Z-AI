import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-primary", className)}
    {...props}
  >
    <path
      d="M5 5H19L5 19H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

export default Logo;
