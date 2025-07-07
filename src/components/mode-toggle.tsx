import { Moon, Sun } from "lucide-react"
import {useState} from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme()  
  const [light, setLight] = useState<boolean>(true)
  const handleTheme = () => {
    setLight(!light);
    if (light) setTheme("light");
    else setTheme("dark");
  }
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild >
        <Button variant="ghost" size="icon" onClick={handleTheme} className={`${className} mt-0 px-1.5`}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" size={28}/>
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" size={28} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>)
}
