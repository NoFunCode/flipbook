import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PageFlip } from "page-flip";
import { PDFFlipbookProps, FlipbookState } from "./types";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Controls } from "./components/Controls";
import "./styles.css";

// Set up PDF.js worker - use custom path if provided, otherwise use CDN
const setWorkerSrc = (customSrc?: string): void => {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    customSrc ??
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
};

export const PDFFlipbook: React.FC<PDFFlipbookProps> = ({
  source,
  width = "100%",
  height = "auto",
  startPage = 1,
  showControls = true,
  showPageNumber = true,
  singlePageMobile = true,
  workerSrc,
  onPageChange,
  onLoad,
  onError,
  loadingComponent,
  errorComponent,
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<PageFlip | null>(null);
  const canvasElementsRef = useRef<HTMLCanvasElement[]>([]);
  const [state, setState] = useState<FlipbookState>({
    isLoading: true,
    error: null,
    totalPages: 0,
    currentPage: startPage,
    pdfDocument: null,
  });
  const [isMobile, setIsMobile] = useState(false);

  // Initialize worker
  useEffect(() => {
    setWorkerSrc(workerSrc);
  }, [workerSrc]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load PDF document
  useEffect(() => {
    let isCancelled = false;

    const loadPDF = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        let loadingTask;
        if (typeof source === "string") {
          loadingTask = pdfjsLib.getDocument(source);
        } else if (source instanceof ArrayBuffer) {
          loadingTask = pdfjsLib.getDocument({ data: source });
        } else if (source instanceof File) {
          const arrayBuffer = await source.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        } else {
          throw new Error("Invalid PDF source type");
        }

        const pdf = await loadingTask.promise;

        if (isCancelled) return;

        setState((prev) => ({
          ...prev,
          pdfDocument: pdf,
          totalPages: pdf.numPages,
          isLoading: false,
        }));

        onLoad?.(pdf.numPages);
      } catch (error) {
        if (isCancelled) return;
        const err =
          error instanceof Error ? error : new Error("Failed to load PDF");
        setState((prev) => ({
          ...prev,
          error: err,
          isLoading: false,
        }));
        onError?.(err);
      }
    };

    loadPDF();

    return () => {
      isCancelled = true;
    };
  }, [source, onLoad, onError]);

  // Render PDF pages to canvas elements
  useEffect(() => {
    if (!state.pdfDocument || !containerRef.current) return;

    const renderPages = async () => {
      const container = containerRef.current;
      if (!container) return;

      // Clear previous pages properly
      const flipbookContainer = container.querySelector(".flipbook-pages");
      if (!flipbookContainer) return;

      // Remove all child nodes and cleanup canvas elements
      while (flipbookContainer.firstChild) {
        const child = flipbookContainer.firstChild;
        if (child instanceof HTMLCanvasElement) {
          // Clear canvas context to free memory
          const ctx = child.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, child.width, child.height);
          }
        }
        flipbookContainer.removeChild(child);
      }

      // Clear stored canvas references
      canvasElementsRef.current = [];

      const pages: HTMLCanvasElement[] = [];

      for (let pageNum = 1; pageNum <= state.pdfDocument.numPages; pageNum++) {
        const page = await state.pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        canvas.className = "flipbook-page";
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.setAttribute("data-page", pageNum.toString());

        const context = canvas.getContext("2d");
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
          }).promise;
        }

        flipbookContainer.appendChild(canvas);
        pages.push(canvas);
      }

      // Store canvas references for cleanup
      canvasElementsRef.current = pages;

      // Initialize PageFlip
      if (flipbookContainer && pages.length > 0) {
        const useDoublePages = !isMobile || !singlePageMobile;

        flipbookRef.current = new PageFlip(flipbookContainer as HTMLElement, {
          width: pages[0].width / (useDoublePages ? 2 : 1),
          height: pages[0].height,
          size: useDoublePages ? "stretch" : "fixed",
          minWidth: 315,
          maxWidth: 1000,
          minHeight: 400,
          maxHeight: 1533,
          showCover: true,
          mobileScrollSupport: true,
          swipeDistance: 30,
          clickEventForward: true,
          usePortrait: !useDoublePages,
          startPage: startPage - 1,
          autoSize: true,
          maxShadowOpacity: 0.5,
          drawShadow: true,
          flippingTime: 1000,
          useMouseEvents: true,
          startZIndex: 0,
          disableFlipByClick: false,
        });

        // Note: toDataURL() is required by page-flip library for image-based rendering
        // This creates memory overhead for large PDFs but is necessary for the flip animation
        flipbookRef.current.loadFromImages(
          pages.map((canvas) => canvas.toDataURL("image/jpeg", 0.85)),
        );

        flipbookRef.current.on("flip", (e: unknown) => {
          const newPage = (e as { data: number }).data + 1;
          setState((prev) => ({ ...prev, currentPage: newPage }));
          onPageChange?.(newPage);
        });
      }
    };

    renderPages();

    return () => {
      // Cleanup flipbook instance
      if (flipbookRef.current) {
        flipbookRef.current.destroy();
        flipbookRef.current = null;
      }

      // Cleanup canvas elements
      canvasElementsRef.current.forEach((canvas) => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
      canvasElementsRef.current = [];
    };
  }, [state.pdfDocument, startPage, isMobile, singlePageMobile, onPageChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!flipbookRef.current) return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          flipbookRef.current.flipPrev();
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          flipbookRef.current.flipNext();
          break;
        case "Home":
          e.preventDefault();
          flipbookRef.current.flip(0);
          break;
        case "End":
          e.preventDefault();
          flipbookRef.current.flip(state.totalPages - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.totalPages]);

  const handlePrevPage = useCallback(() => {
    if (flipbookRef.current) {
      flipbookRef.current.flipPrev();
    }
  }, []);

  const handleNextPage = useCallback(() => {
    if (flipbookRef.current) {
      flipbookRef.current.flipNext();
    }
  }, []);

  if (state.isLoading) {
    return (
      <div
        className={`flipbook-container ${className}`}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
      >
        {loadingComponent || <LoadingSpinner />}
      </div>
    );
  }

  if (state.error) {
    return (
      <div
        className={`flipbook-container ${className}`}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
      >
        {errorComponent || <ErrorDisplay error={state.error} />}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flipbook-container ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      role="region"
      aria-label="PDF Flipbook"
    >
      <div
        className="flipbook-pages"
        role="document"
        aria-label={`PDF document with ${state.totalPages} pages`}
      />
      {showControls && (
        <Controls
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          showPageNumber={showPageNumber}
        />
      )}
    </div>
  );
};
