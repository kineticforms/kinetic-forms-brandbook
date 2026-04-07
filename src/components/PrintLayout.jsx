import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { BRAND, DESIGN, DESIGN_COLORS, BRAND_PILLARS } from "../constants/brand";

const PAGE_CLASS =
  "w-[1200px] h-[1697px] shrink-0 flex flex-col justify-center px-32";

export default function PrintLayout() {
  const typo = DESIGN.typography;

  return (
    <div className="absolute top-0 left-0 w-[1200px] bg-white text-black font-sans m-0 p-0">
      <div
        data-html2canvas-ignore="true"
        className="fixed top-0 left-0 w-screen h-screen z-[10000] bg-white flex flex-col items-center justify-center gap-4"
      >
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="font-medium text-lg">
          Generating High-Resolution PDF...
        </p>
      </div>

      <div
        id="pdf-render-container"
        className="w-[1200px] flex flex-col font-sans bg-white text-black m-0 p-0 origin-top-left"
      >
        {/* Page 1: Concept */}
        <div className={`${PAGE_CLASS} bg-white`}>
          <div className="space-y-16">
            <div className="space-y-6">
              <h1 className="text-8xl font-medium tracking-tighter leading-none">
                {BRAND.brand.tagline}
              </h1>
              <p className="max-w-2xl text-zinc-500 text-2xl leading-relaxed">
                {BRAND.concept.description}
              </p>
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-medium tracking-tight border-b border-zinc-200 pb-4">
                Brand Pillars
              </h2>
              <div className="grid grid-cols-3 gap-8">
                {BRAND_PILLARS.map((pillar, i) => (
                  <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white">
                    <pillar.icon className="w-8 h-8 text-black mb-6" />
                    <h3 className="font-bold text-xl mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-zinc-500 text-lg leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Page 2: Logo */}
        <div className={`${PAGE_CLASS} bg-[#FAFAFA]`}>
          <div className="space-y-16">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-tight">
                Logo System
              </h2>
              <p className="text-zinc-500 text-2xl leading-relaxed">
                {BRAND.logo.description}
              </p>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
                  Primary Lockup
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center relative min-h-[280px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">
                      Positive
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-4xl rounded-sm">
                        K.
                      </div>
                      <span className="text-4xl font-semibold tracking-tight uppercase">
                        Kinetic Forms
                      </span>
                    </div>
                  </div>
                  <div className="bg-black rounded-3xl p-12 flex flex-col items-center justify-center relative min-h-[280px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Negative
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-4xl rounded-sm">
                        K.
                      </div>
                      <span className="text-4xl font-semibold tracking-tight uppercase text-white">
                        Kinetic Forms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
                  Standalone Mark
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">
                      Positive
                    </span>
                    <div className="w-40 h-40 bg-black text-white flex items-center justify-center font-bold text-7xl rounded-md">
                      K.
                    </div>
                  </div>
                  <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Negative
                    </span>
                    <div className="w-40 h-40 bg-white text-black flex items-center justify-center font-bold text-7xl rounded-md">
                      K.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 3: Colors */}
        <div className={`${PAGE_CLASS} bg-[#FAFAFA]`}>
          <div className="space-y-12">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-tight">
                Colors
              </h2>
              <p className="text-zinc-500 text-2xl leading-relaxed">
                {DESIGN.colors.note}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
                Light Mode
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {DESIGN_COLORS.map((color, i) => (
                  <div key={i} className="space-y-2">
                    <div
                      className={`aspect-[3/2] rounded-xl flex items-end p-4 ${color.border ? "border border-zinc-200" : ""}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className={`${color.text} font-mono text-sm`}>
                        {color.hex}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm">{color.name}</h4>
                  </div>
                ))}
              </div>
            </div>
            {DESIGN.colors.dark.length > 0 && (
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
                  Dark Mode
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {DESIGN.colors.dark.map((color, i) => {
                    const r = parseInt(color.hex.slice(1, 3), 16);
                    const g = parseInt(color.hex.slice(3, 5), 16);
                    const b = parseInt(color.hex.slice(5, 7), 16);
                    const isLight = (r * 299 + g * 587 + b * 114) / 1000 > 128;
                    return (
                      <div key={i} className="space-y-2">
                        <div
                          className={`aspect-[3/2] rounded-xl flex items-end p-4 ${isLight ? "border border-zinc-200" : ""}`}
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={`${isLight ? "text-black" : "text-white"} font-mono text-sm`}>
                            {color.hex}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm">{color.token}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page 4: Typography */}
        <div className={`${PAGE_CLASS} bg-white`}>
          <div className="space-y-16">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-tight">
                Typography
              </h2>
              <p className="text-zinc-500 text-2xl leading-relaxed">
                {typo.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-2">
                    Primary Typeface
                  </p>
                  <h3 className="text-6xl font-medium">
                    {typo.fonts.headline || "General Sans"}
                  </h3>
                </div>
                <div className="p-8 bg-[#fafafa] border border-zinc-200 rounded-2xl flex flex-wrap gap-6 text-5xl">
                  <span className="font-light">Aa</span>
                  <span className="font-normal">Bb</span>
                  <span className="font-medium">Cc</span>
                  <span className="font-bold">Dd</span>
                  <span className="font-extrabold">Ee</span>
                </div>
              </div>
              <div className="space-y-12">
                <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">
                  Type Hierarchy
                </p>
                {typo.hierarchy.map((level) => (
                  <div key={level.level}>
                    <div className="flex justify-between items-end mb-4 text-sm text-zinc-400">
                      <span>{level.level}</span>
                      <span>{level.weight}</span>
                    </div>
                    <h1
                      className={`text-4xl font-medium ${level.tracking === "tighter" ? "tracking-tighter" : level.tracking === "tight" ? "tracking-tight" : ""} leading-none`}
                    >
                      {level.level.includes("H1")
                        ? "Velocity by design"
                        : level.level.includes("H2")
                          ? "Intelligent forms"
                          : level.level.includes("Label")
                            ? "SECTION LABEL"
                            : "Body text sample"}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Page 5: Design System (Elevation + Components + Guidelines) */}
        <div className={`${PAGE_CLASS} bg-[#FAFAFA]`}>
          <div className="space-y-12">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-tight">
                Design System
              </h2>
              <p className="text-zinc-500 text-xl leading-relaxed">
                {DESIGN.elevation.description}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">
                Components
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {DESIGN.components.map((comp, i) => (
                  <div key={i} className="p-5 border border-zinc-200 rounded-2xl bg-white">
                    <h4 className="font-bold mb-1">{comp.name}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-widest uppercase text-emerald-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Do
                </h3>
                {DESIGN.dosAndDonts.dos.map((rule, i) => (
                  <div key={i} className="flex gap-2 items-start p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold tracking-widest uppercase text-red-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Don't
                </h3>
                {DESIGN.dosAndDonts.donts.map((rule, i) => (
                  <div key={i} className="flex gap-2 items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-3 h-3 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-xs leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
