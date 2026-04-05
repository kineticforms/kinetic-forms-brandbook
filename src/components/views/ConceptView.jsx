import { ArrowRight } from "lucide-react";
import { BRAND_PILLARS } from "../../constants/brand";
import TypewriterHeading from "../TypewriterHeading";
import DownloadButton from "../DownloadButton";
import { FileCode2 } from "lucide-react";

export default function ConceptView({
  downloadStatus,
  triggerPdfDownload,
  triggerSourceDownload,
}) {
  return (
    <section
      id="view-concept"
      className="view-section space-y-24 animate-in fade-in duration-700"
    >
      <div className="space-y-6">
        <TypewriterHeading />
        <p className="max-w-xl text-zinc-500 text-lg leading-relaxed">
          Kinetic Forms is an AI-native design system built for velocity. We
          blend relentless momentum with considered, human-centric
          details—creating digital experiences that feel alive, intuitive, and
          relentlessly forward-leaning.
        </p>

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
        </div>
      </div>

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
              Intelligence <br />
              in Motion.
            </h4>
            <p className="text-zinc-500 text-base max-w-sm">
              Subtle geometric offset patterns help give a sense of intrigue,
              while maintaining structural integrity across all digital mediums.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black">
            Explore Identity <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
