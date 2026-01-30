# PDF Flipbook Component

A responsive, accessible React TypeScript component for rendering PDFs as interactive flipbooks using react-pdf and page-flip.

[![npm](https://img.shields.io/npm/v/@nofuncode/flipbook?style=flat-square)](https://www.npmjs.com/package/@nofuncode/flipbook)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Features

- 📱 **Responsive & Mobile-Friendly** - Automatically adapts to mobile devices with single-page mode
- 🎨 **Works Out-of-the-Box** - Sensible defaults for immediate use
- ♿ **Accessible** - Full ARIA support and keyboard navigation
- ⌨️ **Keyboard Navigation** - Arrow keys, Home, End support
- 👆 **Touch-Friendly** - Swipe gestures for mobile devices
- 🎭 **Customizable** - Loading and error states, styling options
- 🔄 **Flexible Input** - Accepts URL, File, or ArrayBuffer
- 🎯 **TypeScript** - Full type definitions included

## Installation

```bash
npm install @nofuncode/flipbook react react-dom
```

## Quick Start

```tsx
import { PDFFlipbook } from '@nofuncode/flipbook';
import '@nofuncode/flipbook/dist/index.css';

function App() {
  return (
    <PDFFlipbook 
      source="https://example.com/document.pdf"
      width="100%"
      height="600px"
    />
  );
}
```

## Usage Examples

### From URL

```tsx
<PDFFlipbook source="https://example.com/document.pdf" />
```

### From File Input

```tsx
function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  
  return (
    <>
      <input 
        type="file" 
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      {file && <PDFFlipbook source={file} />}
    </>
  );
}
```

### From ArrayBuffer

```tsx
const arrayBuffer = await fetch('/document.pdf').then(r => r.arrayBuffer());
<PDFFlipbook source={arrayBuffer} />
```

### Custom Configuration

```tsx
<PDFFlipbook 
  source="document.pdf"
  width={800}
  height={600}
  startPage={5}
  showControls={true}
  showPageNumber={true}
  singlePageMobile={true}
  workerSrc="/path/to/pdf.worker.min.js" // Optional: custom worker path
  onPageChange={(page) => console.log('Current page:', page)}
  onLoad={(totalPages) => console.log('Total pages:', totalPages)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Custom Loading/Error States

```tsx
<PDFFlipbook 
  source="document.pdf"
  loadingComponent={<div>Custom loading...</div>}
  errorComponent={<div>Custom error message</div>}
/>
```

## API Reference

### PDFFlipbookProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string \| File \| ArrayBuffer` | **required** | PDF source to display |
| `width` | `number \| string` | `'100%'` | Width of the flipbook container |
| `height` | `number \| string` | `'auto'` | Height of the flipbook container |
| `startPage` | `number` | `1` | Initial page to display (1-indexed) |
| `showControls` | `boolean` | `true` | Show navigation controls |
| `showPageNumber` | `boolean` | `true` | Show page number indicator |
| `singlePageMobile` | `boolean` | `true` | Use single page mode on mobile |
| `workerSrc` | `string` | CDN URL | Custom path to PDF.js worker file |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `onLoad` | `(totalPages: number) => void` | - | Callback when PDF loads |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `loadingComponent` | `React.ReactNode` | - | Custom loading component |
| `errorComponent` | `React.ReactNode` | - | Custom error component |
| `className` | `string` | `''` | Additional CSS class for container |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |

## Keyboard Navigation

- **Arrow Left / Up**: Previous page
- **Arrow Right / Down**: Next page
- **Home**: First page
- **End**: Last page

## Accessibility

The component includes comprehensive accessibility features:

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for page changes
- High contrast mode support
- Reduced motion support

## Styling

The component includes default styles that can be imported:

```tsx
import '@nofuncode/flipbook/dist/index.css';
```

You can override styles using CSS:

```css
.flipbook-container {
  /* Your custom styles */
}

.flipbook-controls {
  /* Custom control styles */
}
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build:lib

# Watch mode
npm run dev
```

## Testing

The package includes comprehensive test coverage:

- Component rendering tests
- Loading and error state tests
- Navigation tests (keyboard, controls)
- Accessibility tests
- Configuration tests

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## Credits

Built with:
- [react-pdf](https://github.com/wojtekmaj/react-pdf) - PDF rendering
- [page-flip](https://github.com/Nodlik/StPageFlip) - Flipbook animations
- [pdfjs-dist](https://github.com/mozilla/pdf.js) - PDF.js library

## Support

If you find this library helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the codebase