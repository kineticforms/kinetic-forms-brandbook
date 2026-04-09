const SVG_NS = 'xmlns="http://www.w3.org/2000/svg"';
const FONT_MARK =
  'font-family="General Sans, system-ui, sans-serif" font-size="600" font-weight="900"';
const FONT_ICON =
  'font-family="General Sans, system-ui, sans-serif" font-size="180" font-weight="900"';
const FONT_TEXT =
  'font-family="General Sans, system-ui, sans-serif" font-size="160" font-weight="700"';

// Embedded font style — populated at runtime by ensureFontsLoaded()
let FONT_STYLE = '';

const markSvg = (fill) =>
  `<svg ${SVG_NS} viewBox="0 0 1024 1024">${FONT_STYLE}` +
  `<text x="512" y="720" ${FONT_MARK} fill="${fill}" text-anchor="middle">K.</text></svg>`;

const logoSvg = (bgFill, textFill) =>
  `<svg ${SVG_NS} viewBox="0 0 1024 1024">${FONT_STYLE}` +
  `<rect x="64" y="64" width="896" height="896" fill="${bgFill}" rx="192"/>` +
  `<text x="512" y="720" ${FONT_MARK} fill="${textFill}" text-anchor="middle">K.</text></svg>`;

const lockupSvg = (bgFill, iconTextFill, textFill) =>
  `<svg ${SVG_NS} viewBox="0 0 1600 512">${FONT_STYLE}` +
  `<rect x="128" y="128" width="256" height="256" fill="${bgFill}" rx="32"/>` +
  `<text x="256" y="325" ${FONT_ICON} fill="${iconTextFill}" text-anchor="middle">K.</text>` +
  `<text x="480" y="310" ${FONT_TEXT} fill="${textFill}" text-anchor="start">Kinetic Forms</text></svg>`;

// Fetch woff2 font files, base64-encode them, and embed as @font-face
// in the SVG style block. Called once before asset generation.
let _fontReady = null;
export function ensureFontsLoaded() {
  if (_fontReady) return _fontReady;
  _fontReady = (async () => {
    try {
      const cssUrl = 'https://api.fontshare.com/v2/css?f[]=general-sans@700,800&display=swap';
      const cssRes = await fetch(cssUrl);
      const css = await cssRes.text();
      const faces = [];
      const re = /@font-face\s*\{[^}]*?font-weight:\s*(\d+)[^}]*?url\(([^)]+\.woff2)\)[^}]*?\}/g;
      let m;
      while ((m = re.exec(css)) !== null) {
        const weight = m[1];
        const url = m[2];
        const fontRes = await fetch(url);
        const buf = await fontRes.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const b64 = btoa(binary);
        faces.push(
          `@font-face{font-family:'General Sans';font-weight:${weight};` +
          `src:url(data:font/woff2;base64,${b64}) format('woff2');}`
        );
      }
      if (faces.length > 0) {
        FONT_STYLE = '<style>' + faces.join('') + '</style>';
      }
    } catch (e) {
      console.warn('Failed to embed font in SVGs:', e);
    }
  })();
  return _fontReady;
}

// Dynamic getters — call after ensureFontsLoaded() for rasterization
export const getPosLogoTransparent = () => markSvg("#000000");
export const getNegLogoTransparent = () => markSvg("#ffffff");
export const getPosLogo = () => logoSvg("#000000", "#ffffff");
export const getNegLogo = () => logoSvg("#ffffff", "#000000");
export const getPosLogoText = () => lockupSvg("#000000", "#ffffff", "#000000");
export const getNegLogoText = () => lockupSvg("#ffffff", "#000000", "#ffffff");

// Static exports for display use (not rasterization)
export const POS_LOGO_TRANSPARENT = markSvg("#000000");
export const NEG_LOGO_TRANSPARENT = markSvg("#ffffff");
export const POS_LOGO = logoSvg("#000000", "#ffffff");
export const NEG_LOGO = logoSvg("#ffffff", "#000000");
export const POS_LOGO_TEXT = lockupSvg("#000000", "#ffffff", "#000000");
export const NEG_LOGO_TEXT = lockupSvg("#ffffff", "#000000", "#ffffff");
