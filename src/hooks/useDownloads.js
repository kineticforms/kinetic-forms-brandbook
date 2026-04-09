import { useState } from "react";
import {
  generateRasterImage,
  generatePaddedSocialImage,
  generateWaveBannerImage,
  generateDiscordAnimatedGif,
  generateAnimatedWaveGif,
} from "../lib/imageUtils";
import { downloadBlob } from "../lib/downloadFile";
import { getAllSourceFiles } from "../lib/sourceFiles";
import brandRaw from "/BRAND.md?raw";
import designRaw from "/DESIGN.md?raw";
import {
  ensureFontsLoaded,
  getPosLogoTransparent,
  getNegLogoTransparent,
  getPosLogo,
  getNegLogo,
  getPosLogoText,
  getNegLogoText,
} from "../constants/svgTemplates";

function resetAfter(setStatus, key, ms) {
  setTimeout(() => setStatus((prev) => ({ ...prev, [key]: "idle" })), ms);
}

async function loadHtml2Pdf() {
  if (window.html2pdf) return window.html2pdf;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => resolve(window.html2pdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function useDownloads() {
  const [status, setStatus] = useState({
    pdf: "idle",
    source: "idle",
    assets: "idle",
    logos: "idle",
    social: "idle",
    animated: "idle",
    markdown: "idle",
  });
  const [isPrinting, setIsPrinting] = useState(false);

  // ── Shared asset generation helpers ──────────────────

  async function loadSvgs() {
    await ensureFontsLoaded();
    return {
      posLogoT: getPosLogoTransparent(), negLogoT: getNegLogoTransparent(),
      posLogo: getPosLogo(), negLogo: getNegLogo(),
      posLogoText: getPosLogoText(), negLogoText: getNegLogoText(),
    };
  }

  const processAssetBatch = async (folder, svg, baseName, w, h, jpgBg) => {
    folder.folder("png").file(`${baseName}-${w}x${h}.png`, await generateRasterImage(svg, w, h, "png"));
    folder.folder("webp").file(`${baseName}-${w}x${h}.webp`, await generateRasterImage(svg, w, h, "webp"));
    folder.folder("jpg").file(`${baseName}-${w}x${h}.jpg`, await generateRasterImage(svg, w, h, "jpeg", jpgBg));
  };

  const PLATFORMS = {
    twitter: [
      { name: "profile", w: 400, h: 400, wave: false },
      { name: "header", w: 1500, h: 500, wave: true },
      { name: "card", w: 1200, h: 628, wave: true },
      { name: "in-stream", w: 1200, h: 675, wave: true },
    ],
    facebook: [
      { name: "profile", w: 170, h: 170, wave: false },
      { name: "cover", w: 820, h: 312, wave: true },
      { name: "shared-image", w: 1200, h: 630, wave: true },
      { name: "event-cover", w: 1920, h: 1005, wave: true },
    ],
    linkedin: [
      { name: "profile", w: 400, h: 400, wave: false },
      { name: "personal-banner", w: 1584, h: 396, wave: true },
      { name: "company-cover", w: 1128, h: 191, wave: true },
      { name: "shared-image", w: 1200, h: 627, wave: true },
    ],
    instagram: [
      { name: "profile", w: 320, h: 320, wave: false },
      { name: "post-square", w: 1080, h: 1080, wave: true },
      { name: "post-landscape", w: 1080, h: 566, wave: true },
      { name: "post-portrait", w: 1080, h: 1350, wave: true },
      { name: "story", w: 1080, h: 1920, wave: true },
    ],
    youtube: [
      { name: "profile", w: 800, h: 800, wave: false },
      { name: "channel-art", w: 2560, h: 1440, wave: true },
      { name: "thumbnail", w: 1280, h: 720, wave: true },
    ],
    tiktok: [
      { name: "profile", w: 200, h: 200, wave: false },
      { name: "video-cover", w: 1080, h: 1920, wave: true },
    ],
    discord: [
      { name: "server-icon", w: 512, h: 512, wave: false },
      { name: "server-icon-wave", w: 512, h: 512, wave: true },
      { name: "server-banner", w: 960, h: 540, wave: true },
    ],
    pinterest: [
      { name: "profile", w: 165, h: 165, wave: false },
      { name: "pin", w: 1000, h: 1500, wave: true },
    ],
  };

  async function addLogoAssets(zip, svgs) {
    const { posLogoT, negLogoT, posLogo, negLogo, posLogoText, negLogoText } = svgs;
    const withTextFolder = zip.folder("with-text");
    const withoutTextFolder = zip.folder("without-text");
    const logoTransparentFolder = withoutTextFolder.folder("logo-transparent");
    const logoFolder = withoutTextFolder.folder("logo");

    logoTransparentFolder.folder("svg").file("kinetic-forms-logo-transparent-positive.svg", posLogoT);
    logoTransparentFolder.folder("svg").file("kinetic-forms-logo-transparent-negative.svg", negLogoT);
    logoFolder.folder("svg").file("kinetic-forms-logo-positive.svg", posLogo);
    logoFolder.folder("svg").file("kinetic-forms-logo-negative.svg", negLogo);
    withTextFolder.folder("svg").file("kinetic-forms-logo-text-positive.svg", posLogoText);
    withTextFolder.folder("svg").file("kinetic-forms-logo-text-negative.svg", negLogoText);

    const markSizes = [16, 32, 64, 192, 512, 1024, 2048, 4096, 7680];
    for (const size of markSizes) {
      await processAssetBatch(logoTransparentFolder, posLogoT, "kinetic-forms-logo-transparent-positive", size, size, "#ffffff");
      await processAssetBatch(logoTransparentFolder, negLogoT, "kinetic-forms-logo-transparent-negative", size, size, "#000000");
      await processAssetBatch(logoFolder, posLogo, "kinetic-forms-logo-positive", size, size, "#ffffff");
      await processAssetBatch(logoFolder, negLogo, "kinetic-forms-logo-negative", size, size, "#000000");
    }

    const lockupWidths = [150, 300, 600, 1200, 2400, 4800, 7680];
    const rectJpgFolder = withTextFolder.folder("jpg").folder("rectangular");
    for (const w of lockupWidths) {
      const h = Math.round(w / 3.125);
      withTextFolder.folder("png").file(`kinetic-forms-logo-text-positive-${w}x${h}.png`, await generateRasterImage(posLogoText, w, h, "png"));
      withTextFolder.folder("png").file(`kinetic-forms-logo-text-negative-${w}x${h}.png`, await generateRasterImage(negLogoText, w, h, "png"));
      withTextFolder.folder("webp").file(`kinetic-forms-logo-text-positive-${w}x${h}.webp`, await generateRasterImage(posLogoText, w, h, "webp"));
      withTextFolder.folder("webp").file(`kinetic-forms-logo-text-negative-${w}x${h}.webp`, await generateRasterImage(negLogoText, w, h, "webp"));
      rectJpgFolder.file(`kinetic-forms-logo-text-positive-${w}x${h}.jpg`, await generateRasterImage(posLogoText, w, h, "jpeg", "#ffffff"));
      rectJpgFolder.file(`kinetic-forms-logo-text-negative-${w}x${h}.jpg`, await generateRasterImage(negLogoText, w, h, "jpeg", "#000000"));
    }

    const squareJpgFolder = withTextFolder.folder("jpg").folder("square");
    const squareSizes = [512, 1024, 2048, 4096, 7680];
    for (const size of squareSizes) {
      const drawW = Math.round(size * 0.7);
      const drawH = Math.round(drawW / 3.125);
      squareJpgFolder.file(`kinetic-forms-logo-text-square-positive-${size}x${size}.jpg`, await generatePaddedSocialImage(posLogoText, size, size, drawW, drawH, "jpeg", "#ffffff"));
      squareJpgFolder.file(`kinetic-forms-logo-text-square-negative-${size}x${size}.jpg`, await generatePaddedSocialImage(negLogoText, size, size, drawW, drawH, "jpeg", "#000000"));
    }
  }

  async function addSocialAssets(zip, svgs) {
    const { posLogo, negLogo, posLogoText, negLogoText } = svgs;
    const socialFolder = zip.folder("social");
    const appIconsFolder = zip.folder("app-icons");
    const LOCKUP_RATIO = 3.125;
    const LIGHT_PARTICLES = "113, 113, 122";
    const DARK_PARTICLES = "161, 161, 170";

    appIconsFolder.file("favicon.ico", await generateRasterImage(posLogo, 32, 32, "png"));
    appIconsFolder.file("apple-touch-icon.png", await generateRasterImage(posLogo, 180, 180, "png"));
    appIconsFolder.file("android-chrome-192x192.png", await generateRasterImage(posLogo, 192, 192, "png"));
    appIconsFolder.file("android-chrome-512x512.png", await generateRasterImage(posLogo, 512, 512, "png"));
    appIconsFolder.file("app-store-icon-1024x1024.jpg", await generateRasterImage(posLogo, 1024, 1024, "jpeg", "#ffffff"));
    appIconsFolder.file("play-store-icon-512x512.png", await generateRasterImage(posLogo, 512, 512, "png"));

    const ogFolder = socialFolder.folder("open-graph");
    ogFolder.file("og-1200x630-light.jpg", await generateWaveBannerImage(1200, 630, posLogoText, 800, 256, "jpeg", "#ffffff", "113, 113, 122"));
    ogFolder.file("og-1200x630-dark.jpg", await generateWaveBannerImage(1200, 630, negLogoText, 800, 256, "jpeg", "#000000", "161, 161, 170"));

    for (const [platform, assets] of Object.entries(PLATFORMS)) {
      const pFolder = socialFolder.folder(platform);
      for (const { name, w, h, wave } of assets) {
        const base = `kinetic-forms-${platform}-${name}-${w}x${h}`;
        if (wave) {
          const isWide = w / h > 1.5;
          const logoH = Math.min(w, h) * (isWide ? 0.4 : 0.3);
          const logoW = isWide ? logoH * LOCKUP_RATIO : logoH;
          const pLogo = isWide ? posLogoText : posLogo;
          const nLogo = isWide ? negLogoText : negLogo;
          pFolder.file(`${base}-light.jpg`, await generateWaveBannerImage(w, h, pLogo, logoW, logoH, "jpeg", "#ffffff", LIGHT_PARTICLES));
          pFolder.file(`${base}-dark.jpg`, await generateWaveBannerImage(w, h, nLogo, logoW, logoH, "jpeg", "#000000", DARK_PARTICLES));
        } else {
          const logoSize = Math.min(w, h) * 0.65;
          pFolder.file(`${base}-light.jpg`, await generatePaddedSocialImage(posLogo, w, h, logoSize, logoSize, "jpeg", "#ffffff"));
          pFolder.file(`${base}-dark.jpg`, await generatePaddedSocialImage(negLogo, w, h, logoSize, logoSize, "jpeg", "#000000"));
        }
      }
    }

  }

  async function addAnimatedAssets(zip, svgs) {
    const { posLogo, negLogo, posLogoText, negLogoText } = svgs;
    const LOCKUP_RATIO = 3.125;
    const LIGHT_PARTICLES = "113, 113, 122";
    const DARK_PARTICLES = "161, 161, 170";

    // Animated posts (looping wave)
    const postLogoH = 1080 * 0.3;
    zip.file(
      "animated-post-1080x1080-light.gif",
      await generateAnimatedWaveGif(1080, 1080, posLogo, postLogoH, postLogoH, "#ffffff", LIGHT_PARTICLES),
    );
    zip.file(
      "animated-post-1080x1080-dark.gif",
      await generateAnimatedWaveGif(1080, 1080, negLogo, postLogoH, postLogoH, "#000000", DARK_PARTICLES),
    );

    // Animated banners (looping wave)
    const bannerLogoH = 500 * 0.4;
    const bannerLogoW = bannerLogoH * LOCKUP_RATIO;
    zip.file(
      "animated-banner-1500x500-light.gif",
      await generateAnimatedWaveGif(1500, 500, posLogoText, bannerLogoW, bannerLogoH, "#ffffff", LIGHT_PARTICLES),
    );
    zip.file(
      "animated-banner-1500x500-dark.gif",
      await generateAnimatedWaveGif(1500, 500, negLogoText, bannerLogoW, bannerLogoH, "#000000", DARK_PARTICLES),
    );

    // Animated Discord icons (surge animation for Nitro profiles)
    zip.file(
      "animated-discord-icon-512x512-light.gif",
      await generateDiscordAnimatedGif(512, posLogo, "#ffffff", LIGHT_PARTICLES),
    );
    zip.file(
      "animated-discord-icon-512x512-dark.gif",
      await generateDiscordAnimatedGif(512, negLogo, "#000000", DARK_PARTICLES),
    );
  }

  async function generateAndDownload(statusKey, filename, addFns) {
    setStatus((prev) => ({ ...prev, [statusKey]: "downloading" }));
    try {
      const svgs = await loadSvgs();
      const { default: JSZip } = await import("https://esm.sh/jszip");
      const zip = new JSZip();
      for (const fn of addFns) await fn(zip, svgs);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, filename);
      setStatus((prev) => ({ ...prev, [statusKey]: "success" }));
    } catch (error) {
      console.error("Asset generation failed", error);
      alert("Failed to generate assets. Please ensure your browser has enough memory available.");
    } finally {
      resetAfter(setStatus, statusKey, 4000);
    }
  }

  const triggerAssetsDownload = () => generateAndDownload("assets", "kinetic-forms-brand-assets.zip", [addLogoAssets, addSocialAssets]);
  const triggerLogoDownload = () => generateAndDownload("logos", "kinetic-forms-logo-assets.zip", [addLogoAssets]);
  const triggerSocialDownload = () => generateAndDownload("social", "kinetic-forms-social-assets.zip", [addSocialAssets]);
  const triggerAnimatedDownload = () => generateAndDownload("animated", "kinetic-forms-animated-assets.zip", [addAnimatedAssets]);

  const triggerPdfDownload = async () => {
    setStatus((prev) => ({ ...prev, pdf: "downloading" }));
    setIsPrinting(true);

    try {
      await loadHtml2Pdf();

      setTimeout(() => {
        window.scrollTo(0, 0);
        const element = document.getElementById("pdf-render-container");
        if (!element) {
          setIsPrinting(false);
          setStatus((prev) => ({ ...prev, pdf: "idle" }));
          return;
        }

        const opt = {
          margin: 0,
          filename: "kinetic-forms-brandbook.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            windowWidth: 1200,
            x: 0, y: 0, scrollX: 0, scrollY: 0,
            letterRendering: true,
          },
          jsPDF: {
            unit: "px",
            format: [1200, 1697],
            orientation: "portrait",
            hotfixes: ["px_scaling"],
          },
        };

        window
          .html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            setIsPrinting(false);
            setStatus((prev) => ({ ...prev, pdf: "success" }));
            resetAfter(setStatus, "pdf", 3000);
          })
          .catch((err) => {
            console.error("PDF generation failed:", err);
            setIsPrinting(false);
            setStatus((prev) => ({ ...prev, pdf: "idle" }));
          });
      }, 1000);
    } catch (error) {
      console.error("Failed to load html2pdf library:", error);
      setIsPrinting(false);
      setStatus((prev) => ({ ...prev, pdf: "idle" }));
    }
  };

  const triggerSourceDownload = async () => {
    setStatus((prev) => ({ ...prev, source: "downloading" }));

    try {
      const { default: JSZip } = await import("https://esm.sh/jszip");
      const zip = new JSZip();

      const sourceFiles = getAllSourceFiles();
      for (const [filePath, content] of Object.entries(sourceFiles)) {
        zip.file(filePath, content);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "kinetic-brandbook-source.zip");
      setStatus((prev) => ({ ...prev, source: "success" }));
    } catch (error) {
      console.error("Source code export failed:", error);
      alert("Failed to export source code. Please ensure your browser has enough memory available.");
    } finally {
      resetAfter(setStatus, "source", 3000);
    }
  };

  const triggerMarkdownDownload = async () => {
    setStatus((prev) => ({ ...prev, markdown: "downloading" }));
    try {
      const { default: JSZip } = await import("https://esm.sh/jszip");
      const zip = new JSZip();
      zip.file("BRAND.md", brandRaw);
      zip.file("DESIGN.md", designRaw);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "kinetic-forms-brand-spec.zip");
      setStatus((prev) => ({ ...prev, markdown: "success" }));
    } catch (error) {
      console.error("Markdown export failed:", error);
    } finally {
      resetAfter(setStatus, "markdown", 3000);
    }
  };

  return {
    downloadStatus: status,
    isPrinting,
    triggerAssetsDownload,
    triggerLogoDownload,
    triggerSocialDownload,
    triggerAnimatedDownload,
    triggerPdfDownload,
    triggerSourceDownload,
    triggerMarkdownDownload,
  };
}
