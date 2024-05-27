/// <reference lib="dom"/>

import downloadPng from './download_png.ts';
import generateMarble from './generate_marble.ts';

document.addEventListener('DOMContentLoaded', () => {
	(document.querySelector('#generate') as HTMLButtonElement).onclick = () => {
		generateMarbleHtml();
	}

	(document.querySelector('#download-png') as HTMLButtonElement).onclick = () => {
		downloadPng(document.querySelector('#svg-container')!.innerHTML, 'marble_' + +new Date() + '.png');
	};

	(document.querySelector('#download-svg') as HTMLButtonElement).onclick = () => {
		const a = document.createElement('a');
		a.href = 'data:image/svg+xml;base64,' + btoa(document.querySelector('div#svg-container')!.innerHTML);
		a.download = 'marble_' + +new Date() + '.svg';
		a.click();
		a.remove();
	};

	(document.querySelector('#settings_controls') as HTMLDivElement).onclick = (ev) => {
		if (ev.target instanceof HTMLButtonElement && ev.target.classList.contains('remove-color')) {
			ev.target.closest('div.settings_color')?.remove();
		}
	}

	(document.querySelector('#settings_add-color') as HTMLButtonElement).onclick = () => {
		(document.querySelector('#settings_colors') as HTMLDivElement).insertAdjacentHTML('beforeend',
			`<div class="settings_color"><input type="color"/> <button class="remove-color borderless">❌</button></div>`
		);
	};
});

addEventListener('load', () => {
	generateMarbleHtml();
})

function generateMarbleHtml() {
	const nCircles = document.querySelector('#settings_complexity') as HTMLInputElement;
	const curveness = document.querySelector('#settings_curveness') as HTMLInputElement;

	if (nCircles.checkValidity() && curveness.checkValidity()) {
		document.querySelector('#svg-container')!.innerHTML = generateMarble({circles: +nCircles.value, curveness: +curveness.value / 100});
	} else {
		nCircles.reportValidity();
		curveness.reportValidity();
	}
}