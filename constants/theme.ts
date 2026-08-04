/**
 * Deepsta Design Tokens & Color Psychology Palette
 * 
 * Color Psychology:
 * - Magenta / Neon Coral (#FF3B70): Triggers enthusiasm, social connection, and dopamine response.
 * - Electric Violet (#8A2BE2 / #A239EA): Evokes creativity, premium feel, and visual depth.
 * - Deep Obsidian Canvas (#0B0E17): Reduces eye fatigue, accentuates vibrant media content.
 * - Electric Cyan (#00F2FE): Adds focused callouts and high-trust interactive visual cues.
 */

import { Platform } from 'react-native';

export const BrandColors = {
  primaryGradient: ['#FF3B70', '#A239EA', '#4F46E5'] as const,
  primaryGradientHorizontal: ['#FF3B70', '#9333EA', '#3B82F6'] as const,
  secondaryGradient: ['#00F2FE', '#4FACFE'] as const,
  cardGradient: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'] as const,
  inputGradient: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)'] as const,
  glowMagenta: '#FF3B70',
  glowViolet: '#8A2BE2',
  glowCyan: '#00F2FE',
  electricCyan: '#00F2FE',
  electricViolet: '#8A2BE2',
  bgDark: '#090C15',
  bgCardDark: '#131826',
  bgInputDark: '#1C2234',
  borderDark: 'rgba(255, 255, 255, 0.12)',
  borderActive: '#FF3B70',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#F43F5E',
};

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: '#FF3B70',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#FF3B70',
  },
  dark: {
    text: '#F8FAFC',
    background: '#090C15',
    tint: '#FF3B70',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#FF3B70',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

