export interface PDFFlipbookProps {
  /**
   * PDF source - can be a URL string, File object, or ArrayBuffer
   */
  source: string | File | ArrayBuffer;

  /**
   * Width of the flipbook container
   * @default '100%'
   */
  width?: number | string;

  /**
   * Height of the flipbook container
   * @default 'auto'
   */
  height?: number | string;

  /**
   * Initial page to display (1-indexed)
   * @default 1
   */
  startPage?: number;

  /**
   * Show page controls (next/prev buttons)
   * @default true
   */
  showControls?: boolean;

  /**
   * Show page number indicator
   * @default true
   */
  showPageNumber?: boolean;

  /**
   * Enable single page mode on mobile devices
   * @default true
   */
  singlePageMobile?: boolean;

  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback when PDF loads successfully
   */
  onLoad?: (totalPages: number) => void;

  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;

  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;

  /**
   * Custom error component
   */
  errorComponent?: React.ReactNode;

  /**
   * Class name for the container
   */
  className?: string;

  /**
   * Custom styles for the container
   */
  style?: React.CSSProperties;
}

export interface FlipbookState {
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  pdfDocument: unknown | null;
}
