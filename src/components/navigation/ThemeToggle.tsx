import { useTheme } from "@/hooks/useTheme";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const themeToggle = (): void => {
        setTheme(isDark ? "light" : "dark");
    };
    const ThemeIcon = isDark ? Sun : Moon;

    return (
        <Button
            variant="outline"
            size="icon"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={themeToggle}
            className="bg-[#ffffff] border-none cursor-pointer text-[#222222] dark:bg-[#0a0a0a] dark:text-[#f9fafb] hover:bg-[#f3f4f6] hover:dark:bg-[#18181b]"
        >
            <ThemeIcon aria-hidden="true" className="size-5" />
        </Button>
    );
}