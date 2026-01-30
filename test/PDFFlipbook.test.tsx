import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PDFFlipbook } from '../src/PDFFlipbook';
import * as pdfjsLib from 'pdfjs-dist';

// Mock pdfjs-dist
vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  version: '3.0.0',
  getDocument: vi.fn(),
}));

// Mock page-flip
vi.mock('page-flip', () => ({
  PageFlip: vi.fn().mockImplementation(() => ({
    loadFromImages: vi.fn(),
    on: vi.fn(),
    flipPrev: vi.fn(),
    flipNext: vi.fn(),
    flip: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe('PDFFlipbook', () => {
  const mockPdfUrl = 'https://example.com/test.pdf';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render loading state initially', () => {
      const mockGetDocument = vi.fn(() => ({
        promise: new Promise(() => {}), // Never resolves
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockPdfUrl} />);
      
      expect(screen.getByText('Loading PDF...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render custom loading component when provided', () => {
      const mockGetDocument = vi.fn(() => ({
        promise: new Promise(() => {}),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const customLoading = <div>Custom Loading...</div>;
      render(<PDFFlipbook source={mockPdfUrl} loadingComponent={customLoading} />);
      
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('should render error state when PDF fails to load', async () => {
      const mockError = new Error('Failed to load PDF');
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.reject(mockError),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockPdfUrl} />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to Load PDF')).toBeInTheDocument();
      });
    });

    it('should render custom error component when provided', async () => {
      const mockError = new Error('Test error');
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.reject(mockError),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const customError = <div>Custom Error Display</div>;
      render(<PDFFlipbook source={mockPdfUrl} errorComponent={customError} />);
      
      await waitFor(() => {
        expect(screen.getByText('Custom Error Display')).toBeInTheDocument();
      });
    });

    it('should apply custom className and style', () => {
      const mockGetDocument = vi.fn(() => ({
        promise: new Promise(() => {}),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const { container } = render(
        <PDFFlipbook 
          source={mockPdfUrl} 
          className="custom-class"
          style={{ backgroundColor: 'red' }}
        />
      );
      
      const flipbookContainer = container.querySelector('.flipbook-container');
      expect(flipbookContainer).toHaveClass('custom-class');
      expect(flipbookContainer).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  describe('PDF Loading', () => {
    it('should load PDF from URL string', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: vi.fn((pageNum: number) => 
          Promise.resolve({
            getViewport: vi.fn(() => ({ width: 600, height: 800 })),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      };
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.resolve(mockPdf),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const onLoad = vi.fn();
      render(<PDFFlipbook source={mockPdfUrl} onLoad={onLoad} />);
      
      await waitFor(() => {
        expect(mockGetDocument).toHaveBeenCalledWith(mockPdfUrl);
        expect(onLoad).toHaveBeenCalledWith(5);
      });
    });

    it('should load PDF from ArrayBuffer', async () => {
      const mockArrayBuffer = new ArrayBuffer(100);
      const mockPdf = {
        numPages: 3,
        getPage: vi.fn((pageNum: number) => 
          Promise.resolve({
            getViewport: vi.fn(() => ({ width: 600, height: 800 })),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      };
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.resolve(mockPdf),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockArrayBuffer} />);
      
      await waitFor(() => {
        expect(mockGetDocument).toHaveBeenCalledWith({ data: mockArrayBuffer });
      });
    });

    it('should load PDF from File object', async () => {
      const mockArrayBuffer = new ArrayBuffer(100);
      const mockFile = {
        name: 'test.pdf',
        type: 'application/pdf',
        size: 100,
        arrayBuffer: vi.fn(() => Promise.resolve(mockArrayBuffer)),
      } as any;
      
      const mockPdf = {
        numPages: 2,
        getPage: vi.fn((pageNum: number) => 
          Promise.resolve({
            getViewport: vi.fn(() => ({ width: 600, height: 800 })),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      };
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.resolve(mockPdf),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockFile} />);
      
      await waitFor(() => {
        expect(mockGetDocument).toHaveBeenCalled();
      });
    });

    it('should call onError callback when PDF fails to load', async () => {
      const mockError = new Error('Load failed');
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.reject(mockError),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const onError = vi.fn();
      render(<PDFFlipbook source={mockPdfUrl} onError={onError} />);
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: vi.fn((pageNum: number) => 
          Promise.resolve({
            getViewport: vi.fn(() => ({ width: 600, height: 800 })),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      };
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.resolve(mockPdf),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockPdfUrl} />);
      
      await waitFor(() => {
        const container = screen.getByRole('region', { name: 'PDF Flipbook' });
        expect(container).toBeInTheDocument();
      });
    });

    it('should have live region for loading state', () => {
      const mockGetDocument = vi.fn(() => ({
        promise: new Promise(() => {}),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockPdfUrl} />);
      
      const loadingStatus = screen.getByRole('status');
      expect(loadingStatus).toHaveAttribute('aria-live', 'polite');
    });

    it('should have alert role for error state', async () => {
      const mockError = new Error('Test error');
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.reject(mockError),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockPdfUrl} />);
      
      await waitFor(() => {
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
      });
    });
  });

  describe('Configuration', () => {
    it('should respect startPage prop', async () => {
      const mockPdf = {
        numPages: 10,
        getPage: vi.fn((pageNum: number) => 
          Promise.resolve({
            getViewport: vi.fn(() => ({ width: 600, height: 800 })),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      };
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.resolve(mockPdf),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      render(<PDFFlipbook source={mockPdfUrl} startPage={5} />);
      
      await waitFor(() => {
        expect(mockGetDocument).toHaveBeenCalled();
      });
    });

    it('should hide controls when showControls is false', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: vi.fn((pageNum: number) => 
          Promise.resolve({
            getViewport: vi.fn(() => ({ width: 600, height: 800 })),
            render: vi.fn(() => ({ promise: Promise.resolve() })),
          })
        ),
      };
      const mockGetDocument = vi.fn(() => ({
        promise: Promise.resolve(mockPdf),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const { container } = render(<PDFFlipbook source={mockPdfUrl} showControls={false} />);
      
      await waitFor(() => {
        expect(mockGetDocument).toHaveBeenCalled();
      });
      
      const controls = container.querySelector('.flipbook-controls');
      expect(controls).not.toBeInTheDocument();
    });

    it('should apply custom width and height', () => {
      const mockGetDocument = vi.fn(() => ({
        promise: new Promise(() => {}),
      }));
      (pdfjsLib.getDocument as any).mockImplementation(mockGetDocument);

      const { container } = render(
        <PDFFlipbook source={mockPdfUrl} width={800} height={600} />
      );
      
      const flipbookContainer = container.querySelector('.flipbook-container');
      expect(flipbookContainer).toHaveStyle({ width: '800px', height: '600px' });
    });
  });
});
