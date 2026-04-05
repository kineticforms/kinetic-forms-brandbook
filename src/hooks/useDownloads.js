import { useState } from "react";
import { generateRasterImage, generatePaddedSocialImage } from "../lib/imageUtils";
import { downloadBlob } from "../lib/downloadFile";
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

      const processAssetBatch = async (folder, svg, baseName, w, h, jpegBg) => {
        folder.folder("png").file(`${baseName}-${w}x${h}.png`, await generateRasterImage(svg, w, h, "png"));
        folder.folder("webp").file(`${baseName}-${w}x${h}.webp`, await generateRasterImage(svg, w, h, "webp"));
        folder.folder("jpeg").file(`${baseName}-${w}x${h}.jpg`, await generateRasterImage(svg, w, h, "jpeg", jpegBg));
      };

      // Mark sizes
      const markSizes = [16, 32, 64, 192, 512, 1024, 2048, 4096, 7680];
      for (const size of markSizes) {
        await processAssetBatch(logoTransparentFolder, POS_LOGO_TRANSPARENT, "kinetic-forms-logo-transparent-positive", size, size, "#ffffff");
        await processAssetBatch(logoTransparentFolder, NEG_LOGO_TRANSPARENT, "kinetic-forms-logo-transparent-negative", size, size, "#000000");
        await processAssetBatch(logoFolder, POS_LOGO, "kinetic-forms-logo-positive", size, size, "#ffffff");
        await processAssetBatch(logoFolder, NEG_LOGO, "kinetic-forms-logo-negative", size, size, "#000000");
      }

      // Lockup sizes
      const lockupWidths = [150, 300, 600, 1200, 2400, 4800, 7680];
      for (const w of lockupWidths) {
        const h = Math.round(w / 3.125);
        await processAssetBatch(withTextFolder, POS_LOGO_TEXT, "kinetic-forms-logo-text-positive", w, h, "#ffffff");
        await processAssetBatch(withTextFolder, NEG_LOGO_TEXT, "kinetic-forms-logo-text-negative", w, h, "#000000");
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

      zip.file(
        "package.json",
        JSON.stringify(
          {
            name: "kinetic-forms-brandbook",
            private: true,
            version: "1.0.0",
            type: "module",
            scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
            dependencies: { "lucide-react": "^0.263.1", react: "^18.2.0", "react-dom": "^18.2.0" },
            devDependencies: {
              "@types/react": "^18.2.15",
              "@types/react-dom": "^18.2.7",
              "@vitejs/plugin-react": "^4.0.3",
              autoprefixer: "^10.4.14",
              postcss: "^8.4.27",
              tailwindcss: "^3.3.3",
              vite: "^4.4.5",
            },
          },
          null,
          2,
        ),
      );

      zip.file(
        "vite.config.js",
        [
          "import { defineConfig } from 'vite';",
          "import react from '@vitejs/plugin-react';",
          "",
          "export default defineConfig({",
          "  plugins: [react()],",
          "});",
        ].join("\n"),
      );
      zip.file(
        "tailwind.config.js",
        [
          "/** @type {import('tailwindcss').Config} */",
          "export default {",
          '  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],',
          "  theme: { extend: {} },",
          "  plugins: [],",
          "}",
        ].join("\n"),
      );
      zip.file(
        "postcss.config.js",
        ["export default {", "  plugins: {", "    tailwindcss: {},", "    autoprefixer: {},", "  },", "}"].join("\n"),
      );
      zip.file(
        "index.html",
        [
          "<!DOCTYPE html>",
          '<html lang="en">',
          "  <head>",
          '    <meta charset="UTF-8" />',
          '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
          "    <title>Kinetic Forms Brandbook</title>",
          "  </head>",
          "  <body>",
          '    <div id="root"></div>',
          '    <script type="module" src="/src/main.jsx"></script>',
          "  </body>",
          "</html>",
        ].join("\n"),
      );

      zip.file(
        "README.md",
        `# Kinetic Forms Brandbook Source Code

This repository contains the interactive React source code for the Kinetic Forms Brand Guidelines.

## Running Locally for Development

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Building for Production (Static Hosting)

To generate a static bundled HTML version for deployment on static hosting providers (Vercel, Netlify, AWS S3, GitHub Pages):

1. Run the build command:
   \`\`\`bash
   npm run build
   \`\`\`
2. The generated static files will be located in the \`dist\` directory. You can upload this entire folder directly to your hosting provider.
`,
      );

      const srcFolder = zip.folder("src");
      srcFolder.file(
        "main.jsx",
        [
          "import React from 'react'",
          "import ReactDOM from 'react-dom/client'",
          "import App from './App.jsx'",
          "import './index.css'",
          "",
          "ReactDOM.createRoot(document.getElementById('root')).render(",
          "  <React.StrictMode>",
          "    <App />",
          "  </React.StrictMode>,",
          ")",
        ].join("\n"),
      );
      srcFolder.file(
        "index.css",
        [
          "@tailwind base;",
          "@tailwind components;",
          "@tailwind utilities;",
          "",
          "body {",
          "  @apply bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200;",
          "}",
          "",
          ".hide-scrollbar::-webkit-scrollbar {",
          "  display: none;",
          "}",
          ".hide-scrollbar {",
          "  -ms-overflow-style: none;",
          "  scrollbar-width: none;",
          "}",
        ].join("\n"),
      );

      // Self-contained single-file App.jsx for the export
      // Uses the bundle script output if available, otherwise falls back to inline version
      const { getExportAppJsx } = await import("../constants/exportAppJsx.js");
      srcFolder.file("App.jsx", getExportAppJsx());

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

  return {
    downloadStatus: status,
    isPrinting,
    triggerAssetsDownload,
    triggerPdfDownload,
    triggerSourceDownload,
  };
}
