interface MimeTypeMap {
	[key: string]: string;
}

export const mimeTypes: MimeTypeMap = {
	// Documents
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	txt: 'text/plain',
	rtf: 'application/rtf',

	// Images
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml',

	// Audio
	mp3: 'audio/mpeg',
	wav: 'audio/wav',
	ogg: 'audio/ogg',
	m4a: 'audio/mp4',

	// Video
	mp4: 'video/mp4',
	webm: 'video/webm',
	avi: 'video/x-msvideo',
	mov: 'video/quicktime',
	mkv: 'video/x-matroska',
};
