import { BRAND_COLORS } from "../../constants/brand";

export default function ColorSystemView() {
  return (
    <section
      id="view-colors"
      className="view-section space-y-16 animate-in fade-in duration-700"
    >
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Color System
        </h2>
        <p className="text-zinc-500 text-lg leading-relaxed">
          Our palette is unapologetically minimalist. By constraining our colors
          to high-contrast monochromes, we eliminate visual noise, direct focus,
          and establish a premium, modern aesthetic.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8">
        {BRAND_COLORS.map((color, i) => (
          <div key={i} className="space-y-4 group">
            <div
              className={`aspect-square rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 flex items-end p-4 ${color.border ? "border border-zinc-200" : ""}`}
              style={{ backgroundColor: color.hex }}
            >
              <span
                className={`${color.text} font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                {color.hex}
              </span>
            </div>
            <div>
              <h4 className="font-semibold">{color.name}</h4>
              <p className="text-xs text-zinc-500 font-mono uppercase mt-1">
                {color.hex}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-black rounded-3xl p-12 md:p-24 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-lg space-y-6">
          <h3 className="text-3xl md:text-5xl font-medium tracking-tighter">
            Maximum Contrast.
          </h3>
          <p className="text-zinc-400 text-lg">
            Binary precision meets bold execution. Our core visual language
            relies on stark white against deep black, reflecting our AI-native
            foundation while creating striking, undeniable clarity.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-full h-full md:w-1/2 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 right-12 w-64 h-64 border border-white rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-16 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-75"></div>
          <div className="absolute top-1/2 right-20 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-50 bg-white/5"></div>
        </div>
      </div>
    </section>
  );
}
