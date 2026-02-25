/**
 * Theme Definitions for Benable Brand Portal
 * 5 distinct design personalities — each changes colors, animations, radii, shadows, and vibe
 */

export type ThemeId = "original" | "dynamic" | "calm" | "playful" | "editorial";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  emoji: string;
  description: string;
  /** Animation speed multiplier (1 = normal, <1 = faster, >1 = slower) */
  animationSpeed: number;
  /** Spring stiffness for bounce animations */
  springStiffness: number;
  /** Spring damping */
  springDamping: number;
  /** Hover lift distance in px */
  hoverLiftPx: number;
  /** Card hover shadow color (rgba string) */
  hoverShadowColor: string;
  /** Border radius base in rem */
  radiusBase: number;
  /** Font family override (or null for default) */
  fontFamily: string | null;
  /** Heading font weight */
  headingWeight: number;
  /** Whether to use dark mode */
  dark: boolean;
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  // ─── Theme 1: Original Benable Purple ───
  original: {
    id: "original",
    label: "Original",
    emoji: "💜",
    description: "Classic Benable purple",
    animationSpeed: 1,
    springStiffness: 500,
    springDamping: 25,
    hoverLiftPx: 4,
    hoverShadowColor: "rgba(124,58,237,0.12)",
    radiusBase: 0.75,
    fontFamily: null,
    headingWeight: 700,
    dark: false,
  },

  // ─── Theme 2: Dynamic & Young — electric, bold, energetic ───
  dynamic: {
    id: "dynamic",
    label: "Dynamic",
    emoji: "⚡",
    description: "Electric & energetic",
    animationSpeed: 0.7,
    springStiffness: 700,
    springDamping: 18,
    hoverLiftPx: 8,
    hoverShadowColor: "rgba(6,182,212,0.2)",
    radiusBase: 0.375,
    fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, sans-serif",
    headingWeight: 700,
    dark: false,
  },

  // ─── Theme 3: Calm & Serene — soft, muted, zen ───
  calm: {
    id: "calm",
    label: "Serene",
    emoji: "🍃",
    description: "Soft & peaceful",
    animationSpeed: 1.6,
    springStiffness: 200,
    springDamping: 30,
    hoverLiftPx: 2,
    hoverShadowColor: "rgba(101,163,134,0.1)",
    radiusBase: 1.25,
    fontFamily: "'Lora', 'Georgia', serif",
    headingWeight: 500,
    dark: false,
  },

  // ─── Theme 4: Playful & Fun — candy, bouncy, whimsical ───
  playful: {
    id: "playful",
    label: "Playful",
    emoji: "🍬",
    description: "Candy & whimsical",
    animationSpeed: 0.85,
    springStiffness: 400,
    springDamping: 12,
    hoverLiftPx: 6,
    hoverShadowColor: "rgba(236,72,153,0.15)",
    radiusBase: 1.5,
    fontFamily: "'Nunito', 'Inter', ui-sans-serif, sans-serif",
    headingWeight: 800,
    dark: false,
  },

  // ─── Theme 5: Wild Card — Editorial Noir (luxury dark mode) ───
  editorial: {
    id: "editorial",
    label: "Editorial",
    emoji: "✦",
    description: "Luxury dark mode",
    animationSpeed: 1.4,
    springStiffness: 300,
    springDamping: 28,
    hoverLiftPx: 3,
    hoverShadowColor: "rgba(212,175,55,0.15)",
    radiusBase: 0.25,
    fontFamily: "'Playfair Display', 'Georgia', serif",
    headingWeight: 300,
    dark: true,
  },
};

export const themeOrder: ThemeId[] = ["original", "dynamic", "calm", "playful", "editorial"];
