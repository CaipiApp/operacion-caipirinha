const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#030509"/>
      <stop offset="0.60" stop-color="#04070A"/>
      <stop offset="1" stop-color="#071207"/>
    </linearGradient>
    <radialGradient id="rightGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(910 315) rotate(90) scale(230 280)">
      <stop offset="0" stop-color="#AEEA00" stop-opacity="0.18"/>
      <stop offset="0.58" stop-color="#7FD000" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#7FD000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#B9F500"/>
      <stop offset="1" stop-color="#91D900"/>
    </linearGradient>
    <filter id="glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill="#AEEA00" fill-opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#rightGlow)"/>
  <rect x="735" y="110" width="330" height="290" fill="url(#dots)" opacity="0.72"/>

  <g opacity="0.13">
    <path d="M0 525 C125 475 210 590 330 545 C470 493 565 510 675 575 C780 636 875 615 965 555" stroke="#AEEA00" stroke-width="1.4" fill="none"/>
    <path d="M0 545 C135 495 218 610 340 565 C480 513 575 530 685 595 C790 656 885 635 975 575" stroke="#AEEA00" stroke-width="1" fill="none"/>
  </g>

  <image href="/caipi_logo_full.png" x="68" y="54" width="250" height="95" preserveAspectRatio="xMinYMin meet"/>

  <g transform="translate(70 248)">
    <text x="0" y="0" fill="#F7F8FA" font-size="78" font-weight="500" font-family="Inter, Arial, Helvetica, sans-serif" letter-spacing="-3">Conectando</text>
    <text x="0" y="88" fill="url(#green)" font-size="92" font-weight="800" font-family="Inter, Arial, Helvetica, sans-serif" letter-spacing="-3.5">el Mercosur</text>
    <text x="0" y="166" fill="#E8EAED" fill-opacity="0.92" font-size="44" font-weight="400" font-family="Inter, Arial, Helvetica, sans-serif">Caipi Empresas</text>
    <rect x="0" y="198" width="55" height="6" rx="3" fill="#AEEA00"/>
  </g>

  <g opacity="0.92">
    <path d="M745 388 C815 326 875 304 975 286" stroke="#99E400" stroke-opacity="0.58" stroke-width="2" fill="none"/>
    <path d="M745 388 C795 295 842 215 880 170" stroke="#99E400" stroke-opacity="0.32" stroke-width="1.45" fill="none"/>
    <path d="M880 170 C948 182 988 228 975 286" stroke="#99E400" stroke-opacity="0.30" stroke-width="1.4" fill="none"/>
    <path d="M745 388 C790 425 818 478 848 520" stroke="#99E400" stroke-opacity="0.30" stroke-width="1.4" fill="none"/>
    <path d="M975 286 C930 356 890 432 848 520" stroke="#99E400" stroke-opacity="0.46" stroke-width="1.8" fill="none"/>
    <circle cx="880" cy="170" r="5" fill="#D8FF56" filter="url(#glow)"/>
    <circle cx="975" cy="286" r="5" fill="#D8FF56" filter="url(#glow)"/>
    <circle cx="745" cy="388" r="5" fill="#D8FF56" filter="url(#glow)"/>
    <circle cx="848" cy="520" r="5" fill="#D8FF56" filter="url(#glow)"/>
  </g>

  <g transform="translate(900 365)">
    <rect x="0" y="-8" width="2.5" height="128" rx="1.25" fill="#AEEA00"/>
    <text x="30" y="22" fill="#F2F3F5" font-size="30" font-weight="400" font-family="Inter, Arial, Helvetica, sans-serif">Pix</text>
    <text x="30" y="70" fill="url(#green)" font-size="30" font-weight="600" font-family="Inter, Arial, Helvetica, sans-serif">ARS ↔ BRL</text>
    <text x="30" y="118" fill="#F2F3F5" font-size="30" font-weight="400" font-family="Inter, Arial, Helvetica, sans-serif">Interoperable</text>
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
