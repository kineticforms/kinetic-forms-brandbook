import { DESIGN, DESIGN_COLORS } from "../../constants/brand";

function isLightHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function ColorSwatch({ hex, name, description, border }) {
  const textClass = isLightHex(hex) ? "text-black" : "text-white";
  return (
    <div className="space-y-3 group">
      <div
        className={`aspect-[4/3] rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 flex flex-col justify-end p-4 ${border ? "border border-zinc-200" : ""}`}
        style={{ backgroundColor: hex }}
      >
        <span
          className={`${textClass} font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          {hex}
        </span>
      </div>
      <div>
        <h4 className="font-semibold text-sm">{name}</h4>
        {description && (
          <p className="text-xs text-zinc-500 leading-relaxed mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function PairingDemo({ bg, text, outline, label }) {
  const textColor = isLightHex(bg) ? "text-zinc-900" : "text-white";
  const mutedColor = isLightHex(bg) ? "text-zinc-400" : "text-zinc-500";
  return (
    <div
      className="rounded-2xl p-8 space-y-4"
      style={{ backgroundColor: bg, border: `1px solid ${outline}` }}
    >
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: isLightHex(bg) ? "#A1A1AA" : "#A1A1AA" }}>
        {label}
      </p>
      <h3 className={`text-2xl font-medium tracking-tight ${textColor}`}>
        Heading text
      </h3>
      <p className={`text-sm leading-relaxed ${mutedColor}`}>
        Body text on this surface uses the on-surface token for primary content
        and on-surface-variant for secondary.
      </p>
      <div className="flex gap-3 pt-2">
        <button
          className="px-4 py-2 rounded-full text-xs font-medium"
          style={{
            backgroundColor: text,
            color: bg,
          }}
        >
          Primary
        </button>
        <button
          className="px-4 py-2 rounded-full text-xs font-medium"
          style={{
            border: `1px solid ${outline}`,
            color: text,
          }}
        >
          Secondary
        </button>
      </div>
    </div>
  );
}

export default function ColorSystemView() {
  const { dark, darkDescription, note } = DESIGN.colors;

  return (
    <section
      id="view-colors"
      className="view-section space-y-16 animate-in fade-in duration-700"
    >
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Color System
        </h2>
        <p className="text-zinc-500 text-lg leading-relaxed">{note}</p>
      </div>

      {/* Light Mode Tokens */}
      <div>
        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
          Light Mode
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DESIGN_COLORS.map((color, i) => (
            <ColorSwatch
              key={i}
              hex={color.hex}
              name={color.name}
              description={color.description}
              border={color.border}
            />
          ))}
        </div>
      </div>

      {/* Dark Mode Tokens */}
      {dark.length > 0 && (
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-4">
            Dark Mode
          </h3>
          {darkDescription && (
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-2xl">
              {darkDescription}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dark.map((color, i) => (
              <ColorSwatch
                key={i}
                hex={color.hex}
                name={color.token}
                description={color.description}
                border={isLightHex(color.hex)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Surface Pairing Demos */}
      <div>
        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
          Surface Pairings
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <PairingDemo
            bg="#FFFFFF"
            text="#000000"
            outline="#E4E4E7"
            label="Light / Surface"
          />
          <PairingDemo
            bg="#F4F4F5"
            text="#18181B"
            outline="#E4E4E7"
            label="Light / Surface-variant"
          />
          <PairingDemo
            bg="#18181B"
            text="#FFFFFF"
            outline="#27272A"
            label="Dark / Surface"
          />
          <PairingDemo
            bg="#000000"
            text="#FFFFFF"
            outline="#27272A"
            label="Dark / Surface-variant"
          />
        </div>
      </div>

      {/* Contrast Showcase */}
      <div className="bg-black rounded-3xl p-12 md:p-24 text-white overflow-hidden relative">
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
