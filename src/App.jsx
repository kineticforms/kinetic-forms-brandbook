import { useState } from "react";
import { useDownloads } from "./hooks/useDownloads";
import CanvasWave from "./components/CanvasWave";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrintLayout from "./components/PrintLayout";
import ConceptView from "./components/views/ConceptView";
import LogoView from "./components/views/LogoView";
import TypographyView from "./components/views/TypographyView";
import ColorSystemView from "./components/views/ColorSystemView";

export default function App() {
  const [view, setView] = useState("concept");
  const {
    downloadStatus,
    isPrinting,
    triggerAssetsDownload,
    triggerPdfDownload,
    triggerSourceDownload,
    triggerMarkdownDownload,
  } = useDownloads();

  if (isPrinting) {
    return <PrintLayout />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <div
        className={`fixed top-0 left-0 w-full h-[80vh] pointer-events-none overflow-hidden z-0 transition-opacity duration-500 ${view === "concept" ? "opacity-100" : "opacity-0"}`}
      >
        <CanvasWave />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-50 pointer-events-none"></div>
      </div>

      <Navbar view={view} setView={setView} />

      <main
        id="brandbook-main"
        className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto"
      >
        {view === "concept" && (
          <ConceptView
            downloadStatus={downloadStatus}
            triggerPdfDownload={triggerPdfDownload}
            triggerSourceDownload={triggerSourceDownload}
            triggerMarkdownDownload={triggerMarkdownDownload}
          />
        )}
        {view === "logo" && (
          <LogoView
            downloadStatus={downloadStatus}
            triggerAssetsDownload={triggerAssetsDownload}
          />
        )}
        {view === "typography" && <TypographyView />}
        {view === "colors" && <ColorSystemView />}
      </main>

      <Footer />
    </div>
  );
}
