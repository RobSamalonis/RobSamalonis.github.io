import { Home, Briefcase, MessageCircle } from 'lucide-react';
import { NavigationItem, NavigationConfig, FaviconConfig } from '../types/navigation';

// Modern navigation items with icons and descriptions
export const modernNavigationItems: NavigationItem[] = [
  {
    id: 'hero',
    label: 'Home',
    icon: Home,
    href: '#hero',
    description: 'Welcome & Introduction'
  },
  {
    id: 'resume',
    label: 'About Me',
    icon: Briefcase,
    href: '#resume',
    description: 'Professional Background'
  },
  {
    id: 'contact',
    label: 'Connect',
    icon: MessageCircle,
    href: '#contact',
    description: 'Get In Touch'
  }
];

// Default modern navigation configuration
export const defaultNavigationConfig: NavigationConfig = {
  items: modernNavigationItems,
  layout: 'horizontal',
  theme: 'glassmorphism',
  animations: {
    enabled: true,
    respectReducedMotion: true,
    intensity: 'moderate'
  }
};

// Favicon configuration
export const faviconConfig: FaviconConfig = {
  source: 'src/assets/profile-photo.jpg',
  sizes: [16, 32, 48, 180, 192, 512],
  formats: ['ico', 'png', 'svg'],
  appleTouchIcon: true,
  androidChrome: true,
  manifest: true
};

// Favicon generation configuration
export const faviconGeneration = {
  inputPath: 'src/assets/profile-photo.jpg',
  outputDir: 'public/favicons',
  sizes: {
    favicon: [16, 32, 48] as [16, 32, 48],
    appleTouchIcon: [57, 60, 72, 76, 114, 120, 144, 152, 180] as [57, 60, 72, 76, 114, 120, 144, 152, 180],
    androidChrome: [36, 48, 72, 96, 144, 192, 256, 384, 512] as [36, 48, 72, 96, 144, 192, 256, 384, 512]
  },
  formats: {
    ico: true,
    png: true,
    svg: true
  }
};