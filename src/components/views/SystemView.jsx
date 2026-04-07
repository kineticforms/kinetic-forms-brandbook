import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { BRAND, DESIGN } from "../../constants/brand";

const SECTIONS = [
  { id: "elevation", label: "Elevation" },
  { id: "components", label: "Components" },
  { id: "motion", label: "Motion" },
  { id: "imagery", label: "Imagery" },
  { id: "guidelines", label: "Guidelines" },
];

function ComponentPreview({ name }) {
  switch (name) {
    case "Buttons":
      return (
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-zinc-100">
          <button className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 hover:-translate-y-0.5 transition-all shadow-lg">
            Primary
          </button>
          <button className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium border border-zinc-200 hover:border-black transition-all">
            Secondary
          </button>
          <button className="px-6 py-3 rounded-full bg-zinc-200 text-zinc-500 text-sm font-medium cursor-not-allowed">
            Disabled
          </button>
        </div>
      );
    case "Cards":
      return (
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-zinc-100">
          <div className="p-5 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-400 hover:shadow-lg transition-all cursor-pointer">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1">Default</p>
            <p className="text-xs text-zinc-500">1px border</p>
          </div>
          <div className="p-5 border border-zinc-400 rounded-2xl bg-white shadow-lg">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-1">Hovered</p>
            <p className="text-xs text-zinc-500">Darkened border</p>
          </div>
        </div>
      );
    case "Navigation":
      return (
        <div className="mt-6 pt-6 border-t border-zinc-100">
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <div className="bg-white/80 backdrop-blur-md px-4 py-3 flex items-center gap-4">
              <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-[6px]">K.</span>
              </div>
              <div className="flex gap-4 text-[10px] font-medium uppercase tracking-widest">
                <span className="text-black border-b-2 border-black pb-0.5">Active</span>
                <span className="text-zinc-400 pb-0.5">Inactive</span>
                <span className="text-zinc-400 pb-0.5">Inactive</span>
              </div>
            </div>
          </div>
        </div>
      );
    case "Color Swatches":
      return (
        <div className="flex gap-2 mt-6 pt-6 border-t border-zinc-100">
          {["#000000", "#18181B", "#A1A1AA", "#F4F4F5", "#FFFFFF"].map((hex) => (
            <div
              key={hex}
              className={`w-8 h-8 rounded-lg transition-transform hover:-translate-y-1 ${hex === "#FFFFFF" || hex === "#F4F4F5" ? "border border-zinc-200" : ""}`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      );
    case "Section Headers":
      return (
        <div className="mt-6 pt-6 border-t border-zinc-100 space-y-1">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Label</p>
          <h3 className="text-xl font-medium tracking-tight">Heading</h3>
        </div>
      );
    default:
      return null;
  }
}

function MotionTrack({ label, mono, desc, duration, easing, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left space-y-3 group"
    >
      <div className="h-16 bg-white border border-zinc-200 rounded-2xl overflow-hidden group-hover:border-zinc-300 transition-colors relative">
        <div className="absolute inset-x-5 inset-y-0 flex items-center">
          <div
            className="w-7 h-7 bg-black rounded-full transition-all"
            style={{
              marginLeft: active ? "calc(100% - 1.75rem)" : "0",
              transitionDuration: duration,
              transitionTimingFunction: easing,
            }}
          />
        </div>
      </div>
      <div className="flex items-baseline justify-between px-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{label}</span>
          <code className="text-xs font-mono text-zinc-400">{mono}</code>
        </div>
        <span className="text-xs text-zinc-400">{desc}</span>
      </div>
    </button>
  );
}

export default function SystemView() {
  const { dos, donts } = DESIGN.dosAndDonts;
  const motion = BRAND.motion;
  const imagery = BRAND.imagery;

  const [activeSection, setActiveSection] = useState("elevation");
  const [timingActive, setTimingActive] = useState({ fast: false, normal: false, slow: false });
  const [easingActive, setEasingActive] = useState({ default: false, enter: false, exit: false });

  const toggleTiming = (key) => setTimingActive((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleEasing = (key) => setEasingActive((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeSections = SECTIONS.filter((s) => {
    if (s.id === "motion" && !motion) return false;
    if (s.id === "imagery" && !imagery) return false;
    return true;
  });

  return (
    <section
      id="view-system"
      className="view-section animate-in fade-in duration-700"
    >
      {/* Header */}
      <div className="space-y-6 max-w-3xl mb-12">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Design System
        </h2>
        <div className="text-zinc-500 text-lg leading-relaxed space-y-4">
          {DESIGN.overview.description
            .split("\n\n")
            .filter((p) => p.trim())
            .map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
        </div>
      </div>

      {/* Sub-navigation — mirrors the main nav style */}
      <div className="border-b border-zinc-200 mb-16">
        <div className="flex gap-6 text-xs font-medium uppercase tracking-widest text-zinc-500 overflow-x-auto hide-scrollbar">
          {activeSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`whitespace-nowrap pb-3 transition-colors ${
                activeSection === s.id
                  ? "text-black border-b-2 border-black"
                  : "hover:text-black"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section content */}
      <div className="animate-in fade-in duration-300">
        {/* Elevation */}
        {activeSection === "elevation" && (
          <div className="space-y-10">
            <p className="text-zinc-500 leading-relaxed max-w-2xl">
              {DESIGN.elevation.description}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Level 0 -- Flat", border: "border-zinc-200", bg: "bg-white", desc: "Default surface. 1px border, no shadow." },
                { label: "Level 1 -- Hover", border: "border-zinc-400", bg: "bg-white", desc: "Interactive state. Darkened border on hover." },
                { label: "Level 2 -- Raised", border: "border-zinc-200", bg: "bg-zinc-50", desc: "Background shift. Surface-variant color." },
              ].map((level) => (
                <div key={level.label} className="space-y-3">
                  <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">{level.label}</p>
                  <div className={`aspect-[4/3] ${level.bg} rounded-2xl border ${level.border} flex items-center justify-center p-6`}>
                    <p className="text-zinc-400 text-sm text-center">{level.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Components */}
        {activeSection === "components" && (
          <div className="grid md:grid-cols-2 gap-6">
            {DESIGN.components.map((comp, i) => (
              <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white">
                <h3 className="font-bold mb-1">{comp.name}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{comp.description}</p>
                <ComponentPreview name={comp.name} />
              </div>
            ))}
          </div>
        )}

        {/* Motion */}
        {activeSection === "motion" && motion && (
          <div className="space-y-16">
            <p className="text-zinc-500 leading-relaxed max-w-2xl">
              {motion.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {motion.principles.map((p, i) => (
                <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white">
                  <h4 className="font-bold mb-2">{p.title}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">Timing</p>
                <p className="text-xs text-zinc-400">Click each track to animate. Click again to reset.</p>
              </div>
              <div className="space-y-3">
                <MotionTrack label="Fast" mono={motion.timing.fast} desc="Micro-interactions" duration={motion.timing.fast} easing={motion.easing.default} active={timingActive.fast} onClick={() => toggleTiming("fast")} />
                <MotionTrack label="Normal" mono={motion.timing.normal} desc="Transitions" duration={motion.timing.normal} easing={motion.easing.default} active={timingActive.normal} onClick={() => toggleTiming("normal")} />
                <MotionTrack label="Slow" mono={motion.timing.slow} desc="Complex sequences" duration={motion.timing.slow} easing={motion.easing.default} active={timingActive.slow} onClick={() => toggleTiming("slow")} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">Easing Curves</p>
                <p className="text-xs text-zinc-400">All at {motion.timing.normal}. Click to compare.</p>
              </div>
              <div className="space-y-3">
                <MotionTrack label="Default" mono={motion.easing.default} desc="General-purpose" duration={motion.timing.normal} easing={motion.easing.default} active={easingActive.default} onClick={() => toggleEasing("default")} />
                <MotionTrack label="Enter" mono={motion.easing.enter} desc="Appearing" duration={motion.timing.normal} easing={motion.easing.enter} active={easingActive.enter} onClick={() => toggleEasing("enter")} />
                <MotionTrack label="Exit" mono={motion.easing.exit} desc="Leaving" duration={motion.timing.normal} easing={motion.easing.exit} active={easingActive.exit} onClick={() => toggleEasing("exit")} />
              </div>
            </div>
          </div>
        )}

        {/* Imagery */}
        {activeSection === "imagery" && imagery && (
          <div className="space-y-16">
            <p className="text-zinc-500 leading-relaxed max-w-2xl">
              {imagery.description}
            </p>

            {imagery.photography && (
              <div className="space-y-8">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">Photography</p>
                <p className="text-zinc-500 leading-relaxed max-w-2xl">{imagery.photography.style}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 border border-zinc-200 rounded-2xl bg-white space-y-4">
                    <h4 className="font-bold">Subjects</h4>
                    <ul className="space-y-2">
                      {imagery.photography.subjects.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                          <span className="text-zinc-300 mt-0.5">--</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 border border-zinc-200 rounded-2xl bg-white space-y-4">
                    <h4 className="font-bold">Treatments</h4>
                    <ul className="space-y-2">
                      {imagery.photography.treatments.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {imagery.photography.avoid.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-sm leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imagery.illustration && (
              <div className="space-y-8">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">Illustration</p>
                <p className="text-zinc-500 leading-relaxed max-w-2xl">{imagery.illustration.style}</p>
                {imagery.illustration.avoid && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {imagery.illustration.avoid.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-sm leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Guidelines */}
        {activeSection === "guidelines" && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest uppercase text-emerald-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Do
              </h3>
              {dos.map((rule, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest uppercase text-red-600 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Don't
              </h3>
              {donts.map((rule, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-xl">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
