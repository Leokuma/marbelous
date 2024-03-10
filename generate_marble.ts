import {distinct} from 'https://deno.land/std@0.219.0/collections/distinct.ts';

const RADIUS = 500;
const DIAMETER = RADIUS * 2;
const CANVAS_SIZE = 5000;
const CENTER = CANVAS_SIZE / 2;

enum BlendMode {
	color = 'color',
	colorBurn = 'color-burn',
	colorDodge = 'color-dodge',
	darken = 'darken',
	difference = 'difference',
	exclusion = 'exclusion',
	hardLight = 'hard-light',
	hue = 'hue',
	lighten = 'lighten',
	luminosity = 'luminosity',
	multiply = 'multiply',
	normal = 'normal',
	overlay = 'overlay',
	saturation = 'saturation',
	screen = 'screen',
	softLight = 'soft-light'
};

interface MarbleOptions {
	circles?: number
	colors?: string[]
	/** Between 0 and 1 */
	curveness?: number
}

interface Circle {
	r: number
	cx: number
	cy: number
}

function generateMarble(opts?: MarbleOptions): string {
	const virtualCanvasSize = (opts?.curveness ? Math.round(CANVAS_SIZE * opts.curveness) : CANVAS_SIZE);

	let nCircles = (opts?.circles || 4);
	const circles: Circle[] = [];
	const blends: BlendMode[] = [randBlend()];
	while (--nCircles) {
		circles.push(randCircle(virtualCanvasSize));
		blends.push(randBlend());
	}

	return `
		<svg viewBox="${CENTER - RADIUS} ${CENTER - RADIUS} ${DIAMETER} ${DIAMETER}">
			<defs>
				<mask id="mask">
					<circle cx="${CENTER}" cy="${CENTER}" r="${RADIUS}" fill="#fff"/>
				</mask>
				${distinct(blends).map(mode => `
					<filter id="blend_${mode}">
						<feBlend mode="${mode}"/>
					</filter>`).join('')
				}
			</defs>

			<g mask="url(#mask)">
				<circle r="${RADIUS}" cx="${CENTER}" cy="${CENTER}" fill="${randColor({opacity: 1})}" filter="url(#blend_${blends[0]})"/>
				${circles.map((circle, i) => `
					<circle r="${circle.r}" cx="${circle.cx}" cy="${circle.cy}" fill="${randColor()}" filter="url(#blend_${blends[i + 1]})"/>`).join('')
				}
			</g>
		</svg>
	`.replaceAll(/[\n\t]/g, '');
}

function randCircle(virtualCanvasSize: number): Circle {
	const cx = Math.round(Math.random() * virtualCanvasSize);
	const cy = Math.round(Math.random() * virtualCanvasSize);

	const x = Math.abs(CENTER - cx);
	const y = Math.abs(CENTER - cy);
	const r = Math.max(0, Math.round(Math.sqrt(x ** 2 + y ** 2)) - RADIUS) + Math.round(Math.random() * DIAMETER);

	return {r, cx, cy};
}

function randColor(opts?: {opacity: number}) {
	return '#' + randColorComponent() + randColorComponent() + randColorComponent() + randColorComponent(opts);
}

function randColorComponent(opts?: {opacity: number}) {
	return (Math.round(255 * (opts?.opacity ?? Math.random()))).toString(16).padStart(2, '0');
}

function randBlend() {
	const modes = Object.values(BlendMode);
	return modes[(Math.round(Math.random() * (modes.length - 1)))];
}

export default generateMarble;