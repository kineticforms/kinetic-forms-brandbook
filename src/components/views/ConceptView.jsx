import { FileCode2, FileText, CheckCircle, XCircle } from "lucide-react";
import { BRAND, BRAND_PILLARS } from "../../constants/brand";
import TypewriterHeading from "../TypewriterHeading";
import DownloadButton from "../DownloadButton";

export default function ConceptView({
  downloadStatus,
  triggerPdfDownload,
  triggerSourceDownload,
  triggerMarkdownDownload,
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
