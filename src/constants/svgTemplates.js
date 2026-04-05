const SVG_NS = 'xmlns="http://www.w3.org/2000/svg"';
const FONT_MARK =
  'font-family="General Sans, system-ui, sans-serif" font-size="600" font-weight="900"';
const FONT_ICON =
  'font-family="General Sans, system-ui, sans-serif" font-size="180" font-weight="900"';
const FONT_TEXT =
  'font-family="General Sans, system-ui, sans-serif" font-size="160" font-weight="700"';

const markSvg = (fill) =>
  `<svg ${SVG_NS} viewBox="0 0 1024 1024">` +
  `<text x="512" y="720" ${FONT_MARK} fill="${fill}" text-anchor="middle">K.</text></svg>`;

const logoSvg = (bgFill, textFill) =>
  `<svg ${SVG_NS} viewBox="0 0 1024 1024">` +
  `<rect x="64" y="64" width="896" height="896" fill="${bgFill}" rx="192"/>` +
  `<text x="512" y="720" ${FONT_MARK} fill="${textFill}" text-anchor="middle">K.</text></svg>`;

const lockupSvg = (bgFill, iconTextFill, textFill) =>
  `<svg ${SVG_NS} viewBox="0 0 1600 512">` +
  `<rect x="128" y="128" width="256" height="256" fill="${bgFill}" rx="32"/>` +
  `<text x="256" y="325" ${FONT_ICON} fill="${iconTextFill}" text-anchor="middle">K.</text>` +
  `<text x="480" y="310" ${FONT_TEXT} fill="${textFill}" text-anchor="start">Kinetic Forms</text></svg>`;

export const POS_LOGO_TRANSPARENT = markSvg("#000000");
export const NEG_LOGO_TRANSPARENT = markSvg("#ffffff");
export const POS_LOGO = logoSvg("#000000", "#ffffff");
export const NEG_LOGO = logoSvg("#ffffff", "#000000");
export const POS_LOGO_TEXT = lockupSvg("#000000", "#ffffff", "#000000");
export const NEG_LOGO_TEXT = lockupSvg("#ffffff", "#000000", "#ffffff");
