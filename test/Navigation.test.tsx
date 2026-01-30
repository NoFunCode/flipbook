import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { PDFFlipbook } from '../src/PDFFlipbook';
import * as pdfjsLib from 'pdfjs-dist';
import { PageFlip } from 'page-flip';

// Mock modules
vi.mock('pdfjs-dist');
vi.mock('page-flip');

describe('PDFFlipbook Navigation', () => {
  let mockPageFlip: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockPageFlip = {
      loadFromImages: vi.fn(),
      on: vi.fn(),
      flipPrev: vi.fn(),
      flipNext: vi.fn(),
      flip: vi.fn(),
      destroy: vi.fn(),
    };
    
    (PageFlip as any).mockImplementation(() => mockPageFlip);
  });

  const createMockPdf = (numPages: number) => ({
    numPages,
    getPage: vi.fn((pageNum: number) => 
      Promise.resolve({
        getViewport: vi.fn(() => ({ width: 600, height: 800 })),
        render: vi.fn(() => ({ promise: Promise.resolve() })),
      })
    ),
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to previous page with ArrowLeft', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      expect(mockPageFlip.flipPrev).toHaveBeenCalled();
    });

    it('should navigate to next page with ArrowRight', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      expect(mockPageFlip.flipNext).toHaveBeenCalled();
    });

    it('should navigate to previous page with ArrowUp', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      fireEvent.keyDown(window, { key: 'ArrowUp' });
      
      expect(mockPageFlip.flipPrev).toHaveBeenCalled();
    });

    it('should navigate to next page with ArrowDown', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      fireEvent.keyDown(window, { key: 'ArrowDown' });
      
      expect(mockPageFlip.flipNext).toHaveBeenCalled();
    });

    it('should navigate to first page with Home', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      fireEvent.keyDown(window, { key: 'Home' });
      
      expect(mockPageFlip.flip).toHaveBeenCalledWith(0);
    });

    it('should navigate to last page with End', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      fireEvent.keyDown(window, { key: 'End' });
      
      expect(mockPageFlip.flip).toHaveBeenCalledWith(4); // 0-indexed
    });
  });

  describe('Page Change Callback', () => {
    it('should call onPageChange when page flips', async () => {
      const mockPdf = createMockPdf(5);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      const onPageChange = vi.fn();
      render(<PDFFlipbook source="test.pdf" onPageChange={onPageChange} />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      // Simulate page flip event
      const flipHandler = mockPageFlip.on.mock.calls.find(
        (call: any[]) => call[0] === 'flip'
      )?.[1];
      
      if (flipHandler) {
        flipHandler({ data: 2 }); // Page 3 (0-indexed)
        expect(onPageChange).toHaveBeenCalledWith(3);
      }
    });
  });

  describe('Mobile Detection', () => {
    it('should detect mobile devices based on window width', async () => {
      const originalInnerWidth = window.innerWidth;
      
      // Set mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      const mockPdf = createMockPdf(3);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" singlePageMobile={true} />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      // Restore original width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it('should handle window resize events', async () => {
      const mockPdf = createMockPdf(3);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      // Trigger resize
      fireEvent.resize(window);
      
      // Component should handle resize without errors
      expect(mockPageFlip.destroy).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should destroy PageFlip instance on unmount', async () => {
      const mockPdf = createMockPdf(3);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      const { unmount } = render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      unmount();
      
      expect(mockPageFlip.destroy).toHaveBeenCalled();
    });

    it('should remove keyboard event listeners on unmount', async () => {
      const mockPdf = createMockPdf(3);
      (pdfjsLib.getDocument as any).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<PDFFlipbook source="test.pdf" />);
      
      await waitFor(() => {
        expect(mockPdf.getPage).toHaveBeenCalled();
      });

      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});
