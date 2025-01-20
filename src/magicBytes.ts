interface MagicByte {
	bytes: number[];
	mask?: number[];
	offset?: number;
}

interface MagicByteDefinition {
	mimeType: string;
	signatures: MagicByte[];
}

export const magicBytes: MagicByteDefinition[] = [
	// PDF
	{
		mimeType: 'application/pdf',
		signatures: [{ bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
	},
	// JPEG
	{
		mimeType: 'image/jpeg',
		signatures: [{ bytes: [0xff, 0xd8, 0xff, 0xe0] }, { bytes: [0xff, 0xd8, 0xff, 0xe1] }, { bytes: [0xff, 0xd8, 0xff, 0xe8] }],
	},
	// PNG
	{
		mimeType: 'image/png',
		signatures: [{ bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
	},
	// GIF
	{
		mimeType: 'image/gif',
		signatures: [
			{ bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
			{ bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
		],
	},
	// MP3
	{
		mimeType: 'audio/mpeg',
		signatures: [
			{ bytes: [0x49, 0x44, 0x33] }, // ID3v2
			{ bytes: [0xff, 0xfb] }, // MPEG sync
		],
	},
	// MP4
	{
		mimeType: 'video/mp4',
		signatures: [
			{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp
			{ bytes: [0x6d, 0x70, 0x34, 0x32], offset: 8 }, // mp42
		],
	},
	// WebM
	{
		mimeType: 'video/webm',
		signatures: [{ bytes: [0x1a, 0x45, 0xdf, 0xa3] }],
	},
];
