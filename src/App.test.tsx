import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders developer name in navigation', () => {
    render(<App />);
    const heading = screen.getByText(/Robert Samalonis/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(<App />);
    const homeButton = screen.getByRole('button', { name: /Home/i });
    const resumeButton = screen.getByRole('button', { name: /Resume/i });
    const contactButton = screen.getByRole('button', { name: /Contact/i });
    expect(homeButton).toBeInTheDocument();
    expect(resumeButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
  });

  test('renders hero section with correct id', () => {
    render(<App />);
    const { container } = render(<App />);
    const heroSection = container.querySelector('#hero');
    expect(heroSection).toBeInTheDocument();
  });
});
