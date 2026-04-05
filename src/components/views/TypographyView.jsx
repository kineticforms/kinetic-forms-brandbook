export default function TypographyView() {
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
          Our typography is the anchor to our motion. We utilize crisp, highly
          legible neo-grotesque sans-serifs to provide a stable, clean structure
          that allows our dynamic interactions to shine.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
              Primary Typeface
            </p>
            <h3 className="text-5xl font-medium">General Sans</h3>
          </div>
          <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 text-3xl md:text-4xl">
            <span className="font-light">Aa</span>
            <span className="font-normal">Bb</span>
            <span className="font-medium">Cc</span>
            <span className="font-bold">Dd</span>
            <span className="font-extrabold">Ee</span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            General Sans acts as our universal voice. Unopinionated yet distinct,
            it ensures perfect clarity and focus, stripping away cognitive load
            to let the content breathe.
          </p>
        </div>

        <div className="space-y-10">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">
            Type Hierarchy
          </p>
          <div>
            <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
              <span>Display / H1</span>
              <span>Tracking: Tighter</span>
            </div>
            <h1 className="text-6xl font-medium tracking-tighter leading-none">
              Velocity by design
            </h1>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
              <span>Heading / H2</span>
              <span>Tracking: Tight</span>
            </div>
            <h2 className="text-4xl font-medium tracking-tight leading-none">
              Intelligent forms for modern teams
            </h2>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
              <span>Body Copy / P</span>
              <span>Tracking: Normal</span>
            </div>
            <p className="text-lg text-zinc-600 leading-relaxed">
              We craft digital spaces where momentum feels effortless. Every
              micro-interaction is deliberate, every layout meticulously
              considered. We believe that true technological sophistication
              shouldn't feel mechanical—it should feel like an extension of your
              own thought process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
