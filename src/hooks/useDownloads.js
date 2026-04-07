import { useState } from "react";
import { generateRasterImage, generatePaddedSocialImage } from "../lib/imageUtils";
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
      const socialAppFolder = zip.folder("social-and-app");

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

      // Social & app icons
      socialAppFolder.file("favicon.ico", await generateRasterImage(POS_LOGO, 32, 32, "png"));
      socialAppFolder.file("apple-touch-icon.png", await generateRasterImage(POS_LOGO, 180, 180, "png"));
      socialAppFolder.file("android-chrome-192x192.png", await generateRasterImage(POS_LOGO, 192, 192, "png"));
      socialAppFolder.file("android-chrome-512x512.png", await generateRasterImage(POS_LOGO, 512, 512, "png"));
      socialAppFolder.file("app-store-icon.jpg", await generateRasterImage(POS_LOGO, 1024, 1024, "jpeg", "#ffffff"));
      socialAppFolder.file("play-store-icon.png", await generateRasterImage(POS_LOGO, 512, 512, "png"));
      socialAppFolder.file("open-graph-image-light.jpg", await generatePaddedSocialImage(POS_LOGO_TEXT, 1200, 630, 800, 256, "jpeg", "#ffffff"));
      socialAppFolder.file("open-graph-image-dark.jpg", await generatePaddedSocialImage(NEG_LOGO_TEXT, 1200, 630, 800, 256, "jpeg", "#000000"));
      socialAppFolder.file("twitter-card-image-light.jpg", await generatePaddedSocialImage(POS_LOGO_TEXT, 1200, 600, 800, 256, "jpeg", "#ffffff"));
      socialAppFolder.file("twitter-card-image-dark.jpg", await generatePaddedSocialImage(NEG_LOGO_TEXT, 1200, 600, 800, 256, "jpeg", "#000000"));

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
