export default function Footer() {
  return (
    <footer
      id="brandbook-footer"
      className="py-8 border-t border-zinc-200 px-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white relative z-10"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-black rounded-[2px] flex items-center justify-center">
          <span className="text-white font-bold text-[8px]">K.</span>
        </div>
        <span className="text-sm font-semibold">Kinetic Forms Identity</span>
      </div>
      <p className="text-zinc-400 text-xs tracking-wide uppercase font-medium">
        Confidential Brand Guidelines &copy; 2026
      </p>
    </footer>
  );
}
