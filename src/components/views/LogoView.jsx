import { useEffect, useState } from "react";
import { BRAND } from "../../constants/brand";
import DownloadButton from "../DownloadButton";
import AnimatedWaveCanvas from "../AnimatedWaveCanvas";
import DiscordAnimatedIcon from "../DiscordAnimatedIcon";
import { generateWaveBannerImage } from "../../lib/imageUtils";
import {
  ensureFontsLoaded,
  getPosLogo,
  getNegLogo,
  getPosLogoText,
  getNegLogoText,
} from "../../constants/svgTemplates";

const LOCKUP_RATIO = 3.125;

function BannerPreview({ width, height, bgColor, particleRgb, isLight, label, logoScale: logoScaleOverride }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let url;

    ensureFontsLoaded().then(() => {
      if (cancelled) return;
      const isWide = width / height > 1.5;
      const logoH = Math.min(width, height) * (logoScaleOverride ?? (isWide ? 0.4 : 0.3));
      const logoW = isWide ? logoH * LOCKUP_RATIO : logoH;
      const logoSvg = isLight
        ? isWide ? getPosLogoText() : getPosLogo()
        : isWide ? getNegLogoText() : getNegLogo();

      return generateWaveBannerImage(
        width, height, logoSvg, logoW, logoH, "png", bgColor, particleRgb,
      );
    }).then((blob) => {
      if (cancelled || !blob) return;
      url = URL.createObjectURL(blob);
      setSrc(url);
    });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [width, height, bgColor, particleRgb, isLight, logoScaleOverride]);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {src ? (
        <img src={src} alt={label} className="w-full h-auto block" />
      ) : (
        <div
          className="w-full animate-pulse rounded-2xl"
          style={{
            aspectRatio: `${width}/${height}`,
            backgroundColor: isLight ? "#f4f4f5" : "#27272a",
          }}
        />
      )}
      {label && (
        <span
          className="absolute top-4 left-5 text-xs font-bold tracking-widest uppercase"
          style={{ color: isLight ? "#a1a1aa" : "#71717a" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default function LogoView({ downloadStatus, triggerAssetsDownload, triggerLogoDownload, triggerSocialDownload, triggerAnimatedDownload }) {
  const [posLogoSvg, setPosLogoSvg] = useState(null);
  const [negLogoSvg, setNegLogoSvg] = useState(null);
  const [posLockupSvg, setPosLockupSvg] = useState(null);
  const [negLockupSvg, setNegLockupSvg] = useState(null);

  useEffect(() => {
    ensureFontsLoaded().then(() => {
      setPosLogoSvg(getPosLogo());
      setNegLogoSvg(getNegLogo());
      setPosLockupSvg(getPosLogoText());
      setNegLockupSvg(getNegLogoText());
    });
  }, []);

  return (
    <section
      id="view-logo"
      className="view-section space-y-16 animate-in fade-in duration-700"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-none">
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
            Logo System
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed">
            {BRAND.logo.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0 hide-in-export">
          <DownloadButton
            status={downloadStatus.assets}
            onClick={triggerAssetsDownload}
            idleLabel="Download Complete Asset Kit"
            downloadingLabel="Generating All Assets..."
            successLabel="Downloaded Successfully"
            variant="secondary"
          />
          <div className="flex gap-2">
            <DownloadButton
              status={downloadStatus.logos}
              onClick={triggerLogoDownload}
              idleLabel="Logo Package"
              downloadingLabel="Generating..."
              successLabel="Done"
              variant="secondary"
            />
            <DownloadButton
              status={downloadStatus.social}
              onClick={triggerSocialDownload}
              idleLabel="Social & App Package"
              downloadingLabel="Generating..."
              successLabel="Done"
              variant="secondary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
            Primary Lockup
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
              <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">
                Positive
              </span>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">
                  K.
                </div>
                <span className="text-xl md:text-3xl font-semibold tracking-tight uppercase">
                  Kinetic Forms
                </span>
              </div>
            </div>
            <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
              <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">
                Negative
              </span>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white text-black flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">
                  K.
                </div>
                <span className="text-xl md:text-3xl font-semibold tracking-tight uppercase text-white">
                  Kinetic Forms
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
            Standalone Mark
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
              <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">
                Positive
              </span>
              <div className="w-32 h-32 bg-black text-white flex items-center justify-center font-bold text-6xl rounded-md">
                K.
              </div>
            </div>
            <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
              <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">
                Negative
              </span>
              <div className="w-32 h-32 bg-white text-black flex items-center justify-center font-bold text-6xl rounded-md">
                K.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
            Social Banners
          </h3>
          <p className="text-zinc-500 mb-8 max-w-2xl">
            Banner images built from the canvas wave, tailored for every major
            platform. The asset kit includes all recommended sizes for Twitter,
            Facebook, LinkedIn, Instagram, YouTube, TikTok, Discord, and
            Pinterest in both light and dark variants.
          </p>
          <div className="space-y-4 mb-8">
            <BannerPreview
              width={1500}
              height={500}
              isLight
              bgColor="#ffffff"
              particleRgb="113, 113, 122"
              label="Positive — Banner"
            />
            <BannerPreview
              width={1500}
              height={500}
              isLight={false}
              bgColor="#000000"
              particleRgb="161, 161, 170"
              label="Negative — Banner"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <BannerPreview
              width={1080}
              height={1080}
              isLight
              bgColor="#ffffff"
              particleRgb="113, 113, 122"
              label="Positive — Post"
            />
            <BannerPreview
              width={1080}
              height={1080}
              isLight={false}
              bgColor="#000000"
              particleRgb="161, 161, 170"
              label="Negative — Post"
            />
          </div>
        </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-3">
              Animated Assets
            </h3>
            <p className="text-zinc-500 max-w-2xl">
              Looping wave animations for banners and posts, plus a
              hover-triggered Discord profile icon with a wave-surge
              effect. All exported as GIFs in the animated assets download.
            </p>
          </div>
          <div className="shrink-0 hide-in-export">
            <DownloadButton
              status={downloadStatus.animated}
              onClick={triggerAnimatedDownload}
              idleLabel="Animated Assets (GIF)"
              downloadingLabel="Generating GIFs..."
              successLabel="Done"
              variant="secondary"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <AnimatedWaveCanvas
              aspectRatio="1500/500"
              bgColor="#ffffff"
              particleRgb="113, 113, 122"
              logoSvg={posLockupSvg}
              logoScale={0.4}
              logoAspectRatio={LOCKUP_RATIO}
              verticalShift={-0.18}
            />
            <span className="absolute top-4 left-5 text-xs font-bold tracking-widest uppercase text-zinc-400 pointer-events-none">
              Positive — Banner
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <AnimatedWaveCanvas
              aspectRatio="1500/500"
              bgColor="#000000"
              particleRgb="161, 161, 170"
              logoSvg={negLockupSvg}
              logoScale={0.4}
              logoAspectRatio={LOCKUP_RATIO}
              verticalShift={-0.18}
            />
            <span className="absolute top-4 left-5 text-xs font-bold tracking-widest uppercase text-zinc-500 pointer-events-none">
              Negative — Banner
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden">
            <AnimatedWaveCanvas
              aspectRatio="1/1"
              bgColor="#ffffff"
              particleRgb="113, 113, 122"
              logoSvg={posLogoSvg}
              logoScale={0.3}
            />
            <span className="absolute top-4 left-5 text-xs font-bold tracking-widest uppercase text-zinc-400 pointer-events-none">
              Positive — Post
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <AnimatedWaveCanvas
              aspectRatio="1/1"
              bgColor="#000000"
              particleRgb="161, 161, 170"
              logoSvg={negLogoSvg}
              logoScale={0.3}
            />
            <span className="absolute top-4 left-5 text-xs font-bold tracking-widest uppercase text-zinc-500 pointer-events-none">
              Negative — Post
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-4">
            Discord Profile Icon
          </h4>
          <p className="text-zinc-500 mb-6 max-w-2xl text-sm">
            Static and animated variants — the animated version plays a
            wave-surge on hover. Animated GIFs for Discord Nitro are
            included in the download.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            <div className="space-y-3">
              <div className="rounded-full overflow-hidden shadow-lg">
                <BannerPreview
                  width={512}
                  height={512}
                  isLight={false}
                  bgColor="#000000"
                  particleRgb="161, 161, 170"
                  logoScale={0.5}
                />
              </div>
              <p className="text-xs text-zinc-400 font-medium text-center">Dark</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-full overflow-hidden shadow-lg border border-zinc-200">
                <BannerPreview
                  width={512}
                  height={512}
                  isLight
                  bgColor="#ffffff"
                  particleRgb="113, 113, 122"
                  logoScale={0.5}
                />
              </div>
              <p className="text-xs text-zinc-400 font-medium text-center">Light</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-full overflow-hidden shadow-lg">
                <DiscordAnimatedIcon
                  bgColor="#000000"
                  particleRgb="161, 161, 170"
                  logoSvg={negLogoSvg}
                  logoScale={0.5}
                />
              </div>
              <p className="text-xs text-zinc-400 font-medium text-center">Dark — Animated</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-full overflow-hidden shadow-lg border border-zinc-200">
                <DiscordAnimatedIcon
                  bgColor="#ffffff"
                  particleRgb="113, 113, 122"
                  logoSvg={posLogoSvg}
                  logoScale={0.5}
                />
              </div>
              <p className="text-xs text-zinc-400 font-medium text-center">Light — Animated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-zinc-200">
        <div className="space-y-4">
          <h3 className="text-2xl font-medium">Clear Space</h3>
          <p className="text-zinc-500">
            To ensure legibility and impact, always maintain a minimum clear
            space around the logo equivalent to the height of the "K" icon.
          </p>
        </div>
        <div className="bg-zinc-100 p-12 rounded-3xl flex items-center justify-center">
          <div className="relative border border-dashed border-zinc-400 p-8">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 font-mono">
              1x
            </span>
            <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">
              1x
            </span>
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-2xl rounded-sm">
              K.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
