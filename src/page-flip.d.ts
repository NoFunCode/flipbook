declare module "page-flip" {
  export interface PageFlipOptions {
    width?: number;
    height?: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    usePortrait?: boolean;
    startPage?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    useMouseEvents?: boolean;
    startZIndex?: number;
    disableFlipByClick?: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options?: PageFlipOptions);
    loadFromImages(images: string[]): void;
    loadFromHTML(nodes: HTMLElement[]): void;
    on(event: string, callback: (e: unknown) => void): void;
    off(event: string): void;
    flipNext(): void;
    flipPrev(): void;
    flip(page: number): void;
    destroy(): void;
  }
}
