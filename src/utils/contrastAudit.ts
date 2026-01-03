/**
 * Comprehensive contrast audit utility for WCAG 2.1 AA/AAA compliance
 * Analyzes all color combinations used in the portfolio and provides recommendations
 */

import { ColorContrast } from './accessibility';

// Current color palette from theme
export const currentColors = {
  primary: {
    black: '#000000',
    darkGray: '#1a1a1a',
    mediumGray: '#2d2d2d',
  },
  accent: {
    electricBlue: '#00ffff',
    hotPink: '#ff1493',
    neonGreen: '#39ff14',
    vibrantPurple: '#8a2be2',
    brightOrange: '#ff4500',
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#e0e0e0',         // Now matches the improved version
    mediumGray: '#b0b0b0',        // Much brighter for better readability
  },
};

// Improved colors for better accessibility
export const improvedColors = {
  primary: {
    black: '#000000',
    darkGray: '#1a1a1a',
    mediumGray: '#2d2d2d',
  },
  accent: {
    // Improved accent colors with better contrast
    electricBlue: '#00d4ff',      // Slightly darker for better contrast
    hotPink: '#ff1493',           // Keep as is - good contrast
    neonGreen: '#00ff41',         // Slightly adjusted for better readability
    vibrantPurple: '#9d4edd',     // Lighter for better contrast on dark backgrounds
    brightOrange: '#ff6b35',      // Adjusted for better contrast
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#e0e0e0',         // Improved from #cccccc for better contrast
    mediumGray: '#b0b0b0',        // Much brighter for better readability
  },
};

export interface ContrastResult {
  combination: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  isLargeText?: boolean;
  recommendation?: string;
  improvedForeground?: string;
  improvedBackground?: string;
  improvedRatio?: number;
}

export class ContrastAuditor {
  /**
   * Audit all critical color combinations in the portfolio
   */
  static auditAllCombinations(): ContrastResult[] {
    const results: ContrastResult[] = [];

    // Critical text combinations
    const textCombinations = [
      // Main text on backgrounds
      { name: 'White text on black background', fg: currentColors.neutral.white, bg: currentColors.primary.black },
      { name: 'Light gray text on black background', fg: currentColors.neutral.lightGray, bg: currentColors.primary.black },
      { name: 'Medium gray text on black background', fg: currentColors.neutral.mediumGray, bg: currentColors.primary.black },
      
      // Accent text on dark backgrounds
      { name: 'Electric blue text on black background', fg: currentColors.accent.electricBlue, bg: currentColors.primary.black },
      { name: 'Hot pink text on black background', fg: currentColors.accent.hotPink, bg: currentColors.primary.black },
      { name: 'Neon green text on black background', fg: currentColors.accent.neonGreen, bg: currentColors.primary.black },
      { name: 'Vibrant purple text on black background', fg: currentColors.accent.vibrantPurple, bg: currentColors.primary.black },
      
      // Text on dark gray backgrounds (cards)
      { name: 'White text on dark gray background', fg: currentColors.neutral.white, bg: currentColors.primary.darkGray },
      { name: 'Light gray text on dark gray background', fg: currentColors.neutral.lightGray, bg: currentColors.primary.darkGray },
      { name: 'Electric blue text on dark gray background', fg: currentColors.accent.electricBlue, bg: currentColors.primary.darkGray },
      
      // Button text combinations
      { name: 'Black text on electric blue background', fg: currentColors.primary.black, bg: currentColors.accent.electricBlue },
      { name: 'White text on hot pink background', fg: currentColors.neutral.white, bg: currentColors.accent.hotPink },
      { name: 'Black text on neon green background', fg: currentColors.primary.black, bg: currentColors.accent.neonGreen },
    ];

    // Large text combinations (headings, buttons)
    const largeTextCombinations = [
      { name: 'Electric blue heading on black background', fg: currentColors.accent.electricBlue, bg: currentColors.primary.black, large: true },
      { name: 'Hot pink heading on black background', fg: currentColors.accent.hotPink, bg: currentColors.primary.black, large: true },
      { name: 'White heading on black background', fg: currentColors.neutral.white, bg: currentColors.primary.black, large: true },
    ];

    // Process all combinations
    [...textCombinations, ...largeTextCombinations].forEach(combo => {
      const ratio = ColorContrast.getContrastRatio(combo.fg, combo.bg);
      const wcagAA = ColorContrast.meetsWCAGAA(combo.fg, combo.bg, combo.large);
      const wcagAAA = ColorContrast.meetsWCAGAAA(combo.fg, combo.bg, combo.large);
      
      const result: ContrastResult = {
        combination: combo.name,
        foreground: combo.fg,
        background: combo.bg,
        ratio: Math.round(ratio * 100) / 100,
        wcagAA,
        wcagAAA,
        isLargeText: combo.large,
      };

      // Add recommendations for failing combinations
      if (!wcagAA) {
        result.recommendation = this.getRecommendation(combo.fg, combo.bg, combo.large);
        const improved = this.getImprovedColors(combo.fg, combo.bg);
        if (improved) {
          result.improvedForeground = improved.foreground;
          result.improvedBackground = improved.background;
          result.improvedRatio = Math.round(ColorContrast.getContrastRatio(improved.foreground, improved.background) * 100) / 100;
        }
      }

      results.push(result);
    });

    return results;
  }

  /**
   * Get recommendation for improving contrast
   */
  private static getRecommendation(foreground: string, background: string, isLargeText = false): string {
    const ratio = ColorContrast.getContrastRatio(foreground, background);
    const requiredRatio = isLargeText ? 3 : 4.5;
    const recommendedRatio = isLargeText ? 4.5 : 7;
    
    if (ratio < requiredRatio) {
      return `Current ratio ${ratio.toFixed(2)} is below WCAG AA minimum of ${requiredRatio}. Consider darkening foreground or lightening background.`;
    } else if (ratio < recommendedRatio) {
      return `Current ratio ${ratio.toFixed(2)} meets WCAG AA but not AAA (${recommendedRatio}). Consider further adjustments for optimal accessibility.`;
    }
    
    return 'Contrast ratio is acceptable.';
  }

  /**
   * Get improved color suggestions
   */
  private static getImprovedColors(foreground: string, background: string): { foreground: string; background: string } | null {
    // Map current colors to improved versions
    const colorMap: Record<string, string> = {
      [currentColors.accent.electricBlue]: improvedColors.accent.electricBlue,
      [currentColors.accent.neonGreen]: improvedColors.accent.neonGreen,
      [currentColors.accent.vibrantPurple]: improvedColors.accent.vibrantPurple,
      [currentColors.accent.brightOrange]: improvedColors.accent.brightOrange,
      [currentColors.neutral.lightGray]: improvedColors.neutral.lightGray,
      [currentColors.neutral.mediumGray]: improvedColors.neutral.mediumGray,
    };

    const improvedFg = colorMap[foreground] || foreground;
    const improvedBg = colorMap[background] || background;

    // Only return if there's an actual improvement
    if (improvedFg !== foreground || improvedBg !== background) {
      return { foreground: improvedFg, background: improvedBg };
    }

    return null;
  }

  /**
   * Generate a comprehensive audit report
   */
  static generateAuditReport(): string {
    const results = this.auditAllCombinations();
    const failing = results.filter(r => !r.wcagAA);
    const passing = results.filter(r => r.wcagAA);
    const excellent = results.filter(r => r.wcagAAA);

    let report = '# Accessibility Contrast Audit Report\n\n';
    
    report += `## Summary\n`;
    report += `- Total combinations tested: ${results.length}\n`;
    report += `- WCAG AA compliant: ${passing.length}/${results.length} (${Math.round(passing.length / results.length * 100)}%)\n`;
    report += `- WCAG AAA compliant: ${excellent.length}/${results.length} (${Math.round(excellent.length / results.length * 100)}%)\n`;
    report += `- Failing combinations: ${failing.length}\n\n`;

    if (failing.length > 0) {
      report += `## ⚠️ Failing Combinations (WCAG AA)\n\n`;
      failing.forEach(result => {
        report += `### ${result.combination}\n`;
        report += `- **Current ratio:** ${result.ratio}:1\n`;
        report += `- **Required:** ${result.isLargeText ? '3:1' : '4.5:1'} (WCAG AA)\n`;
        report += `- **Recommendation:** ${result.recommendation}\n`;
        if (result.improvedForeground && result.improvedBackground) {
          report += `- **Improved colors:** ${result.improvedForeground} on ${result.improvedBackground}\n`;
          report += `- **Improved ratio:** ${result.improvedRatio}:1\n`;
        }
        report += '\n';
      });
    }

    report += `## ✅ Passing Combinations\n\n`;
    passing.forEach(result => {
      const status = result.wcagAAA ? '🌟 AAA' : '✅ AA';
      report += `- ${result.combination}: ${result.ratio}:1 ${status}\n`;
    });

    return report;
  }

  /**
   * Get CSS custom properties for improved colors
   */
  static getImprovedCSSVariables(): string {
    return `
/* Improved color palette for better accessibility */
:root {
  /* Improved accent colors with better contrast ratios */
  --color-accent-electric-blue-improved: ${improvedColors.accent.electricBlue};
  --color-accent-neon-green-improved: ${improvedColors.accent.neonGreen};
  --color-accent-vibrant-purple-improved: ${improvedColors.accent.vibrantPurple};
  --color-accent-bright-orange-improved: ${improvedColors.accent.brightOrange};
  
  /* Improved neutral colors */
  --color-neutral-light-gray-improved: ${improvedColors.neutral.lightGray};
  --color-neutral-medium-gray-improved: ${improvedColors.neutral.mediumGray};
}
`;
  }
}

export default ContrastAuditor;