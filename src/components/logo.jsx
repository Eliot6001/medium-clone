// src/components/Logo.jsx

import { useTheme } from "@/components/theme-provider";
import {cn} from '@/lib/utils'

const Logo = ({ className }) => {
  const { theme } = useTheme();
  return (
    <>
    <span  className={cn("rounded-full hover:bg-primary/20 p-2 transition-all duration-250")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 150"
        fill="none"
        stroke={theme === "dark" ? "#ffffff" : "#000000"} // White for dark theme, Black for light theme
        strokeWidth="10"
        strokeLinecap="round"
        className={className}
      >
        <path d="M10 140 Q30 50, 50 75 T90 10" />
        <path d="M90 140 Q70 50, 50 75 T10 10" />
      </svg>
      </span>
    </>
  );
}
export default Logo;

