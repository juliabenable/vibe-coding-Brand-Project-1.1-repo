/**
 * Floating theme switcher — pill-shaped FAB in bottom-right corner
 * Shows design philosophy previews (neutral swatches, not brand colors)
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { themeOrder, themes, type ThemeId } from "@/lib/themes";
import { Palette } from "lucide-react";

/**
 * Each theme preview shows 3 neutral swatches — the *personality* of the theme,
 * not the brand color (which is always purple).
 */
const themeSwatches: Record<ThemeId, { bg: string; card: string; accent: string }> = {
  original: { bg: "#FAFAFA", card: "#FFFFFF", accent: "#7C3AED" },
  precision: { bg: "#F5F5F7", card: "#FFFFFF", accent: "#7C3AED" },
  warm: { bg: "#FAFAF7", card: "#FFFDF9", accent: "#7C3AED" },
  playful: { bg: "#FAFAFF", card: "#FFFFFF", accent: "#7C3AED" },
  editorial: { bg: "#FFFFFF", card: "#FFFFFF", accent: "#7C3AED" },
};

export default function ThemeSwitcher() {
  const { themeId, setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-64 rounded-2xl border p-3 shadow-xl"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              Design Philosophy
            </p>
            <div className="flex flex-col gap-1">
              {themeOrder.map((id) => {
                const t = themes[id];
                const isActive = id === themeId;
                const swatch = themeSwatches[id];
                return (
                  <motion.button
                    key={id}
                    onClick={() => {
                      setTheme(id);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
                    style={{
                      backgroundColor: isActive ? "var(--accent)" : "transparent",
                      color: isActive ? "var(--accent-foreground)" : "var(--foreground)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {/* Swatch preview: bg + card + accent stacked */}
                    <div className="flex shrink-0 gap-0.5">
                      <div
                        className="h-5 w-3 rounded-l-md border"
                        style={{
                          backgroundColor: swatch.bg,
                          borderColor: "var(--border)",
                        }}
                      />
                      <div
                        className="h-5 w-3 border-y"
                        style={{
                          backgroundColor: swatch.card,
                          borderColor: "var(--border)",
                        }}
                      />
                      <div
                        className="h-5 w-3 rounded-r-md"
                        style={{
                          backgroundColor: swatch.accent,
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="leading-tight font-medium truncate">
                        {t.label}
                      </span>
                      <span
                        className="text-[10px] truncate"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {t.subtitle} · {t.inspiration}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="theme-check"
                        className="ml-auto text-xs shrink-0"
                        style={{ color: "var(--primary)" }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
        title={`Theme: ${theme.label}`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="size-5" />
        </motion.div>
      </motion.button>
    </div>
  );
}
