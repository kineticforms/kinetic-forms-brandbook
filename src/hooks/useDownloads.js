import { useState } from "react";
import {
  generateRasterImage,
  generatePaddedSocialImage,
  generateWaveBannerImage,
} from "../lib/imageUtils";
import { downloadBlob } from "../lib/downloadFile";
import { getAllSourceFiles } from "../lib/sourceFiles";
import brandRaw from "/BRAND.md?raw";
import designRaw from "/DESIGN.md?raw";
import {
  POS_LOGO_TRANSPARENT,
  NEG_LOGO_TRANSPARENT,
  POS_LOGO,
  NEG_LOGO,
  POS_LOGO_TEXT,
  NEG_LOGO_TEXT,
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
    markdown: "idle",
  });
  const [isPrinting, setIsPrinting] = useState(false);

  const triggerAssetsDownload = async () => {
    setStatus((prev) => ({ ...prev, assets: "downloading" }));
    try {
      const { default: JSZip } = await import("https://esm.sh/jszip");
      const zip = new JSZip();

      const withTextFolder = zip.folder("with-text");
      const withoutTextFolder = zip.folder("without-text");
      const logoTransparentFolder = withoutTextFolder.folder("logo-transparent");
      const logoFolder = withoutTextFolder.folder("logo");
      const socialFolder = zip.folder("social");
      const appIconsFolder = zip.folder("app-icons");

      // SVGs
      logoTransparentFolder.folder("svg").file("kinetic-forms-logo-transparent-positive.svg", POS_LOGO_TRANSPARENT);
      logoTransparentFolder.folder("svg").file("kinetic-forms-logo-transparent-negative.svg", NEG_LOGO_TRANSPARENT);
      logoFolder.folder("svg").file("kinetic-forms-logo-positive.svg", POS_LOGO);
      logoFolder.folder("svg").file("kinetic-forms-logo-negative.svg", NEG_LOGO);
      withTextFolder.folder("svg").file("kinetic-forms-logo-text-positive.svg", POS_LOGO_TEXT);
      withTextFolder.folder("svg").file("kinetic-forms-logo-text-negative.svg", NEG_LOGO_TEXT);

      const processAssetBatch = async (folder, svg, baseName, w, h, jpgBg) => {
        folder.folder("png").file(`${baseName}-${w}x${h}.png`, await generateRasterImage(svg, w, h, "png"));
        folder.folder("webp").file(`${baseName}-${w}x${h}.webp`, await generateRasterImage(svg, w, h, "webp"));
        folder.folder("jpg").file(`${baseName}-${w}x${h}.jpg`, await generateRasterImage(svg, w, h, "jpeg", jpgBg));
      };

      // Mark sizes
      const markSizes = [16, 32, 64, 192, 512, 1024, 2048, 4096, 7680];
      for (const size of markSizes) {
        await processAssetBatch(logoTransparentFolder, POS_LOGO_TRANSPARENT, "kinetic-forms-logo-transparent-positive", size, size, "#ffffff");
        await processAssetBatch(logoTransparentFolder, NEG_LOGO_TRANSPARENT, "kinetic-forms-logo-transparent-negative", size, size, "#000000");
        await processAssetBatch(logoFolder, POS_LOGO, "kinetic-forms-logo-positive", size, size, "#ffffff");
        await processAssetBatch(logoFolder, NEG_LOGO, "kinetic-forms-logo-negative", size, size, "#000000");
      }

      // Lockup sizes — rectangular
      const lockupWidths = [150, 300, 600, 1200, 2400, 4800, 7680];
      const rectJpgFolder = withTextFolder.folder("jpg").folder("rectangular");
      for (const w of lockupWidths) {
        const h = Math.round(w / 3.125);
        withTextFolder.folder("png").file(`kinetic-forms-logo-text-positive-${w}x${h}.png`, await generateRasterImage(POS_LOGO_TEXT, w, h, "png"));
        withTextFolder.folder("png").file(`kinetic-forms-logo-text-negative-${w}x${h}.png`, await generateRasterImage(NEG_LOGO_TEXT, w, h, "png"));
        withTextFolder.folder("webp").file(`kinetic-forms-logo-text-positive-${w}x${h}.webp`, await generateRasterImage(POS_LOGO_TEXT, w, h, "webp"));
        withTextFolder.folder("webp").file(`kinetic-forms-logo-text-negative-${w}x${h}.webp`, await generateRasterImage(NEG_LOGO_TEXT, w, h, "webp"));
        rectJpgFolder.file(`kinetic-forms-logo-text-positive-${w}x${h}.jpg`, await generateRasterImage(POS_LOGO_TEXT, w, h, "jpeg", "#ffffff"));
        rectJpgFolder.file(`kinetic-forms-logo-text-negative-${w}x${h}.jpg`, await generateRasterImage(NEG_LOGO_TEXT, w, h, "jpeg", "#000000"));
      }

      // Lockup sizes — square (text centered in square canvas)
      const squareJpgFolder = withTextFolder.folder("jpg").folder("square");
      const squareSizes = [512, 1024, 2048, 4096, 7680];
      for (const size of squareSizes) {
        const drawW = Math.round(size * 0.7);
        const drawH = Math.round(drawW / 3.125);
        squareJpgFolder.file(
          `kinetic-forms-logo-text-square-positive-${size}x${size}.jpg`,
          await generatePaddedSocialImage(POS_LOGO_TEXT, size, size, drawW, drawH, "jpeg", "#ffffff"),
        );
        squareJpgFolder.file(
          `kinetic-forms-logo-text-square-negative-${size}x${size}.jpg`,
          await generatePaddedSocialImage(NEG_LOGO_TEXT, size, size, drawW, drawH, "jpeg", "#000000"),
        );
      }

      // ── App icons ─────────────────────────────────────────
      appIconsFolder.file("favicon.ico", await generateRasterImage(POS_LOGO, 32, 32, "png"));
      appIconsFolder.file("apple-touch-icon.png", await generateRasterImage(POS_LOGO, 180, 180, "png"));
      appIconsFolder.file("android-chrome-192x192.png", await generateRasterImage(POS_LOGO, 192, 192, "png"));
      appIconsFolder.file("android-chrome-512x512.png", await generateRasterImage(POS_LOGO, 512, 512, "png"));
      appIconsFolder.file("app-store-icon-1024x1024.jpg", await generateRasterImage(POS_LOGO, 1024, 1024, "jpeg", "#ffffff"));
      appIconsFolder.file("play-store-icon-512x512.png", await generateRasterImage(POS_LOGO, 512, 512, "png"));

      // ── Open Graph (generic) ───────────────────────────
      const ogFolder = socialFolder.folder("open-graph");
      ogFolder.file("og-1200x630-light.jpg", await generateWaveBannerImage(1200, 630, POS_LOGO_TEXT, 800, 256, "jpeg", "#ffffff", "113, 113, 122"));
      ogFolder.file("og-1200x630-dark.jpg", await generateWaveBannerImage(1200, 630, NEG_LOGO_TEXT, 800, 256, "jpeg", "#000000", "161, 161, 170"));

      // ── Social media platforms ─────────────────────────
      // Each platform folder contains every recommended image
      // size for profile pictures, banners/covers, and posts.
      // Banners use the canvas wave background; profiles use
      // the logo mark centered on a solid background.

      const LOCKUP_RATIO = 3.125; // POS_LOGO_TEXT viewBox 1600×512
      const LIGHT_PARTICLES = "113, 113, 122"; // zinc-500
      const DARK_PARTICLES = "161, 161, 170"; // zinc-400

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
          { name: "server-banner", w: 960, h: 540, wave: true },
        ],
        pinterest: [
          { name: "profile", w: 165, h: 165, wave: false },
          { name: "pin", w: 1000, h: 1500, wave: true },
        ],
      };

      for (const [platform, assets] of Object.entries(PLATFORMS)) {
        const pFolder = socialFolder.folder(platform);

        for (const { name, w, h, wave } of assets) {
          const base = `kinetic-forms-${platform}-${name}-${w}x${h}`;

          if (wave) {
            // Wide formats get the text lockup; square/tall get the mark only
            const isWide = w / h > 1.5;
            const logoH = Math.min(w, h) * (isWide ? 0.4 : 0.3);
            const logoW = isWide ? logoH * LOCKUP_RATIO : logoH;

            const posLogo = isWide ? POS_LOGO_TEXT : POS_LOGO;
            const negLogo = isWide ? NEG_LOGO_TEXT : NEG_LOGO;

            pFolder.file(
              `${base}-light.jpg`,
              await generateWaveBannerImage(w, h, posLogo, logoW, logoH, "jpeg", "#ffffff", LIGHT_PARTICLES),
            );
            pFolder.file(
              `${base}-dark.jpg`,
              await generateWaveBannerImage(w, h, negLogo, logoW, logoH, "jpeg", "#000000", DARK_PARTICLES),
            );
          } else {
            // Profile pictures — logo mark centered on solid background
            const logoSize = Math.min(w, h) * 0.65;
            pFolder.file(
              `${base}-light.jpg`,
              await generatePaddedSocialImage(POS_LOGO, w, h, logoSize, logoSize, "jpeg", "#ffffff"),
            );
            pFolder.file(
              `${base}-dark.jpg`,
              await generatePaddedSocialImage(NEG_LOGO, w, h, logoSize, logoSize, "jpeg", "#000000"),
            );
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "kinetic-forms-brand-assets.zip");
      setStatus((prev) => ({ ...prev, assets: "success" }));
    } catch (error) {
      console.error("Asset generation failed", error);
      alert("Failed to generate assets. Please ensure your browser has enough memory available.");
    } finally {
      resetAfter(setStatus, "assets", 4000);
    }
  };

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
    triggerPdfDownload,
    triggerSourceDownload,
    triggerMarkdownDownload,
  };
}
