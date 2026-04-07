import { ArrowRight, FileCode2, FileText, CheckCircle, XCircle } from "lucide-react";
import { BRAND, DESIGN, BRAND_PILLARS } from "../../constants/brand";
import TypewriterHeading from "../TypewriterHeading";
import DownloadButton from "../DownloadButton";

export default function ConceptView({
  downloadStatus,
  triggerPdfDownload,
  triggerSourceDownload,
  triggerMarkdownDownload,
  onNavigate,
}) {
  const overviewParagraphs = BRAND.concept.description
    .split("\n\n")
    .filter((p) => p.trim());

  const voice = BRAND.voice;

  return (
    <section
      id="view-concept"
      className="view-section space-y-24 animate-in fade-in duration-700"
    >
      <div className="space-y-6">
        <TypewriterHeading />
        <div className="max-w-2xl space-y-4">
          {overviewParagraphs.map((p, i) => (
            <p key={i} className="text-zinc-500 text-lg leading-relaxed">
              {p.trim()}
            </p>
          ))}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 hide-in-export">
          <DownloadButton
            status={downloadStatus.pdf}
            onClick={triggerPdfDownload}
            idleLabel="Save as PDF"
            downloadingLabel="Generating Document Layout..."
            successLabel="Saved"
            variant="primary"
          />
          <DownloadButton
            status={downloadStatus.source}
            onClick={triggerSourceDownload}
            idleLabel="Export Source Code (.zip)"
            downloadingLabel="Packaging App..."
            successLabel="Exported"
            variant="secondary"
            idleIcon={FileCode2}
          />
          <DownloadButton
            status={downloadStatus.markdown}
            onClick={triggerMarkdownDownload}
            idleLabel="Export Brand Spec (.md)"
            downloadingLabel="Exporting..."
            successLabel="Exported"
            variant="secondary"
            idleIcon={FileText}
          />
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="space-y-8">
        <h2 className="text-2xl font-medium tracking-tight border-b border-zinc-200 pb-4">
          Brand Pillars
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {BRAND_PILLARS.map((pillar, i) => (
            <div
              key={i}
              className="p-8 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                <pillar.icon className="w-5 h-5 text-zinc-900" />
              </div>
              <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="aspect-square bg-zinc-900 rounded-3xl flex items-center justify-center p-12 group overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative w-full h-full border border-white/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
            <div className="w-1/2 h-0.5 bg-white rotate-45 translate-x-4"></div>
            <div className="w-1/2 h-0.5 bg-white -rotate-45 translate-x-4"></div>
            <div className="absolute w-0.5 h-1/2 bg-white -translate-x-8"></div>
          </div>
        </div>
        <div className="aspect-square bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="space-y-6">
            <div className="h-1 w-12 bg-black"></div>
            <h4 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
              Design
              <br />
              Overview
            </h4>
            <div className="text-zinc-500 text-base max-w-sm space-y-3">
              {DESIGN.overview.description
                .split("\n\n")
                .filter((p) => p.trim())
                .map((p, i) => (
                  <p key={i}>{p.trim()}</p>
                ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate("system")}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black hover:gap-3 transition-all"
          >
            Explore System <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice & Tone */}
      {voice && (
        <div className="space-y-12">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-medium tracking-tight border-b border-zinc-200 pb-4">
              Voice & Tone
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed">
              {voice.description}
            </p>
          </div>

          {voice.attributes && (
            <div className="flex flex-wrap gap-3">
              {voice.attributes.map((attr, i) => (
                <span
                  key={i}
                  className="px-4 py-2 border border-zinc-200 rounded-full text-sm font-medium bg-white"
                >
                  {attr}
                </span>
              ))}
            </div>
          )}

          {voice.principles && (
            <div className="grid md:grid-cols-2 gap-6">
              {voice.principles.map((p, i) => (
                <div
                  key={i}
                  className="p-8 border border-zinc-200 rounded-2xl bg-white"
                >
                  <h4 className="font-bold text-lg mb-2">{p.title}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {voice.vocabulary && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-emerald-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Preferred Words
                </h3>
                <div className="flex flex-wrap gap-2">
                  {voice.vocabulary.preferred.map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-medium"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-red-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Avoided Words
                </h3>
                <div className="flex flex-wrap gap-2">
                  {voice.vocabulary.avoided.map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm font-medium line-through decoration-red-300"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {voice.examples && (
            <div className="space-y-4">
              {voice.examples.map((ex, i) => (
                <div
                  key={i}
                  className="border border-zinc-200 rounded-2xl overflow-hidden"
                >
                  <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200">
                    <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                      {ex.context}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 divide-x divide-zinc-200">
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold tracking-widest uppercase">
                        <CheckCircle className="w-3 h-3" /> Do
                      </div>
                      <p className="text-sm leading-relaxed">{ex.do}</p>
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-red-600 text-xs font-bold tracking-widest uppercase">
                        <XCircle className="w-3 h-3" /> Don't
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {ex.dont}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
