/// <reference lib="dom"/>

const WIDTH = 1000;
const HEIGHT = 1000;

export default function downloadPng(svgData: string, filename: string) {
	const img = new Image();
	img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
	img.onload = () => {
		const canvas = document.createElement('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

		const a = document.createElement('a');
		a.href = canvas.toDataURL('image/png');
		a.download = filename;
		a.append(canvas);
		a.click();
		a.remove();
	}
}