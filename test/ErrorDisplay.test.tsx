import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '../src/components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('should render error message', () => {
    const error = new Error('Test error message');
    render(<ErrorDisplay error={error} />);
    
    expect(screen.getByText('Failed to Load PDF')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should have alert role for accessibility', () => {
    const error = new Error('Test error');
    render(<ErrorDisplay error={error} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should display error icon', () => {
    const error = new Error('Test error');
    const { container } = render(<ErrorDisplay error={error} />);
    
    const icon = container.querySelector('.error-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
