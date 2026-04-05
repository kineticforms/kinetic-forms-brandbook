import {
  Zap,
  Layers,
  Maximize,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
} from "lucide-react";

export const BRAND_COLORS = [
  { name: "Kinetic Black", hex: "#000000", text: "text-white" },
  { name: "Motion White", hex: "#FFFFFF", text: "text-black", border: true },
  { name: "Graphite", hex: "#18181B", text: "text-white" },
  { name: "Steel", hex: "#A1A1AA", text: "text-black" },
  { name: "Vapor", hex: "#F4F4F5", text: "text-black", border: true },
];

export const NAV_VIEWS = [
  { id: "concept", label: "Concept", icon: LayoutTemplate },
  { id: "logo", label: "Logo", icon: ImageIcon },
  { id: "typography", label: "Typography", icon: Type },
  { id: "colors", label: "Color System", icon: Palette },
];

export const BRAND_PILLARS = [
  {
    title: "Velocity",
    desc: "Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought.",
    icon: Zap,
  },
  {
    title: "Flow",
    desc: "Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior.",
    icon: Layers,
  },
  {
    title: "Precision",
    desc: "An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.",
    icon: Maximize,
  },
];
