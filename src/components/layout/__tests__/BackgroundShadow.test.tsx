import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../styles';
import BackgroundShadow from '../BackgroundShadow';

describe('BackgroundShadow', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  describe('Initial Render', () => {
    it('should render shadow in correct position on page load', () => {
      renderWithTheme(<BackgroundShadow headerHeight={80} />);
      
      const shadowElement = screen.getByTestId('background-shadow');
      
      // Verify shadow exists
      expect(shadowElement).toBeInTheDocument();
      
      // Verify shadow uses fixed positioning
      const styles = window.getComputedStyle(shadowElement);
      expect(styles.position).toBe('fixed');
      
      // Verify shadow is positioned at the top
      expect(styles.top).toBe('0px');
      
      // Verify shadow spans full width
      expect(styles.left).toBe('0px');
      expect(styles.right).toBe('0px');
    });

    it('should render with correct height based on headerHeight prop', () => {
      const headerHeight = 80;
      renderWithTheme(<BackgroundShadow headerHeight={headerHeight} />);
      
      const shadowElement = screen.getByTestId('background-shadow');
      const styles = window.getComputedStyle(shadowElement);
      
      // Shadow height should match header height
      expect(styles.height).toBe(`${headerHeight}px`);
    });

    it('should have proper z-index for layering', () => {
      renderWithTheme(<BackgroundShadow headerHeight={80} />);
      
      const shadowElement = screen.getByTestId('background-shadow');
      const styles = window.getComputedStyle(shadowElement);
      
      // Shadow should be behind the header (lower z-index)
      const zIndex = parseInt(styles.zIndex);
      expect(zIndex).toBeLessThan(1200); // MUI AppBar default z-index
    });
  });
});
