// src/components/Logo.jsx

import { useTheme } from "@/components/theme-provider";

const Logo = ({className }) => {
  const {theme} = useTheme();
  return (
    <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 150"
      fill="none"
      stroke={theme == "dark" ? "#4b4b4b" : "#3f3f46"}// Rock color
      strokeWidth="10"
      strokeLinecap="round"
      className={className}
    >
      <path d="M10 140 Q30 50, 50 75 T90 10" />
      <path d="M90 140 Q70 50, 50 75 T10 10" />
    </svg>
    </>
  );
}
export default Logo;

