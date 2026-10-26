import { createContext, useEffect, useState, useCallback, type ReactNode } from "react";
type Theme = "light" | "dark" | "system";
type ThemeContextValue = {
    readonly theme: Theme;
    readonly setTheme: (theme: Theme) => void;
}
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY="lokestays-theme";
function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark" || value === "system"
}

function getInitialTheme(): Theme {
  if(typeof window === "undefined") return "system";
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    return storedTheme && isTheme(storedTheme) ? storedTheme : "system"
  } catch {
    return "system"
  }
}
type ThemeProviderProps = {
    readonly children: ReactNode;
    readonly defaultTheme?: Theme;
    readonly storageKey?: string;
}
export default function ThemeProvider(
    {children, defaultTheme = "system", storageKey = STORAGE_KEY}: ThemeProviderProps): ReactNode{
    const [theme, setThemeState] = useState<Theme>(() => {
        const initial = getInitialTheme();
        return initial === "system" && defaultTheme !== "system" ? defaultTheme : initial;
    })
    const setTheme = useCallback((nextTheme: Theme) => {
     setThemeState(nextTheme);
     try {
        localStorage.setItem(storageKey, nextTheme);
     }catch(error: unknown){
        console.warn(`[ThemeProvider] Failed to persist theme to localStorage:`, error)
     }
    }, [storageKey]);
    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
            root.classList.toggle("dark", isDark);
            root.style.colorScheme = isDark ? "dark" : "light";
        }
        applyTheme();
        if(theme !== "system") return;
        mediaQuery.addEventListener("change", applyTheme);
        return () => mediaQuery.removeEventListener("change", applyTheme);

    }, [theme]);
    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}