import { createContext, 
         useEffect, 
         useState, 
         useCallback, 
         type ReactNode,
         useMemo } from "react";
type Theme = "light" | "dark";
type ThemeContextValue = {
    readonly theme: Theme;
    readonly setTheme: (theme: Theme) => void;
}
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY="lokestays-theme";
function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function getInitialTheme(storageKey: string): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return storedTheme !== null && isTheme(storedTheme)
      ? storedTheme
      : "light";
  } catch {
    return "light";
  }
}

type ThemeProviderProps = {
  readonly children: ReactNode;
  readonly defaultTheme?: Theme;
  readonly storageKey?: string;
};

export default function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = STORAGE_KEY,
}: ThemeProviderProps): React.JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = getInitialTheme(storageKey);

    // Use the configured default when no valid preference is saved.
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    try {
      const storedValue = window.localStorage.getItem(storageKey);

      return storedValue !== null && isTheme(storedValue)
        ? storedTheme
        : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const setTheme = useCallback(
    (nextTheme: Theme): void => {
      setThemeState(nextTheme);

      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch (error: unknown) {
        console.warn(
          "[ThemeProvider] Failed to persist theme preference:",
          error,
        );
      }
    },
    [storageKey],
  );

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = theme;
  }, [theme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}