# mime-detector

A TypeScript module that accurately detects file MIME types by examining both file contents (magic bytes) and extensions.

## Features

-   Accurate file type detection using magic bytes (file signatures)
-   Fallback to extension-based detection when magic bytes aren't conclusive
-   Support for common document, image, audio, and video formats
-   Written in TypeScript with full type definitions
-   Zero runtime dependencies

## Installation

```bash
npm install mime-detector
```

## Usage

```typescript
import { getMimeType, isDocument, isImage, isAudio, isVideo } from 'mime-detector';

// Get MIME type
console.log(await getMimeType('https://example.com/document.pdf')); // 'application/pdf'
console.log(await getMimeType('https://example.com/image.jpg')); // 'image/jpeg'

// Check file type
console.log(await isDocument('https://example.com/document.pdf')); // true
console.log(await isImage('https://example.com/image.jpg')); // true
console.log(await isAudio('https://example.com/song.mp3')); // true
console.log(await isVideo('https://example.com/movie.mp4')); // true
```

## API

### getMimeType(filePath: string): string

Returns the MIME type for the given file path. First attempts to detect the type by reading the file's magic bytes, then falls back to extension-based detection if necessary.

### Helper Functions

-   `isDocument(filePath: string): boolean` - Checks if the file is a document
-   `isImage(filePath: string): boolean` - Checks if the file is an image
-   `isAudio(filePath: string): boolean` - Checks if the file is an audio file
-   `isVideo(filePath: string): boolean` - Checks if the file is a video file

## Supported Formats

### Documents

-   PDF (.pdf)
-   Microsoft Word (.doc, .docx)
-   Text (.txt)
-   Rich Text Format (.rtf)

### Images

-   JPEG (.jpg, .jpeg)
-   PNG (.png)
-   GIF (.gif)
-   WebP (.webp)
-   SVG (.svg)

### Audio

-   MP3 (.mp3)
-   WAV (.wav)
-   OGG (.ogg)
-   M4A (.m4a)

### Video

-   MP4 (.mp4)
-   WebM (.webm)
-   AVI (.avi)
-   QuickTime (.mov)
-   Matroska (.mkv)

## Magic Bytes Detection

The module first attempts to detect file types by examining their magic bytes (file signatures). This provides more accurate detection than extension-based methods alone, as it looks at the actual file contents. Currently supports magic bytes detection for:

-   PDF files
-   JPEG images
-   PNG images
-   GIF images
-   MP3 audio
-   MP4 video
-   WebM video

For other formats, or when magic bytes detection fails, the module falls back to extension-based detection.

## Error Handling

If the file cannot be read (e.g., due to permissions or if it doesn't exist), the module falls back to extension-based detection. If the file type cannot be determined, it returns `'application/octet-stream'`.

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

Some areas where you could help:

-   Adding support for more file formats
-   Adding more magic byte signatures
-   Improving detection accuracy
-   Adding tests
-   Documentation improvements
