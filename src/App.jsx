import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Layers, 
  Maximize, 
  ArrowRight,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
  Download,
  Loader2,
  CheckCircle2,
  FileCode2
} from 'lucide-react';

// --- TYPEWRITER COMPONENT ---
const TypewriterHeading = () => {
  const phrases = [
    "Intelligence Evolved.", 
    "Forms in Motion.", 
    "Let's Build.", 
    "Tomorrow Together."
  ];
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(40);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100 - Math.random() * 40);
      }

      if (!isDeleting && text === fullText) {
        setTypingSpeed(2500);
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const renderText = () => {
    const spaceIndex = text.indexOf(' ');
    if (spaceIndex !== -1) {
      return (
        <>
          {text.substring(0, spaceIndex)}
          <br />
          {text.substring(spaceIndex + 1)}
        </>
      );
    }
    return text;
  };

  return (
    <h1 id="typewriter-text" className="text-6xl md:text-8xl font-medium tracking-tighter leading-none h-[120px] md:h-[192px]">
      {renderText()}
      <span className="inline-block font-light animate-pulse text-zinc-300 -ml-1 md:-ml-2">|</span>
    </h1>
  );
};

// --- 3D WAVE COMPONENT ---
const CanvasWave = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles = [];
    const spacing = 45;
    const rows = 40;
    const cols = 80;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        particles.push({ x: (i - cols / 2) * spacing, z: (j - rows / 2) * spacing, y: 0 });
      }
    }

    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 2.5;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      const fov = 400;
      const cameraZ = 250;
      const cameraY = -150;
      const cameraX = 0;

      particles.forEach(p => {
        const baseY = Math.sin(p.x * 0.003 + time * 0.6) * 30 + Math.sin(p.z * 0.004 + time * 0.5) * 30;
        const dist = Math.sqrt(Math.pow(p.x - mouseX, 2) + Math.pow(p.z - mouseY, 2));
        const maxDist = 350;
        
        let mouseDisplacement = 0;
        if (dist < maxDist) {
          const damping = Math.pow(1 - dist / maxDist, 2.8); 
          mouseDisplacement = -50 * damping; 
        }

        p.y = baseY + mouseDisplacement;

        const dx = p.x - cameraX;
        const dy = p.y - cameraY;
        const dz = p.z + cameraZ;

        if (dz > 0) {
          const scale = fov / dz;
          const x2d = width / 2 + dx * scale;
          const y2d = height / 2 + dy * scale;

          if (x2d > -10 && x2d < width + 10 && y2d > -10 && y2d < height + 10) {
            const alpha = Math.max(0, Math.min(1, scale * 1.2 - 0.1));
            ctx.beginPath();
            ctx.arc(x2d, y2d, scale * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(113, 113, 122, ${alpha * 0.35})`;
            ctx.fill();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas id="bg-canvas" ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none no-print" />
  );
};

const App = () => {
  const [view, setView] = useState('concept');
  const [downloadStatus, setDownloadStatus] = useState({ pdf: 'idle', source: 'idle', assets: 'idle' });
  const [isPrinting, setIsPrinting] = useState(false);

  // Asset Generation (Image Processors)
  const generateRasterImage = (svgString, width, height, type, bgColor = null) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (bgColor || type === 'jpeg' || type === 'jpg') {
          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), `image/${type === 'jpg' ? 'jpeg' : type}`, 1.0);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const generatePaddedSocialImage = (svgString, canvasW, canvasH, drawW, drawH, type, bgColor) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d');
        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasW, canvasH);
        }
        const dx = (canvasW - drawW) / 2;
        const dy = (canvasH - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), `image/${type === 'jpg' ? 'jpeg' : type}`, 0.95);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const triggerAssetsDownload = async () => {
    setDownloadStatus(prev => ({ ...prev, assets: 'downloading' }));
    try {
      const { default: JSZip } = await import('https://esm.sh/jszip');
      const zip = new JSZip();

      const posLogoTransparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><text x="512" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="600" font-weight="900" fill="#000000" text-anchor="middle">K.</text></svg>`;
      const negLogoTransparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><text x="512" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="600" font-weight="900" fill="#ffffff" text-anchor="middle">K.</text></svg>`;
      const posLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect x="64" y="64" width="896" height="896" fill="#000000" rx="192"/><text x="512" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="600" font-weight="900" fill="#ffffff" text-anchor="middle">K.</text></svg>`;
      const negLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect x="64" y="64" width="896" height="896" fill="#ffffff" rx="192"/><text x="512" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="600" font-weight="900" fill="#000000" text-anchor="middle">K.</text></svg>`;
      const posLogoTextSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 512"><rect x="128" y="128" width="256" height="256" fill="#000000" rx="32"/><text x="256" y="325" font-family="system-ui, -apple-system, sans-serif" font-size="180" font-weight="900" fill="#ffffff" text-anchor="middle">K.</text><text x="480" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="160" font-weight="700" fill="#000000" text-anchor="start">Kinetic Forms</text></svg>`;
      const negLogoTextSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 512"><rect x="128" y="128" width="256" height="256" fill="#ffffff" rx="32"/><text x="256" y="325" font-family="system-ui, -apple-system, sans-serif" font-size="180" font-weight="900" fill="#000000" text-anchor="middle">K.</text><text x="480" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="160" font-weight="700" fill="#ffffff" text-anchor="start">Kinetic Forms</text></svg>`;

      const withTextFolder = zip.folder("with-text");
      const withoutTextFolder = zip.folder("without-text");
      const logoTransparentFolder = withoutTextFolder.folder("logo-transparent");
      const logoFolder = withoutTextFolder.folder("logo");
      const socialAppFolder = zip.folder("social-and-app");

      logoTransparentFolder.folder("svg").file("kinetic-forms-logo-transparent-positive.svg", posLogoTransparentSvg);
      logoTransparentFolder.folder("svg").file("kinetic-forms-logo-transparent-negative.svg", negLogoTransparentSvg);
      logoFolder.folder("svg").file("kinetic-forms-logo-positive.svg", posLogoSvg);
      logoFolder.folder("svg").file("kinetic-forms-logo-negative.svg", negLogoSvg);
      withTextFolder.folder("svg").file("kinetic-forms-logo-text-positive.svg", posLogoTextSvg);
      withTextFolder.folder("svg").file("kinetic-forms-logo-text-negative.svg", negLogoTextSvg);

      const processAssetBatch = async (parentFolder, svgData, baseName, width, height, bgColor) => {
        parentFolder.folder("png").file(`${baseName}-${width}x${height}.png`, await generateRasterImage(svgData, width, height, "png"));
        parentFolder.folder("webp").file(`${baseName}-${width}x${height}.webp`, await generateRasterImage(svgData, width, height, "webp"));
        parentFolder.folder("jpeg").file(`${baseName}-${width}x${height}.jpg`, await generateRasterImage(svgData, width, height, "jpeg", bgColor));
      };

      const markSizes = [16, 32, 64, 192, 512, 1024, 2048, 4096, 7680];
      for (const size of markSizes) {
        await processAssetBatch(logoTransparentFolder, posLogoTransparentSvg, "kinetic-forms-logo-transparent-positive", size, size, "#ffffff");
        await processAssetBatch(logoTransparentFolder, negLogoTransparentSvg, "kinetic-forms-logo-transparent-negative", size, size, "#000000");
        await processAssetBatch(logoFolder, posLogoSvg, "kinetic-forms-logo-positive", size, size, "#ffffff");
        await processAssetBatch(logoFolder, negLogoSvg, "kinetic-forms-logo-negative", size, size, "#000000");
      }

      const lockupWidths = [150, 300, 600, 1200, 2400, 4800, 7680];
      for (const width of lockupWidths) {
        const height = Math.round(width / 3.125);
        await processAssetBatch(withTextFolder, posLogoTextSvg, "kinetic-forms-logo-text-positive", width, height, "#ffffff");
        await processAssetBatch(withTextFolder, negLogoTextSvg, "kinetic-forms-logo-text-negative", width, height, "#000000");
      }

      socialAppFolder.file("favicon.ico", await generateRasterImage(posLogoSvg, 32, 32, "png"));
      socialAppFolder.file("apple-touch-icon.png", await generateRasterImage(posLogoSvg, 180, 180, "png"));
      socialAppFolder.file("android-chrome-192x192.png", await generateRasterImage(posLogoSvg, 192, 192, "png"));
      socialAppFolder.file("android-chrome-512x512.png", await generateRasterImage(posLogoSvg, 512, 512, "png"));
      socialAppFolder.file("app-store-icon.jpg", await generateRasterImage(posLogoSvg, 1024, 1024, "jpeg", "#ffffff"));
      socialAppFolder.file("play-store-icon.png", await generateRasterImage(posLogoSvg, 512, 512, "png"));
      
      socialAppFolder.file("open-graph-image-light.jpg", await generatePaddedSocialImage(posLogoTextSvg, 1200, 630, 800, 256, "jpeg", "#ffffff"));
      socialAppFolder.file("open-graph-image-dark.jpg", await generatePaddedSocialImage(negLogoTextSvg, 1200, 630, 800, 256, "jpeg", "#000000"));
      socialAppFolder.file("twitter-card-image-light.jpg", await generatePaddedSocialImage(posLogoTextSvg, 1200, 600, 800, 256, "jpeg", "#ffffff"));
      socialAppFolder.file("twitter-card-image-dark.jpg", await generatePaddedSocialImage(negLogoTextSvg, 1200, 600, 800, 256, "jpeg", "#000000"));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "kinetic-forms-brand-assets.zip";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadStatus(prev => ({ ...prev, assets: 'success' }));
    } catch (error) {
      console.error("Asset generation failed", error);
      alert("Failed to generate assets. Please ensure your browser has enough memory available.");
    } finally {
      setTimeout(() => setDownloadStatus(prev => ({ ...prev, assets: 'idle' })), 4000);
    }
  };

  const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) return resolve(window.html2pdf);
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const triggerPdfDownload = async () => {
    setDownloadStatus(prev => ({ ...prev, pdf: 'downloading' }));
    setIsPrinting(true);
    
    try {
      const html2pdf = await loadHtml2Pdf();
      
      setTimeout(() => {
        window.scrollTo(0, 0); 
        
        const element = document.getElementById('pdf-render-container');
        if (!element) {
          setIsPrinting(false);
          setDownloadStatus(prev => ({ ...prev, pdf: 'idle' }));
          return;
        }

        const opt = {
          margin:       0,
          filename:     'kinetic-forms-brandbook.pdf',
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            windowWidth: 1200,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            letterRendering: true
          },
          jsPDF:        { unit: 'px', format: [1200, 1697], orientation: 'portrait', hotfixes: ["px_scaling"] } 
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
          setIsPrinting(false);
          setDownloadStatus(prev => ({ ...prev, pdf: 'success' }));
          setTimeout(() => setDownloadStatus(prev => ({ ...prev, pdf: 'idle' })), 3000);
        }).catch(err => {
          console.error("PDF generation failed:", err);
          setIsPrinting(false);
          setDownloadStatus(prev => ({ ...prev, pdf: 'idle' }));
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to load html2pdf library:", error);
      setIsPrinting(false);
      setDownloadStatus(prev => ({ ...prev, pdf: 'idle' }));
    }
  };

  const triggerSourceDownload = async () => {
    setDownloadStatus(prev => ({ ...prev, source: 'downloading' }));
    
    try {
      const { default: JSZip } = await import('https://esm.sh/jszip');
      const zip = new JSZip();

      // 1. Package.json
      const packageJson = {
        name: "kinetic-forms-brandbook",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          "lucide-react": "^0.263.1",
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        devDependencies: {
          "@types/react": "^18.2.15",
          "@types/react-dom": "^18.2.7",
          "@vitejs/plugin-react": "^4.0.3",
          "autoprefixer": "^10.4.14",
          "postcss": "^8.4.27",
          "tailwindcss": "^3.3.3",
          "vite": "^4.4.5"
        }
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      // 2. Config Files
      zip.file("vite.config.js", `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n});`);
      zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}`);
      zip.file("postcss.config.js", `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}`);
      zip.file("index.html", `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Kinetic Forms Brandbook</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>`);
      
      // 3. README Documentation
      const readmeMd = `# Kinetic Forms Brandbook Source Code

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
`;
      zip.file("README.md", readmeMd);

      // 4. Source Files
      zip.folder("src").file("main.jsx", `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.jsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)`);
      zip.folder("src").file("index.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  @apply bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200;\n}\n\n.hide-scrollbar::-webkit-scrollbar {\n  display: none;\n}\n.hide-scrollbar {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n}`);

      // We dynamically inject a clean version of the App logic for the static export
      // (Omit the 'Export Source Code' button to prevent recursive string inception)
      const appJsxContent = `import React, { useState, useEffect, useRef } from 'react';
import { Zap, Layers, Maximize, ArrowRight, Image as ImageIcon, Type, Palette, LayoutTemplate } from 'lucide-react';

const TypewriterHeading = () => {
  const phrases = ["Intelligence Evolved.", "Forms in Motion.", "Let's Build.", "Tomorrow Together."];
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(40);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100 - Math.random() * 40);
      }
      if (!isDeleting && text === fullText) {
        setTypingSpeed(2500);
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const renderText = () => {
    const spaceIndex = text.indexOf(' ');
    if (spaceIndex !== -1) {
      return <>{text.substring(0, spaceIndex)}<br />{text.substring(spaceIndex + 1)}</>;
    }
    return text;
  };

  return (
    <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none h-[120px] md:h-[192px]">
      {renderText()}
      <span className="inline-block font-light animate-pulse text-zinc-300 -ml-1 md:-ml-2">|</span>
    </h1>
  );
};

const CanvasWave = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles = [];
    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 40; j++) {
        particles.push({ x: (i - 40) * 45, z: (j - 20) * 45, y: 0 });
      }
    }
    let time = 0, mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 2.5;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 2.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      width = canvas.offsetWidth; height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio; canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015; mouseX += (targetMouseX - mouseX) * 0.03; mouseY += (targetMouseY - mouseY) * 0.03;
      particles.forEach(p => {
        const baseY = Math.sin(p.x * 0.003 + time * 0.6) * 30 + Math.sin(p.z * 0.004 + time * 0.5) * 30;
        const dist = Math.sqrt(Math.pow(p.x - mouseX, 2) + Math.pow(p.z - mouseY, 2));
        p.y = baseY + (dist < 350 ? -50 * Math.pow(1 - dist / 350, 2.8) : 0);
        const dz = p.z + 250;
        if (dz > 0) {
          const scale = 400 / dz; const x2d = width / 2 + p.x * scale; const y2d = height / 2 + (p.y - 150) * scale;
          if (x2d > -10 && x2d < width + 10 && y2d > -10 && y2d < height + 10) {
            ctx.beginPath(); ctx.arc(x2d, y2d, scale * 2, 0, Math.PI * 2);
            ctx.fillStyle = \`rgba(113, 113, 122, \${Math.max(0, Math.min(1, scale * 1.2 - 0.1)) * 0.35})\`;
            ctx.fill();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationFrameId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const App = () => {
  const [view, setView] = useState('concept');
  const brandColors = [
    { name: 'Kinetic Black', hex: '#000000', text: 'text-white' },
    { name: 'Motion White', hex: '#FFFFFF', text: 'text-black', border: true },
    { name: 'Graphite', hex: '#18181B', text: 'text-white' },
    { name: 'Steel', hex: '#A1A1AA', text: 'text-black' },
    { name: 'Vapor', hex: '#F4F4F5', text: 'text-black', border: true }
  ];
  const views = [
    { id: 'concept', label: 'Concept', icon: LayoutTemplate },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'colors', label: 'Color System', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <div className={\`fixed top-0 left-0 w-full h-[80vh] pointer-events-none overflow-hidden z-0 transition-opacity duration-500 \${view === 'concept' ? 'opacity-100' : 'opacity-0'}\`}>
        <CanvasWave />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-50 pointer-events-none"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center"><span className="text-white font-bold text-xs">K.</span></div>
          <span className="font-semibold tracking-tight uppercase text-sm">Kinetic Forms Brandbook</span>
        </div>
        <div className="flex gap-4 md:gap-6 text-xs font-medium uppercase tracking-widest text-zinc-500 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {views.map((v) => (
            <button key={v.id} onClick={() => setView(v.id)} className={\`flex items-center gap-2 whitespace-nowrap transition-colors \${view === v.id ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black pb-1'}\`}>
              <v.icon className="w-3.5 h-3.5" />{v.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        
        {view === 'concept' && (
          <section className="space-y-24 animate-in fade-in duration-700">
            <div className="space-y-6">
              <TypewriterHeading />
              <p className="max-w-xl text-zinc-500 text-lg leading-relaxed">Kinetic Forms is an AI-native design system built for velocity. We blend relentless momentum with considered, human-centric details—creating digital experiences that feel alive, intuitive, and relentlessly forward-leaning.</p>
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-medium tracking-tight border-b border-zinc-200 pb-4">Brand Pillars</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'Velocity', desc: 'Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought.', icon: Zap },
                  { title: 'Flow', desc: 'Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior.', icon: Layers },
                  { title: 'Precision', desc: 'An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.', icon: Maximize }
                ].map((pillar, i) => (
                  <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-6"><pillar.icon className="w-5 h-5 text-zinc-900" /></div>
                    <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{pillar.desc}</p>
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
                  <h4 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">Intelligence <br/>in Motion.</h4>
                  <p className="text-zinc-500 text-base max-w-sm">Subtle geometric offset patterns help give a sense of intrigue, while maintaining structural integrity across all digital mediums.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black">
                  Explore Identity <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'logo' && (
          <section className="space-y-16 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-none">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Logo System</h2>
                <p className="text-zinc-500 text-lg leading-relaxed">Our mark strips away the superfluous, leaving only pure, directed energy. The Kinetic Forms identity is designed to scale effortlessly, maintaining absolute clarity from a 16px favicon to a stadium display.</p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Primary Lockup</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">Positive</span>
                    <div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">K.</div><span className="text-xl md:text-3xl font-semibold tracking-tight uppercase">Kinetic Forms</span></div>
                  </div>
                  <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">Negative</span>
                    <div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-14 md:h-14 bg-white text-black flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">K.</div><span className="text-xl md:text-3xl font-semibold tracking-tight uppercase text-white">Kinetic Forms</span></div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Standalone Mark</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">Positive</span><div className="w-32 h-32 bg-black text-white flex items-center justify-center font-bold text-6xl rounded-md">K.</div>
                  </div>
                  <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">Negative</span><div className="w-32 h-32 bg-white text-black flex items-center justify-center font-bold text-6xl rounded-md">K.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'typography' && (
          <section className="space-y-16 animate-in fade-in duration-700">
             <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Typography</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">Our typography is the anchor to our motion. We utilize crisp, highly legible neo-grotesque sans-serifs to provide a stable, clean structure that allows our dynamic interactions to shine.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
              <div className="space-y-8">
                <div><p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Primary Typeface</p><h3 className="text-5xl font-medium">System Sans</h3></div>
                <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 text-3xl md:text-4xl">
                  <span className="font-light">Aa</span><span className="font-normal">Bb</span><span className="font-medium">Cc</span><span className="font-bold">Dd</span><span className="font-extrabold">Ee</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">System Sans acts as our universal voice. Unopinionated yet distinct, it ensures perfect clarity and focus, stripping away cognitive load to let the content breathe.</p>
              </div>
              <div className="space-y-10">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">Type Hierarchy</p>
                <div>
                  <div className="flex justify-between items-end mb-2 text-xs text-zinc-400"><span>Display / H1</span><span>Tracking: Tighter</span></div>
                  <h1 className="text-6xl font-medium tracking-tighter leading-none">Velocity by design</h1>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2 text-xs text-zinc-400"><span>Heading / H2</span><span>Tracking: Tight</span></div>
                  <h2 className="text-4xl font-medium tracking-tight leading-none">Intelligent forms for modern teams</h2>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2 text-xs text-zinc-400"><span>Body Copy / P</span><span>Tracking: Normal</span></div>
                  <p className="text-lg text-zinc-600 leading-relaxed">We craft digital spaces where momentum feels effortless. Every micro-interaction is deliberate, every layout meticulously considered. We believe that true technological sophistication shouldn't feel mechanical—it should feel like an extension of your own thought process.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'colors' && (
          <section className="space-y-16 animate-in fade-in duration-700">
             <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Color System</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">Our palette is unapologetically minimalist. By constraining our colors to high-contrast monochromes, we eliminate visual noise, direct focus, and establish a premium, modern aesthetic.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8">
              {brandColors.map((color, i) => (
                <div key={i} className="space-y-4 group">
                  <div className={\`aspect-square rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 flex items-end p-4 \${color.border ? 'border border-zinc-200' : ''}\`} style={{ backgroundColor: color.hex }}>
                    <span className={\`\${color.text} font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity\`}>{color.hex}</span>
                  </div>
                  <div><h4 className="font-semibold">{color.name}</h4><p className="text-xs text-zinc-500 font-mono uppercase mt-1">{color.hex}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-16 bg-black rounded-3xl p-12 md:p-24 text-white overflow-hidden relative">
              <div className="relative z-10 max-w-lg space-y-6">
                <h3 className="text-3xl md:text-5xl font-medium tracking-tighter">Maximum Contrast.</h3>
                <p className="text-zinc-400 text-lg">Binary precision meets bold execution. Our core visual language relies on stark white against deep black, reflecting our AI-native foundation while creating striking, undeniable clarity.</p>
              </div>
              <div className="absolute right-0 top-0 w-full h-full md:w-1/2 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 right-12 w-64 h-64 border border-white rounded-full transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-16 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-75"></div>
                <div className="absolute top-1/2 right-20 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-50 bg-white/5"></div>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer className="py-8 border-t border-zinc-200 px-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white relative z-10">
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 bg-black rounded-[2px] flex items-center justify-center"><span className="text-white font-bold text-[8px]">K.</span></div>
          <span className="text-sm font-semibold">Kinetic Forms Identity</span>
        </div>
        <p className="text-zinc-400 text-xs tracking-wide uppercase font-medium">Confidential Brand Guidelines &copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;`;

      zip.folder("src").file("App.jsx", appJsxContent);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kinetic-brandbook-source.zip';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadStatus(prev => ({ ...prev, source: 'success' }));
    } catch (error) {
      console.error("Source code export failed:", error);
      alert("Failed to export source code. Please ensure your browser has enough memory available.");
    } finally {
      setTimeout(() => setDownloadStatus(prev => ({ ...prev, source: 'idle' })), 3000);
    }
  };

  const brandColors = [
    { name: 'Kinetic Black', hex: '#000000', text: 'text-white' },
    { name: 'Motion White', hex: '#FFFFFF', text: 'text-black', border: true },
    { name: 'Graphite', hex: '#18181B', text: 'text-white' },
    { name: 'Steel', hex: '#A1A1AA', text: 'text-black' },
    { name: 'Vapor', hex: '#F4F4F5', text: 'text-black', border: true }
  ];

  const views = [
    { id: 'concept', label: 'Concept', icon: LayoutTemplate },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'colors', label: 'Color System', icon: Palette },
  ];

  // -------------------------------------------------------------------------
  // NATIVE DEDICATED PDF / PRINT LAYOUT
  // Completely swaps UI for a layout that enforces perfect page breaks and formatting
  // -------------------------------------------------------------------------
  if (isPrinting) {
    return (
      <div className="absolute top-0 left-0 w-[1200px] bg-white text-black font-sans m-0 p-0">
        
        <div data-html2canvas-ignore="true" className="fixed top-0 left-0 w-screen h-screen z-[10000] bg-white flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <p className="font-medium text-lg tracking-normal">Generating High-Resolution PDF...</p>
        </div>

        <div id="pdf-render-container" className="w-[1200px] flex flex-col font-sans bg-white text-black m-0 p-0 origin-top-left">
          
          {/* Page 1: Concept */}
          {/* NOTE: Explicitly removing tracking-tight/tighter classes from this layout to prevent html2canvas character overlap bugs */}
          <div className="w-[1200px] h-[1697px] shrink-0 flex flex-col justify-center px-32 bg-white">
            <div className="space-y-16">
              <div className="space-y-6">
                <h1 className="text-8xl font-medium tracking-normal leading-none">Intelligence<br/>Evolved.</h1>
                <p className="max-w-2xl text-zinc-500 text-2xl leading-relaxed tracking-normal">
                  Kinetic Forms is an AI-native design system built for velocity. We blend relentless momentum with considered, human-centric details—creating digital experiences that feel alive, intuitive, and relentlessly forward-leaning.
                </p>
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl font-medium tracking-normal border-b border-zinc-200 pb-4">Brand Pillars</h2>
                <div className="grid grid-cols-3 gap-8">
                  <div className="p-8 border border-zinc-200 rounded-2xl bg-white">
                    <Zap className="w-8 h-8 text-black mb-6" />
                    <h3 className="font-bold text-xl mb-2 tracking-normal">Velocity</h3>
                    <p className="text-zinc-500 text-lg leading-relaxed tracking-normal">Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought.</p>
                  </div>
                  <div className="p-8 border border-zinc-200 rounded-2xl bg-white">
                    <Layers className="w-8 h-8 text-black mb-6" />
                    <h3 className="font-bold text-xl mb-2 tracking-normal">Flow</h3>
                    <p className="text-zinc-500 text-lg leading-relaxed tracking-normal">Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior.</p>
                  </div>
                  <div className="p-8 border border-zinc-200 rounded-2xl bg-white">
                    <Maximize className="w-8 h-8 text-black mb-6" />
                    <h3 className="font-bold text-xl mb-2 tracking-normal">Precision</h3>
                    <p className="text-zinc-500 text-lg leading-relaxed tracking-normal">An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2: Logo */}
          <div className="w-[1200px] h-[1697px] shrink-0 flex flex-col justify-center px-32 bg-[#FAFAFA]">
             <div className="space-y-16">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl font-medium tracking-normal">Logo System</h2>
                <p className="text-zinc-500 text-2xl leading-relaxed tracking-normal">
                  Our mark strips away the superfluous, leaving only pure, directed energy. The Kinetic Forms identity is designed to scale effortlessly, maintaining absolute clarity from a 16px favicon to a stadium display.
                </p>
              </div>
              <div className="space-y-12">
                <div>
                  <h3 className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-6">Primary Lockup</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center relative min-h-[280px]">
                      <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-400">Positive</span>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-4xl rounded-sm">K.</div>
                        <span className="text-4xl font-semibold tracking-normal uppercase">Kinetic Forms</span>
                      </div>
                    </div>
                    <div className="bg-black rounded-3xl p-12 flex flex-col items-center justify-center relative min-h-[280px]">
                      <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-500">Negative</span>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-4xl rounded-sm">K.</div>
                        <span className="text-4xl font-semibold tracking-normal uppercase text-white">Kinetic Forms</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-6">Standalone Mark</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
                      <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-400">Positive</span>
                      <div className="w-40 h-40 bg-black text-white flex items-center justify-center font-bold text-7xl rounded-md">K.</div>
                    </div>
                    <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
                      <span className="absolute top-6 left-8 text-xs font-bold tracking-normal uppercase text-zinc-500">Negative</span>
                      <div className="w-40 h-40 bg-white text-black flex items-center justify-center font-bold text-7xl rounded-md">K.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 3: Typography */}
          <div className="w-[1200px] h-[1697px] shrink-0 flex flex-col justify-center px-32 bg-white">
            <div className="space-y-16">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl font-medium tracking-normal">Typography</h2>
                <p className="text-zinc-500 text-2xl leading-relaxed tracking-normal">
                  Our typography is the anchor to our motion. We utilize crisp, highly legible neo-grotesque sans-serifs to provide a stable, clean structure that allows our dynamic interactions to shine.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-2">Primary Typeface</p>
                    <h3 className="text-6xl font-medium tracking-normal">System Sans</h3>
                  </div>
                  <div className="p-8 bg-[#fafafa] border border-zinc-200 rounded-2xl flex flex-wrap gap-6 text-5xl">
                    <span className="font-light tracking-normal">Aa</span>
                    <span className="font-normal tracking-normal">Bb</span>
                    <span className="font-medium tracking-normal">Cc</span>
                    <span className="font-bold tracking-normal">Dd</span>
                    <span className="font-extrabold tracking-normal">Ee</span>
                  </div>
                  <p className="text-zinc-500 text-xl leading-relaxed tracking-normal">
                    System Sans acts as our universal voice. Unopinionated yet distinct, it ensures perfect clarity and focus, stripping away cognitive load to let the content breathe.
                  </p>
                </div>
                <div className="space-y-12">
                  <p className="text-sm font-bold tracking-normal uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">Type Hierarchy</p>
                  <div>
                    <div className="flex justify-between items-end mb-4 text-sm text-zinc-400"><span className="tracking-normal">Display / H1</span><span className="tracking-normal">Tracking: Normal</span></div>
                    <h1 className="text-7xl font-medium tracking-normal leading-none">Velocity by design</h1>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-4 text-sm text-zinc-400"><span className="tracking-normal">Heading / H2</span><span className="tracking-normal">Tracking: Normal</span></div>
                    <h2 className="text-5xl font-medium tracking-normal leading-none">Intelligent forms for modern teams</h2>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-4 text-sm text-zinc-400"><span className="tracking-normal">Body Copy / P</span><span className="tracking-normal">Tracking: Normal</span></div>
                    <p className="text-2xl text-zinc-600 leading-relaxed tracking-normal">
                      We craft digital spaces where momentum feels effortless. Every micro-interaction is deliberate, every layout meticulously considered. We believe that true technological sophistication shouldn't feel mechanical—it should feel like an extension of your own thought process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4: Colors */}
          <div className="w-[1200px] h-[1697px] shrink-0 flex flex-col justify-center px-32 bg-[#FAFAFA]">
            <div className="space-y-16">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl font-medium tracking-normal">Color System</h2>
                <p className="text-zinc-500 text-2xl leading-relaxed tracking-normal">
                  Our palette is unapologetically minimalist. By constraining our colors to high-contrast monochromes, we eliminate visual noise, direct focus, and establish a premium, modern aesthetic.
                </p>
              </div>
              <div className="grid grid-cols-5 gap-6 pt-8">
                {brandColors.map((color, i) => (
                  <div key={i} className="space-y-4">
                    <div className={`aspect-square rounded-2xl flex items-end p-6 ${color.border ? 'border border-zinc-200' : ''}`} style={{ backgroundColor: color.hex }}>
                      <span className={`${color.text} font-mono text-lg tracking-normal`}>{color.hex}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl tracking-normal">{color.name}</h4>
                      <p className="text-sm text-zinc-500 font-mono uppercase mt-1 tracking-normal">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-16 bg-black rounded-3xl p-24 text-white overflow-hidden relative">
                <div className="relative z-10 max-w-xl space-y-6">
                  <h3 className="text-5xl font-medium tracking-normal">Maximum Contrast.</h3>
                  <p className="text-zinc-400 text-2xl leading-relaxed tracking-normal">Binary precision meets bold execution. Our core visual language relies on stark white against deep black, reflecting our AI-native foundation while creating striking, undeniable clarity.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN APP LAYOUT
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      
      {/* Dynamic 3D Wave Background for Concept View */}
      <div className={`fixed top-0 left-0 w-full h-[80vh] pointer-events-none overflow-hidden z-0 transition-opacity duration-500 ${view === 'concept' ? 'opacity-100' : 'opacity-0'}`}>
        <CanvasWave />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-50 pointer-events-none"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs">K.</span>
          </div>
          <span className="font-semibold tracking-tight uppercase text-sm">Kinetic Forms Brandbook</span>
        </div>
        <div className="flex gap-4 md:gap-6 text-xs font-medium uppercase tracking-widest text-zinc-500 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {views.map((v) => (
            <button 
              key={v.id}
              onClick={() => setView(v.id)} 
              className={`flex items-center gap-2 whitespace-nowrap transition-colors ${view === v.id ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black pb-1'}`}
            >
              <v.icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Container */}
      <main id="brandbook-main" className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        
        {/* VIEW: CONCEPT */}
        <section id="view-concept" className={`view-section space-y-24 animate-in fade-in duration-700 ${view === 'concept' ? 'block' : 'hidden'}`}>
          <div className="space-y-6">
            <TypewriterHeading />
            <p className="max-w-xl text-zinc-500 text-lg leading-relaxed">
              Kinetic Forms is an AI-native design system built for velocity. We blend relentless momentum with considered, human-centric details—creating digital experiences that feel alive, intuitive, and relentlessly forward-leaning.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 hide-in-export">
              <button 
                onClick={triggerPdfDownload}
                disabled={downloadStatus.pdf !== 'idle'}
                className={`px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  downloadStatus.pdf === 'success' ? 'bg-green-500 text-white' : 
                  downloadStatus.pdf === 'downloading' ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' :
                  'bg-black text-white hover:bg-zinc-800 hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                }`}
              >
                {downloadStatus.pdf === 'idle' && <Download className="w-4 h-4" />}
                {downloadStatus.pdf === 'downloading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {downloadStatus.pdf === 'success' && <CheckCircle2 className="w-4 h-4" />}
                
                {downloadStatus.pdf === 'idle' && 'Save as PDF'}
                {downloadStatus.pdf === 'downloading' && 'Generating Document Layout...'}
                {downloadStatus.pdf === 'success' && 'Saved'}
              </button>

              <button 
                onClick={triggerSourceDownload}
                disabled={downloadStatus.source !== 'idle'}
                className={`px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  downloadStatus.source === 'success' ? 'bg-green-500 text-white border-transparent' : 
                  downloadStatus.source === 'downloading' ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed border' :
                  'bg-white text-black border-zinc-200 hover:border-black hover:bg-zinc-50 shadow-sm border'
                }`}
              >
                {downloadStatus.source === 'idle' && <FileCode2 className="w-4 h-4" />}
                {downloadStatus.source === 'downloading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {downloadStatus.source === 'success' && <CheckCircle2 className="w-4 h-4" />}
                
                {downloadStatus.source === 'idle' && 'Export Source Code (.zip)'}
                {downloadStatus.source === 'downloading' && 'Packaging App...'}
                {downloadStatus.source === 'success' && 'Exported'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-medium tracking-tight border-b border-zinc-200 pb-4">Brand Pillars</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Velocity', desc: 'Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought.', icon: Zap },
                { title: 'Flow', desc: 'Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior.', icon: Layers },
                { title: 'Precision', desc: 'An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.', icon: Maximize }
              ].map((pillar, i) => (
                <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                    <pillar.icon className="w-5 h-5 text-zinc-900" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{pillar.desc}</p>
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
                <h4 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">Intelligence <br/>in Motion.</h4>
                <p className="text-zinc-500 text-base max-w-sm">Subtle geometric offset patterns help give a sense of intrigue, while maintaining structural integrity across all digital mediums.</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black">
                Explore Identity <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* VIEW: LOGO */}
        <section id="view-logo" className={`view-section space-y-16 animate-in fade-in duration-700 ${view === 'logo' ? 'block' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-none">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Logo System</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Our mark strips away the superfluous, leaving only pure, directed energy. The Kinetic Forms identity is designed to scale effortlessly, maintaining absolute clarity from a 16px favicon to a stadium display.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3 shrink-0 hide-in-export">
              <button 
                onClick={triggerAssetsDownload}
                disabled={downloadStatus.assets !== 'idle'}
                className={`px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 transition-all ${
                  downloadStatus.assets === 'success' ? 'bg-green-500 text-white border-transparent' : 
                  downloadStatus.assets === 'downloading' ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed' :
                  'bg-white text-black border-zinc-200 hover:border-black hover:bg-zinc-50 shadow-sm border'
                }`}
              >
                {downloadStatus.assets === 'idle' && <Download className="w-4 h-4" />}
                {downloadStatus.assets === 'downloading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {downloadStatus.assets === 'success' && <CheckCircle2 className="w-4 h-4" />}
                
                {downloadStatus.assets === 'idle' && 'Download Complete Asset Kit (.ZIP)'}
                {downloadStatus.assets === 'downloading' && 'Generating Assets (10-15s)...'}
                {downloadStatus.assets === 'success' && 'Downloaded Successfully'}
              </button>
              <p className="text-xs text-zinc-400 md:text-right max-w-[280px] leading-relaxed">
                Includes App/Social Icons, and all formats (SVG, PNG, WebP, JPG) scaled up to 8K resolution.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Primary Lockup</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
                  <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">Positive</span>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">K.</div>
                    <span className="text-xl md:text-3xl font-semibold tracking-tight uppercase">Kinetic Forms</span>
                  </div>
                </div>
                <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
                  <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">Negative</span>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white text-black flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">K.</div>
                    <span className="text-xl md:text-3xl font-semibold tracking-tight uppercase text-white">Kinetic Forms</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Standalone Mark</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
                  <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">Positive</span>
                  <div className="w-32 h-32 bg-black text-white flex items-center justify-center font-bold text-6xl rounded-md">K.</div>
                </div>
                <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
                  <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">Negative</span>
                  <div className="w-32 h-32 bg-white text-black flex items-center justify-center font-bold text-6xl rounded-md">K.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-zinc-200">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium">Clear Space</h3>
              <p className="text-zinc-500">To ensure legibility and impact, always maintain a minimum clear space around the logo equivalent to the height of the "K" icon.</p>
            </div>
            <div className="bg-zinc-100 p-12 rounded-3xl flex items-center justify-center">
              <div className="relative border border-dashed border-zinc-400 p-8">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 font-mono">1x</span>
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">1x</span>
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-2xl rounded-sm">K.</div>
              </div>
            </div>
          </div>
        </section>

        {/* VIEW: TYPOGRAPHY */}
        <section id="view-typography" className={`view-section space-y-16 animate-in fade-in duration-700 ${view === 'typography' ? 'block' : 'hidden'}`}>
           <div className="space-y-6 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Typography</h2>
            <p className="text-zinc-500 text-lg leading-relaxed">
              Our typography is the anchor to our motion. We utilize crisp, highly legible neo-grotesque sans-serifs to provide a stable, clean structure that allows our dynamic interactions to shine.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Primary Typeface</p>
                <h3 className="text-5xl font-medium">System Sans</h3>
              </div>
              <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 text-3xl md:text-4xl">
                <span className="font-light">Aa</span>
                <span className="font-normal">Bb</span>
                <span className="font-medium">Cc</span>
                <span className="font-bold">Dd</span>
                <span className="font-extrabold">Ee</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                System Sans acts as our universal voice. Unopinionated yet distinct, it ensures perfect clarity and focus, stripping away cognitive load to let the content breathe.
              </p>
            </div>

            <div className="space-y-10">
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">Type Hierarchy</p>
              <div>
                <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
                  <span>Display / H1</span>
                  <span>Tracking: Tighter</span>
                </div>
                <h1 className="text-6xl font-medium tracking-tighter leading-none">Velocity by design</h1>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
                  <span>Heading / H2</span>
                  <span>Tracking: Tight</span>
                </div>
                <h2 className="text-4xl font-medium tracking-tight leading-none">Intelligent forms for modern teams</h2>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2 text-xs text-zinc-400">
                  <span>Body Copy / P</span>
                  <span>Tracking: Normal</span>
                </div>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  We craft digital spaces where momentum feels effortless. Every micro-interaction is deliberate, every layout meticulously considered. We believe that true technological sophistication shouldn't feel mechanical—it should feel like an extension of your own thought process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VIEW: COLORS */}
        <section id="view-colors" className={`view-section space-y-16 animate-in fade-in duration-700 ${view === 'colors' ? 'block' : 'hidden'}`}>
           <div className="space-y-6 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Color System</h2>
            <p className="text-zinc-500 text-lg leading-relaxed">
              Our palette is unapologetically minimalist. By constraining our colors to high-contrast monochromes, we eliminate visual noise, direct focus, and establish a premium, modern aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8">
            {brandColors.map((color, i) => (
              <div key={i} className="space-y-4 group">
                <div 
                  className={`aspect-square rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 flex items-end p-4 ${color.border ? 'border border-zinc-200' : ''}`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className={`${color.text} font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {color.hex}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{color.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono uppercase mt-1">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-black rounded-3xl p-12 md:p-24 text-white overflow-hidden relative">
            <div className="relative z-10 max-w-lg space-y-6">
              <h3 className="text-3xl md:text-5xl font-medium tracking-tighter">Maximum Contrast.</h3>
              <p className="text-zinc-400 text-lg">Binary precision meets bold execution. Our core visual language relies on stark white against deep black, reflecting our AI-native foundation while creating striking, undeniable clarity.</p>
            </div>
            <div className="absolute right-0 top-0 w-full h-full md:w-1/2 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 right-12 w-64 h-64 border border-white rounded-full transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-16 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-75"></div>
              <div className="absolute top-1/2 right-20 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-50 bg-white/5"></div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="brandbook-footer" className="py-8 border-t border-zinc-200 px-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white relative z-10">
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
    </div>
  );
};

export default App;