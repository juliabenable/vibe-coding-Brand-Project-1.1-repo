/**
 * Theme Definitions — Benable Brand Portal
 *
 * DESIGN PRINCIPLE: The brand color (purple) never changes.
 * Differentiation comes from CRAFT: typography, spacing, shadow philosophy,
 * animation character, density, hover behavior, border treatment.
 *
 * Think: same accent color, completely different personality.
 * Like how Apple and Airbnb could both use blue — but feel nothing alike.
 */

export type ThemeId = "original" | "precision" | "warm" | "playful" | "editorial";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  subtitle: string;
  /** Design reference / inspiration */
  inspiration: string;
  /** Animation speed multiplier (1 = normal, <1 = faster, >1 = slower) */
  animationSpeed: number;
  /** Spring stiffness for bounce animations */
  springStiffness: number;
  /** Spring damping (lower = more bounce) */
  springDamping: number;
  /** Hover lift distance in px */
  hoverLiftPx: number;
  /** Card hover shadow color (rgba string) */
  hoverShadowColor: string;
  /** Whether to use dark mode */
  dark: boolean;
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  // ─── Original Benable ───
  original: {
    id: "original",
    label: "Benable",
    subtitle: "The original",
    inspiration: "Current brand",
    animationSpeed: 1,
    springStiffness: 500,
    springDamping: 25,
    hoverLiftPx: 4,
    hoverShadowColor: "rgba(124,58,237,0.12)",
    dark: false,
  },

  // ─── Precision — Apple-like: clean, systematic, controlled ───
  precision: {
    id: "precision",
    label: "Precision",
    subtitle: "Clean & systematic",
    inspiration: "Apple, Linear, Vercel",
    animationSpeed: 0.85,
    springStiffness: 600,
    springDamping: 35,
    hoverLiftPx: 2,
    hoverShadowColor: "rgba(0,0,0,0.08)",
    dark: false,
  },

  // ─── Warm — Airbnb-like: friendly, organic, human ───
  warm: {
    id: "warm",
    label: "Warm",
    subtitle: "Friendly & organic",
    inspiration: "Airbnb, Notion, Figma",
    animationSpeed: 1.05,
    springStiffness: 350,
    springDamping: 20,
    hoverLiftPx: 5,
    hoverShadowColor: "rgba(124,58,237,0.10)",
    dark: false,
  },

  // ─── Playful — Duolingo-like: bold, bouncy, energetic ───
  playful: {
    id: "playful",
    label: "Playful",
    subtitle: "Bold & bouncy",
    inspiration: "Duolingo, Figma, Stripe",
    animationSpeed: 0.8,
    springStiffness: 400,
    springDamping: 12,
    hoverLiftPx: 6,
    hoverShadowColor: "rgba(124,58,237,0.18)",
    dark: false,
  },

  // ─── Editorial — Magazine-like: dramatic, minimal, typographic ───
  editorial: {
    id: "editorial",
    label: "Editorial",
    subtitle: "Refined & typographic",
    inspiration: "Vogue, Medium, Dropbox",
    animationSpeed: 1.4,
    springStiffness: 300,
    springDamping: 30,
    hoverLiftPx: 2,
    hoverShadowColor: "rgba(0,0,0,0.05)",
    dark: false,
  },
};

export const themeOrder: ThemeId[] = ["original", "precision", "warm", "playful", "editorial"];
