import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MaterialCard } from './MaterialCard';

describe('MaterialCard', () => {
  it('renders children correctly', () => {
    render(
      <MaterialCard>
        <div data-testid="test-content">Test Content</div>
      </MaterialCard>
    );
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies elevation classes correctly', () => {
    const { container } = render(
      <MaterialCard elevation={2}>Content</MaterialCard>
    );
    expect(container.firstChild).toHaveStyle('--md-elevation: 2');
  });

  it('handles click events when not disabled', () => {
    const handleClick = vi.fn();
    render(<MaterialCard onClick={handleClick}>Content</MaterialCard>);
    fireEvent.click(screen.getByText('Content'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('prevents click events when disabled', () => {
    const handleClick = vi.fn();
    render(
      <MaterialCard onClick={handleClick} disabled>
        Content
      </MaterialCard>
    );
    fireEvent.click(screen.getByText('Content'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    const { container } = render(
      <MaterialCard loading>Content</MaterialCard>
    );
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('applies outlined style correctly', () => {
    const { container } = render(
      <MaterialCard outlined>Content</MaterialCard>
    );
    expect(container.firstChild).toHaveClass('border');
  });
});