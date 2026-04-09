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

        {/* Page 5: Components + Elevation */}
        <div className={`${PAGE_CLASS} bg-[#FAFAFA]`}>
          <div className="space-y-12">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-tight">
                Design System
              </h2>
              <p className="text-zinc-500 text-xl leading-relaxed">
                {DESIGN.overview.description.split("\n\n")[0]}
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
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">
                Elevation
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                {DESIGN.elevation.description}
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Level 0 — Flat", border: "border-zinc-200", bg: "bg-white", desc: "Default surface. 1px border, no shadow." },
                  { label: "Level 1 — Hover", border: "border-zinc-400", bg: "bg-white", desc: "Interactive state. Darkened border on hover." },
                  { label: "Level 2 — Raised", border: "border-zinc-200", bg: "bg-zinc-50", desc: "Background shift. Surface-variant color." },
                ].map((level) => (
                  <div key={level.label} className="space-y-2">
                    <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">{level.label}</p>
                    <div className={`aspect-[4/3] ${level.bg} rounded-2xl border ${level.border} flex items-center justify-center p-6`}>
                      <p className="text-zinc-400 text-xs text-center">{level.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Page 6: Imagery */}
        {BRAND.imagery && (
          <div className={`${PAGE_CLASS} bg-white`}>
            <div className="space-y-12">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl font-medium tracking-tight">
                  Imagery
                </h2>
                <p className="text-zinc-500 text-xl leading-relaxed">
                  {BRAND.imagery.description}
                </p>
              </div>
              {BRAND.imagery.photography && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Photography</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">{BRAND.imagery.photography.style}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 border border-zinc-200 rounded-2xl bg-[#FAFAFA] space-y-3">
                      <h4 className="font-bold text-sm">Subjects</h4>
                      <ul className="space-y-2">
                        {BRAND.imagery.photography.subjects.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-500"><span className="text-zinc-300 mt-0.5">—</span>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 border border-zinc-200 rounded-2xl bg-[#FAFAFA] space-y-3">
                      <h4 className="font-bold text-sm">Treatments</h4>
                      <ul className="space-y-2">
                        {BRAND.imagery.photography.treatments.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-500"><CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {BRAND.imagery.photography.avoid.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-3 h-3 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-xs leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {BRAND.imagery.illustration && (
                <div className="space-y-6 pt-6 border-t border-zinc-200">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Illustration</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">{BRAND.imagery.illustration.style}</p>
                  {BRAND.imagery.illustration.avoid && (
                    <div className="grid grid-cols-2 gap-3">
                      {BRAND.imagery.illustration.avoid.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <XCircle className="w-3 h-3 text-red-600 mt-0.5 shrink-0" />
                          <p className="text-xs leading-relaxed">{a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page 7: Motion */}
        {BRAND.motion && (
          <div className={`${PAGE_CLASS} bg-[#FAFAFA]`}>
            <div className="space-y-12">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl font-medium tracking-tight">Motion</h2>
                <p className="text-zinc-500 text-xl leading-relaxed">{BRAND.motion.description}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Principles</h3>
                <div className="grid grid-cols-2 gap-4">
                  {BRAND.motion.principles.map((p, i) => (
                    <div key={i} className="p-6 border border-zinc-200 rounded-2xl bg-white">
                      <h4 className="font-bold mb-2">{p.title}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-200">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Timing</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Fast", value: BRAND.motion.timing.fast, desc: "Micro-interactions" },
                      { label: "Normal", value: BRAND.motion.timing.normal, desc: "Transitions" },
                      { label: "Slow", value: BRAND.motion.timing.slow, desc: "Complex sequences" },
                    ].map((t) => (
                      <div key={t.label} className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-white">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">{t.label}</span>
                          <code className="text-xs font-mono text-zinc-400">{t.value}</code>
                        </div>
                        <span className="text-xs text-zinc-400">{t.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Easing Curves</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Default", value: BRAND.motion.easing.default, desc: "General-purpose" },
                      { label: "Enter", value: BRAND.motion.easing.enter, desc: "Appearing" },
                      { label: "Exit", value: BRAND.motion.easing.exit, desc: "Leaving" },
                    ].map((e) => (
                      <div key={e.label} className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-white">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">{e.label}</span>
                          <code className="text-xs font-mono text-zinc-400 break-all">{e.value}</code>
                        </div>
                        <span className="text-xs text-zinc-400">{e.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page 8: Guidelines */}
        <div className={`${PAGE_CLASS} bg-white`}>
          <div className="space-y-12">
            <h2 className="text-5xl font-medium tracking-tight">Guidelines</h2>
            <div className="grid grid-cols-2 gap-8">
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
