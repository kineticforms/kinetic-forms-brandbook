import { DESIGN } from "../../constants/brand";

const TRACKING_CLASS = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const LEADING_CLASS = {
  none: "leading-none",
  tight: "leading-tight",
  normal: "",
  relaxed: "leading-relaxed",
};

// Map DESIGN.md size tokens to Tailwind classes
const SIZE_CLASS = {
  "6xl / 8xl": "text-6xl",
  "4xl / 5xl": "text-4xl",
  lg: "text-lg",
  xs: "text-xs",
};

export default function TypographyView() {
  const typo = DESIGN.typography;
  const primaryFont = typo.fonts.headline || typo.fonts.body || "Sans";

  return (
    <section
      id="view-typography"
      className="view-section space-y-16 animate-in fade-in duration-700"
    >
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Typography
        </h2>
        <p className="text-zinc-500 text-lg leading-relaxed">
          {typo.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
              Primary Typeface
            </p>
            <h3 className="text-5xl font-medium">{primaryFont}</h3>
          </div>
          <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 text-3xl md:text-4xl">
            <span className="font-light">Aa</span>
            <span className="font-normal">Bb</span>
            <span className="font-medium">Cc</span>
            <span className="font-bold">Dd</span>
            <span className="font-extrabold">Ee</span>
          </div>
          {typo.source && (
            <p className="text-zinc-500 text-sm leading-relaxed">
              Loaded from{" "}
              <a
                href={typo.source}
                className="underline hover:text-zinc-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fontshare
              </a>
              {typo.fallback && (
                <>
                  . Fallback:{" "}
                  <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded">
                    {typo.fallback}
                  </code>
                </>
              )}
            </p>
          )}
        </div>

        <div className="space-y-10">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">
            Type Hierarchy
          </p>
          {typo.hierarchy.map((level) => {
            const trackingCls = TRACKING_CLASS[level.tracking] || "";
            const leadingCls = LEADING_CLASS[level.leading] || "";
            const sizeCls = SIZE_CLASS[level.size] || "text-lg";
            const isBody = level.level.toLowerCase().includes("body");
            const isLabel = level.level.toLowerCase().includes("label");

            return (
              <div key={level.level}>
                <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
                  <span>{level.level}</span>
                  <span>{level.weight}</span>
                </div>
                {isLabel ? (
                  <p
                    className={`${sizeCls} font-bold ${trackingCls} ${leadingCls} uppercase text-zinc-400`}
                  >
                    Section Label Example
                  </p>
                ) : isBody ? (
                  <p
                    className={`${sizeCls} ${trackingCls} ${leadingCls} text-zinc-600`}
                  >
                    We craft digital spaces where momentum feels effortless.
                    Every micro-interaction is deliberate, every layout
                    meticulously considered.
                  </p>
                ) : (
                  <h1
                    className={`${sizeCls} font-medium ${trackingCls} ${leadingCls}`}
                  >
                    {level.level.includes("H1")
                      ? "Velocity by design"
                      : "Intelligent forms for modern teams"}
                  </h1>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
