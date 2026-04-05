import { Zap, Layers, Maximize, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "../constants/brand";

const PAGE_CLASS =
  "w-[1200px] h-[1697px] shrink-0 flex flex-col justify-center px-32";

export default function PrintLayout() {
  return (
    <div className="absolute top-0 left-0 w-[1200px] bg-white text-black font-sans m-0 p-0">
      <div
        data-html2canvas-ignore="true"
        className="fixed top-0 left-0 w-screen h-screen z-[10000] bg-white flex flex-col items-center justify-center gap-4"
      >
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="font-medium text-lg tracking-normal">
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
              <h1 className="text-8xl font-medium tracking-normal leading-none">
                Intelligence
                <br />
                Evolved.
              </h1>
              <p className="max-w-2xl text-zinc-500 text-2xl leading-relaxed tracking-normal">
                Kinetic Forms is an AI-native design system built for velocity.
                We blend relentless momentum with considered, human-centric
                details—creating digital experiences that feel alive, intuitive,
                and relentlessly forward-leaning.
              </p>
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-medium tracking-normal border-b border-zinc-200 pb-4">
                Brand Pillars
              </h2>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { icon: Zap, title: "Velocity", desc: "Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought." },
                  { icon: Layers, title: "Flow", desc: "Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior." },
                  { icon: Maximize, title: "Precision", desc: "An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved." },
                ].map((pillar, i) => (
                  <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white">
                    <pillar.icon className="w-8 h-8 text-black mb-6" />
                    <h3 className="font-bold text-xl mb-2 tracking-normal">
                      {pillar.title}
                    </h3>
                    <p className="text-zinc-500 text-lg leading-relaxed tracking-normal">
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
              <h2 className="text-5xl font-medium tracking-normal">
                Logo System
              </h2>
              <p className="text-zinc-500 text-2xl leading-relaxed tracking-normal">
                Our mark strips away the superfluous, leaving only pure,
                directed energy. The Kinetic Forms identity is designed to scale
                effortlessly, maintaining absolute clarity from a 16px favicon to
                a stadium display.
              </p>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-6">
                  Primary Lockup
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center relative min-h-[280px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-400">
                      Positive
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-4xl rounded-sm">
                        K.
                      </div>
                      <span className="text-4xl font-semibold tracking-normal uppercase">
                        Kinetic Forms
                      </span>
                    </div>
                  </div>
                  <div className="bg-black rounded-3xl p-12 flex flex-col items-center justify-center relative min-h-[280px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-500">
                      Negative
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-4xl rounded-sm">
                        K.
                      </div>
                      <span className="text-4xl font-semibold tracking-normal uppercase text-white">
                        Kinetic Forms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-6">
                  Standalone Mark
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-400">
                      Positive
                    </span>
                    <div className="w-40 h-40 bg-black text-white flex items-center justify-center font-bold text-7xl rounded-md">
                      K.
                    </div>
                  </div>
                  <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-500">
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

        {/* Page 3: Typography */}
        <div className={`${PAGE_CLASS} bg-white`}>
          <div className="space-y-16">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-normal">
                Typography
              </h2>
              <p className="text-zinc-500 text-2xl leading-relaxed tracking-normal">
                Our typography is the anchor to our motion. We utilize crisp,
                highly legible neo-grotesque sans-serifs to provide a stable,
                clean structure that allows our dynamic interactions to shine.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-2">
                    Primary Typeface
                  </p>
                  <h3 className="text-6xl font-medium tracking-normal">
                    System Sans
                  </h3>
                </div>
                <div className="p-8 bg-[#fafafa] border border-zinc-200 rounded-2xl flex flex-wrap gap-6 text-5xl">
                  <span className="font-light tracking-normal">Aa</span>
                  <span className="font-normal tracking-normal">Bb</span>
                  <span className="font-medium tracking-normal">Cc</span>
                  <span className="font-bold tracking-normal">Dd</span>
                  <span className="font-extrabold tracking-normal">Ee</span>
                </div>
                <p className="text-zinc-500 text-xl leading-relaxed tracking-normal">
                  System Sans acts as our universal voice. Unopinionated yet
                  distinct, it ensures perfect clarity and focus, stripping away
                  cognitive load to let the content breathe.
                </p>
              </div>
              <div className="space-y-12">
                <p className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">
                  Type Hierarchy
                </p>
                <div>
                  <div className="flex justify-between items-end mb-4 text-sm text-zinc-400">
                    <span className="tracking-normal">Display / H1</span>
                    <span className="tracking-normal">Tracking: Normal</span>
                  </div>
                  <h1 className="text-7xl font-medium tracking-normal leading-none">
                    Velocity by design
                  </h1>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-4 text-sm text-zinc-400">
                    <span className="tracking-normal">Heading / H2</span>
                    <span className="tracking-normal">Tracking: Normal</span>
                  </div>
                  <h2 className="text-5xl font-medium tracking-normal leading-none">
                    Intelligent forms for modern teams
                  </h2>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-4 text-sm text-zinc-400">
                    <span className="tracking-normal">Body Copy / P</span>
                    <span className="tracking-normal">Tracking: Normal</span>
                  </div>
                  <p className="text-2xl text-zinc-600 leading-relaxed tracking-normal">
                    We craft digital spaces where momentum feels effortless.
                    Every micro-interaction is deliberate, every layout
                    meticulously considered. We believe that true technological
                    sophistication shouldn't feel mechanical—it should feel like
                    an extension of your own thought process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 4: Colors */}
        <div className={`${PAGE_CLASS} bg-[#FAFAFA]`}>
          <div className="space-y-16">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-5xl font-medium tracking-normal">
                Color System
              </h2>
              <p className="text-zinc-500 text-2xl leading-relaxed tracking-normal">
                Our palette is unapologetically minimalist. By constraining our
                colors to high-contrast monochromes, we eliminate visual noise,
                direct focus, and establish a premium, modern aesthetic.
              </p>
            </div>
            <div className="grid grid-cols-5 gap-6 pt-8">
              {BRAND_COLORS.map((color, i) => (
                <div key={i} className="space-y-4">
                  <div
                    className={`aspect-square rounded-2xl flex items-end p-6 ${color.border ? "border border-zinc-200" : ""}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className={`${color.text} font-mono text-lg tracking-normal`}
                    >
                      {color.hex}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl tracking-normal">
                      {color.name}
                    </h4>
                    <p className="text-sm text-zinc-500 font-mono uppercase mt-1 tracking-normal">
                      {color.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 bg-black rounded-3xl p-24 text-white overflow-hidden relative">
              <div className="relative z-10 max-w-xl space-y-6">
                <h3 className="text-5xl font-medium tracking-normal">
                  Maximum Contrast.
                </h3>
                <p className="text-zinc-400 text-2xl leading-relaxed tracking-normal">
                  Binary precision meets bold execution. Our core visual language
                  relies on stark white against deep black, reflecting our
                  AI-native foundation while creating striking, undeniable
                  clarity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
