import { BRAND } from "../../constants/brand";

export default function TypographyView() {
  const typo = BRAND.typography;
  const primary = typo.typefaces.find((t) => t.role === "primary") || typo.typefaces[0];
  const hierarchy = typo.hierarchy;

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
            <h3 className="text-5xl font-medium">{primary.name}</h3>
          </div>
          <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 text-3xl md:text-4xl">
            <span className="font-light">Aa</span>
            <span className="font-normal">Bb</span>
            <span className="font-medium">Cc</span>
            <span className="font-bold">Dd</span>
            <span className="font-extrabold">Ee</span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            {primary.description}
          </p>
        </div>

        <div className="space-y-10">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">
            Type Hierarchy
          </p>
          {hierarchy.map((level, i) => {
            const trackingCls = TRACKING_CLASS[level.tracking] || "";
            const leadingCls = LEADING_CLASS[level.leading] || "";
            const sizeClass =
              i === 0 ? "text-6xl" : i === 1 ? "text-4xl" : "text-lg";
            const isBody = i === hierarchy.length - 1;

            return (
              <div key={level.level}>
                <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
                  <span>{level.level}</span>
                  <span>
                    Tracking:{" "}
                    {level.tracking.charAt(0).toUpperCase() +
                      level.tracking.slice(1)}
                  </span>
                </div>
                {isBody ? (
                  <p
                    className={`${sizeClass} font-medium ${trackingCls} ${leadingCls} text-zinc-600`}
                  >
                    {level.sample}
                  </p>
                ) : (
                  <h1
                    className={`${sizeClass} font-medium ${trackingCls} ${leadingCls}`}
                  >
                    {level.sample}
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
