/// <reference lib="dom"/>

import downloadPng from './download_png.ts';
import generateMarble from './generate_marble.ts';

document.addEventListener('DOMContentLoaded', () => {
	(document.querySelector<HTMLButtonElement>('#generate'))!.onclick = () => {
		generateMarbleHtml();
	}

	(document.querySelector<HTMLButtonElement>('#download-png'))!.onclick = () => {
		downloadPng(document.querySelector('#svg-container')!.innerHTML, 'marble_' + +new Date() + '.png');
	};

	(document.querySelector<HTMLButtonElement>('#download-svg'))!.onclick = () => {
		const a = document.createElement('a');
		a.href = 'data:image/svg+xml;base64,' + btoa(document.querySelector('div#svg-container')!.innerHTML);
		a.download = 'marble_' + +new Date() + '.svg';
		a.click();
		a.remove();
	};

	(document.querySelector<HTMLDivElement>('#settings_controls'))!.onclick = (ev) => {
		if (ev.target instanceof HTMLButtonElement && ev.target.classList.contains('remove-color')) {
			ev.target.closest('div.settings_color')?.remove();
		}
	}

	(document.querySelector('#settings_add-color') as HTMLButtonElement).onclick = () => {
		(document.querySelector<HTMLDivElement>('#settings_colors'))!.insertAdjacentHTML('beforeend',
			`<div class="settings_color"><input type="color"/> <button class="remove-color borderless">❌</button></div>`
		);
	};
});

addEventListener('load', () => {
	generateMarbleHtml();
})

function generateMarbleHtml() {
	const nCircles = document.querySelector<HTMLInputElement>('#settings_complexity')!;
	const curveness = document.querySelector<HTMLInputElement>('#settings_curveness')!;
	const colors: string[] = Array.from(document.querySelectorAll<HTMLInputElement>('input[type=color]')).map(ipt => ipt.value);

	if (nCircles.checkValidity() && curveness.checkValidity()) {
		document.querySelector('#svg-container')!.innerHTML = generateMarble({circles: +nCircles.value, curveness: +curveness.value / 100, colors});
	} else {
		nCircles.reportValidity();
		curveness.reportValidity();
	}
}