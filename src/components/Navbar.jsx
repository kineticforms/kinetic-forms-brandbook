import { NAV_VIEWS } from "../constants/brand";

export default function Navbar({ view, setView }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div className="flex items-center gap-3">
        <a href="https://kineticforms.ai" className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
          <span className="text-white font-bold text-xs">K.</span>
        </a>
        <span className="font-semibold tracking-tight uppercase text-sm">
          Kinetic Forms Brandbook
        </span>
      </div>
      <div className="flex gap-4 md:gap-6 text-xs font-medium uppercase tracking-widest text-zinc-500 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        {NAV_VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-2 whitespace-nowrap transition-colors ${view === v.id ? "text-black border-b-2 border-black pb-1" : "hover:text-black pb-1"}`}
          >
            <v.icon className="w-3.5 h-3.5" />
            {v.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
