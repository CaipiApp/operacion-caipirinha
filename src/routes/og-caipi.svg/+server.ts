const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#030509"/>
      <stop offset="0.58" stop-color="#05080A"/>
      <stop offset="1" stop-color="#071207"/>
    </linearGradient>
    <radialGradient id="rightGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(910 330) rotate(90) scale(250 300)">
      <stop offset="0" stop-color="#AEEA00" stop-opacity="0.18"/>
      <stop offset="0.52" stop-color="#7FD000" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#7FD000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#B9F500"/>
      <stop offset="1" stop-color="#91D900"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.15" fill="#AEEA00" fill-opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#rightGlow)"/>
  <rect x="740" y="118" width="350" height="300" fill="url(#dots)" opacity="0.7"/>

  <g opacity="0.14">
    <path d="M0 525 C125 475 210 590 330 545 C470 493 565 510 675 575 C780 636 875 615 955 535" stroke="#AEEA00" stroke-width="1.4" fill="none"/>
    <path d="M0 545 C135 495 218 610 340 565 C480 513 575 530 685 595 C790 656 885 635 965 555" stroke="#AEEA00" stroke-width="1" fill="none"/>
  </g>

  <g transform="translate(70 82)">
    <text x="0" y="0" dominant-baseline="hanging" fill="url(#green)" font-size="74" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif" letter-spacing="-3">caipi</text>
  </g>

  <g transform="translate(70 245)">
    <text x="0" y="0" fill="#F7F8FA" font-size="78" font-weight="500" font-family="Inter, Arial, Helvetica, sans-serif" letter-spacing="-3">Conectando</text>
    <text x="0" y="90" fill="url(#green)" font-size="92" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif" letter-spacing="-3.5">el Mercosur</text>
    <text x="0" y="170" fill="#E8EAED" fill-opacity="0.92" font-size="44" font-weight="400" font-family="Inter, Arial, Helvetica, sans-serif">Caipi Empresas</text>
    <rect x="0" y="202" width="55" height="6" rx="3" fill="#AEEA00"/>
  </g>

  <g opacity="0.92">
    <path d="M760 388 C830 326 900 305 1002 285" stroke="#99E400" stroke-opacity="0.60" stroke-width="2" fill="none"/>
    <path d="M760 388 C812 292 855 210 893 165" stroke="#99E400" stroke-opacity="0.34" stroke-width="1.45" fill="none"/>
    <path d="M893 165 C968 175 1015 220 1002 285" stroke="#99E400" stroke-opacity="0.30" stroke-width="1.4" fill="none"/>
    <path d="M760 388 C800 420 830 475 860 520" stroke="#99E400" stroke-opacity="0.32" stroke-width="1.4" fill="none"/>
    <path d="M1002 285 C952 355 904 435 860 520" stroke="#99E400" stroke-opacity="0.48" stroke-width="1.8" fill="none"/>
    <circle cx="893" cy="165" r="5" fill="#D8FF56" filter="url(#glow)"/>
    <circle cx="1002" cy="285" r="5" fill="#D8FF56" filter="url(#glow)"/>
    <circle cx="760" cy="388" r="5" fill="#D8FF56" filter="url(#glow)"/>
    <circle cx="860" cy="520" r="5" fill="#D8FF56" filter="url(#glow)"/>
  </g>

  <g transform="translate(910 360)">
    <rect x="0" y="-6" width="2.5" height="132" rx="1.25" fill="#AEEA00"/>
    <text x="34" y="24" fill="#F2F3F5" font-size="32" font-weight="400" font-family="Inter, Arial, Helvetica, sans-serif">Pix</text>
    <text x="34" y="76" fill="url(#green)" font-size="32" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif">ARS ↔ BRL</text>
    <text x="34" y="126" fill="#F2F3F5" font-size="32" font-weight="400" font-family="Inter, Arial, Helvetica, sans-serif">Interoperable</text>
  </g>
</svg>`;

export const GET = () => {
	return new Response(svg, {
		headers: {
			'content-type': 'image/svg+xml; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=31536000'
		}
	});
};
