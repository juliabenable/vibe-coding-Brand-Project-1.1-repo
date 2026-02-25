/**
 * Floating theme switcher — pill-shaped FAB in bottom-right corner
 * Expands on click to show all 5 themes with color previews
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { themeOrder, themes } from "@/lib/themes";
import { Palette } from "lucide-react";

// Color preview dots for each theme
const themePreviewColors: Record<string, string[]> = {
  original: ["#7C3AED", "#A78BFA", "#EC4899"],
  dynamic: ["#0891B2", "#06B6D4", "#F43F5E"],
  calm: ["#3D8B50", "#6BB87D", "#8B6F47"],
  playful: ["#E11D69", "#FBBF24", "#06B6D4"],
  editorial: ["#D4AF37", "#F5F5F7", "#111113"],
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
            className="absolute bottom-16 right-0 w-56 rounded-2xl border p-3 shadow-xl"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              Switch Theme
            </p>
            <div className="flex flex-col gap-1">
              {themeOrder.map((id) => {
                const t = themes[id];
                const isActive = id === themeId;
                const colors = themePreviewColors[id];
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
                    {/* Color preview dots */}
                    <div className="flex -space-x-1.5 shrink-0">
                      {colors.map((c, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border-2"
                          style={{
                            backgroundColor: c,
                            borderColor: id === "editorial" ? "#3A3A3C" : "#FFFFFF",
                            zIndex: 3 - i,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <span className="leading-tight">
                        {t.emoji} {t.label}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {t.description}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="theme-check"
                        className="ml-auto text-xs"
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
