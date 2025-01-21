import { mimeTypes } from './mimeTypes';
import { magicBytes } from './magicBytes';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

/**
 * Checks if a buffer matches any known magic byte signatures.
 *
 * @param buffer - The buffer containing the file's initial bytes
 * @returns The matching MIME type if found, null otherwise
 * @internal
 */
function checkMagicBytes(buffer: Buffer): string | null {
	for (const type of magicBytes) {
		for (const signature of type.signatures) {
			const offset = signature.offset || 0;
			let matches = true;

			if (buffer.length < offset + signature.bytes.length) {
				continue;
			}

			for (let i = 0; i < signature.bytes.length; i++) {
				const byte = buffer[offset + i];
				const signatureByte = signature.bytes[i];
				const mask = signature.mask ? signature.mask[i] : 0xff;

				if ((byte & mask) !== (signatureByte & mask)) {
					matches = false;
					break;
				}
			}

			if (matches) {
				return type.mimeType;
			}
		}
	}
	return null;
}

/**
 * Downloads the content from a URL and returns it as a Buffer.
 *
 * @param url - The HTTP/HTTPS URL to download from
 * @returns Promise resolving to a Buffer containing the downloaded data
 * @throws Will throw an error if the download fails
 * @internal
 */
async function getBufferFromUrl(url: string): Promise<Buffer> {
	const response = await axios.get(url, { responseType: 'arraybuffer' });
	return Buffer.from(response.data);
}

/**
 * Gets the MIME type of a file from either a local file path or URL.
 * First attempts to detect using magic bytes, then falls back to extension-based detection.
 *
 * @param filePathOrUrl - Local file path or HTTP/HTTPS URL of the file
 * @returns Promise resolving to the detected MIME type string
 * @example
 * const mimeType = await getMimeType('path/to/image.jpg');
 * // Returns: 'image/jpeg'
 *
 * const urlMimeType = await getMimeType('https://example.com/image.png');
 * // Returns: 'image/png'
 */
export async function getMimeType(filePathOrUrl: string): Promise<string> {
	try {
		let buffer: Buffer;

		if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
			// If it's a URL, download the first 12 bytes
			buffer = await getBufferFromUrl(filePathOrUrl);
		} else {
			// If it's a file path, read the first 12 bytes
			const fd = fs.openSync(filePathOrUrl, 'r');
			buffer = Buffer.alloc(12);
			fs.readSync(fd, buffer, 0, 12, 0);
			fs.closeSync(fd);
		}

		// First try magic bytes
		const magicByteMimeType = checkMagicBytes(buffer);
		if (magicByteMimeType) {
			return magicByteMimeType;
		}

		// Fall back to extension-based detection
		const extension = path.extname(filePathOrUrl).toLowerCase().slice(1);
		return mimeTypes[extension] || 'application/octet-stream';
	} catch (error) {
		// If file can't be read, fall back to extension-based detection
		const extension = path.extname(filePathOrUrl).toLowerCase().slice(1);
		return mimeTypes[extension] || 'application/octet-stream';
	}
}

/**
 * Checks if a file is a document (application/* or text/plain).
 *
 * @param filePathOrUrl - Local file path or HTTP/HTTPS URL of the file
 * @returns Promise resolving to true if the file is a document
 * @example
 * const isDoc = await isDocument('path/to/document.pdf');
 * // Returns: true
 */
export async function isDocument(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('application/') || mimeType === 'text/plain';
}

/**
 * Checks if a file is an image.
 *
 * @param filePathOrUrl - Local file path or HTTP/HTTPS URL of the file
 * @returns Promise resolving to true if the file is an image
 * @example
 * const isImg = await isImage('path/to/photo.jpg');
 * // Returns: true
 */
export async function isImage(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('image/');
}

/**
 * Checks if a file is an audio file.
 *
 * @param filePathOrUrl - Local file path or HTTP/HTTPS URL of the file
 * @returns Promise resolving to true if the file is an audio file
 * @example
 * const isAudioFile = await isAudio('path/to/song.mp3');
 * // Returns: true
 */
export async function isAudio(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('audio/');
}

/**
 * Checks if a file is a video file.
 *
 * @param filePathOrUrl - Local file path or HTTP/HTTPS URL of the file
 * @returns Promise resolving to true if the file is a video file
 * @example
 * const isVideoFile = await isVideo('path/to/movie.mp4');
 * // Returns: true
 */
export async function isVideo(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('video/');
}

/**
 * Converts a MIME type to its corresponding file extension.
 *
 * @param mimeType - The MIME type to convert (e.g., 'image/jpeg')
 * @returns The file extension with leading dot (e.g., '.jpg') or null if not found
 * @example
 * const ext = getMimeExtension('image/jpeg');
 * // Returns: '.jpg'
 *
 * const unknownExt = getMimeExtension('application/unknown');
 * // Returns: null
 */
export function getMimeExtension(mimeType: string): string | null {
	const normalizedMimeType = mimeType.toLowerCase();
	const extension = Object.entries(mimeTypes).find(([_, mime]) => mime.toLowerCase() === normalizedMimeType);
	return extension ? `.${extension[0]}` : null;
}
