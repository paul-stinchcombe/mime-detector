import { mimeTypes } from './mimeTypes';
import { magicBytes } from './magicBytes';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

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

async function getBufferFromUrl(url: string): Promise<Buffer> {
	const response = await axios.get(url, { responseType: 'arraybuffer' });
	return Buffer.from(response.data);
}

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

export async function isDocument(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('application/') || mimeType === 'text/plain';
}

export async function isImage(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('image/');
}

export async function isAudio(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('audio/');
}

export async function isVideo(filePathOrUrl: string): Promise<boolean> {
	const mimeType = await getMimeType(filePathOrUrl);
	return mimeType.startsWith('video/');
}
