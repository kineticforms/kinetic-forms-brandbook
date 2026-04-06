import {
  Zap,
  Layers,
  Maximize,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
} from "lucide-react";
import { parseBrand } from "../lib/parseBrand";
import brandRaw from "/BRAND.md?raw";

const ICON_MAP = {
  zap: Zap,
  layers: Layers,
  maximize: Maximize,
};

export const { data: BRAND, markdown: BRAND_MARKDOWN } = parseBrand(brandRaw);

export const BRAND_COLORS = BRAND.colors.palette.map((c) => ({
  name: c.name,
  hex: c.hex,
  text: c.on_color === "#FFFFFF" ? "text-white" : "text-black",
  border: c.hex.toUpperCase() === "#FFFFFF" || c.hex.toUpperCase() === "#F4F4F5",
}));

export const BRAND_PILLARS = BRAND.concept.pillars.map((p) => ({
  title: p.title,
  desc: p.description,
  icon: ICON_MAP[p.icon] || Zap,
}));

export const NAV_VIEWS = [
  { id: "concept", label: "Concept", icon: LayoutTemplate },
  { id: "logo", label: "Logo", icon: ImageIcon },
  { id: "typography", label: "Typography", icon: Type },
  { id: "colors", label: "Color System", icon: Palette },
];
