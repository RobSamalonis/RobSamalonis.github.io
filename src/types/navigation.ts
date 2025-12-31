import { LucideIcon } from 'lucide-react';

// Modern Navigation Interfaces
export interface ModernNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  scrollProgress?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  description?: string;
}

export interface NavigationState {
  isScrolled: boolean;
  activeSection: string;
  hoverIndex: number | null;
  isMenuOpen: boolean;
}

export interface GlassmorphismBarProps {
  children: React.ReactNode;
  isScrolled: boolean;
  className?: string;
}

export interface MicroInteractionConfig {
  type: 'hover' | 'click' | 'focus' | 'active';
  animation: any; // Will be properly typed with Framer Motion
  sound?: boolean;
  haptic?: boolean;
}

export interface NavigationIndicator {
  position: number;
  width: number;
  opacity: number;
  scale: number;
}

export interface ParticleEffect {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  life: number;
  color: string;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
  currentSection: string;
}

export interface FloatingActionButton {
  icon: LucideIcon;
  label: string;
  action: () => void;
  variant: 'primary' | 'secondary';
}

export interface BottomNavigation {
  items: NavigationItem[];
  activeIndex: number;
  onItemSelect: (index: number) => void;
}

// Navigation Configuration
export interface NavigationConfig {
  items: NavigationItem[];
  layout: 'horizontal' | 'floating' | 'bottom';
  theme: 'glassmorphism' | 'neumorphism' | 'minimal';
  animations: {
    enabled: boolean;
    respectReducedMotion: boolean;
    intensity: 'subtle' | 'moderate' | 'enhanced';
  };
}

// Favicon System Configuration
export interface FaviconConfig {
  source: string; // Path to avatar image
  sizes: number[];
  formats: ('ico' | 'png' | 'svg')[];
  appleTouchIcon: boolean;
  androidChrome: boolean;
  manifest: boolean;
}

export interface FaviconGeneration {
  inputPath: string;
  outputDir: string;
  sizes: {
    favicon: [16, 32, 48];
    appleTouchIcon: [57, 60, 72, 76, 114, 120, 144, 152, 180];
    androidChrome: [36, 48, 72, 96, 144, 192, 256, 384, 512];
  };
  formats: {
    ico: boolean;
    png: boolean;
    svg: boolean;
  };
}

// Modern Navigation Theme
export interface ModernNavigationTheme {
  glassmorphism: {
    background: string;
    backdropFilter: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
  };
  microInteractions: {
    hover: any; // Will be properly typed with Framer Motion
    active: any;
    focus: any;
  };
  spacing: {
    navigationHeight: string;
    itemSpacing: string;
    mobileBreakpoint: string;
  };
}