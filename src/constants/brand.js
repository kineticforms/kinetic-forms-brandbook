import {
  Zap,
  Layers,
  Maximize,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
  Box,
} from "lucide-react";
import { parseBrand } from "../lib/parseBrand";
import { parseDesign } from "../lib/parseDesign";
import brandRaw from "/BRAND.md?raw";
import designRaw from "/DESIGN.md?raw";

const ICON_MAP = {
  zap: Zap,
  layers: Layers,
  maximize: Maximize,
};

export const { data: BRAND, markdown: BRAND_MARKDOWN } = parseBrand(brandRaw);
export const DESIGN = parseDesign(designRaw);

// Derive color swatches from DESIGN.md light-mode tokens
function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

export const DESIGN_COLORS = DESIGN.colors.light.map((c) => ({
  name: c.token,
  hex: c.hex,
  description: c.description,
  text: isLightColor(c.hex) ? "text-black" : "text-white",
  border:
    c.hex.toUpperCase() === "#FFFFFF" || c.hex.toUpperCase() === "#F4F4F5",
}));

export const BRAND_PILLARS = BRAND.concept.pillars.map((p) => ({
  title: p.title,
  desc: p.description,
  icon: ICON_MAP[p.icon] || Zap,
}));

export const NAV_VIEWS = [
  { id: "concept", label: "Concept", icon: LayoutTemplate },
  { id: "logo", label: "Logo", icon: ImageIcon },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "system", label: "System", icon: Box },
];
