import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from '../src/components/Controls';

describe('Controls', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPrevPage: vi.fn(),
    onNextPage: vi.fn(),
    showPageNumber: true,
  };

  it('should render navigation controls', () => {
    render(<Controls {...defaultProps} />);
    
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('should display page number when showPageNumber is true', () => {
    render(<Controls {...defaultProps} currentPage={3} totalPages={10} />);
    
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  it('should not display page number when showPageNumber is false', () => {
    render(<Controls {...defaultProps} showPageNumber={false} />);
    
    expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
  });

  it('should call onPrevPage when previous button is clicked', () => {
    const onPrevPage = vi.fn();
    render(<Controls {...defaultProps} currentPage={5} onPrevPage={onPrevPage} />);
    
    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);
    
    expect(onPrevPage).toHaveBeenCalledTimes(1);
  });

  it('should call onNextPage when next button is clicked', () => {
    const onNextPage = vi.fn();
    render(<Controls {...defaultProps} onNextPage={onNextPage} />);
    
    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);
    
    expect(onNextPage).toHaveBeenCalledTimes(1);
  });

  it('should disable previous button on first page', () => {
    render(<Controls {...defaultProps} currentPage={1} />);
    
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Controls {...defaultProps} currentPage={10} totalPages={10} />);
    
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('should enable both buttons on middle pages', () => {
    render(<Controls {...defaultProps} currentPage={5} />);
    
    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');
    
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('should have navigation role for accessibility', () => {
    const { container } = render(<Controls {...defaultProps} />);
    
    const nav = container.querySelector('[role="navigation"]');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Page navigation');
  });

  it('should have live region for page indicator', () => {
    render(<Controls {...defaultProps} />);
    
    const pageIndicator = screen.getByText('Page 1 of 10');
    expect(pageIndicator).toHaveAttribute('aria-live', 'polite');
    expect(pageIndicator).toHaveAttribute('aria-atomic', 'true');
  });

  it('should have descriptive titles on buttons', () => {
    render(<Controls {...defaultProps} />);
    
    expect(screen.getByTitle('Previous page (Arrow Left)')).toBeInTheDocument();
    expect(screen.getByTitle('Next page (Arrow Right)')).toBeInTheDocument();
  });
});
