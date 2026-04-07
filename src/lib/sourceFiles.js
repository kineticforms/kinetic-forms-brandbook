// Vite embeds the actual source file contents at build time via ?raw imports.
// This means the exported zip always reflects the real source code.
//
// When adding a new source file, add a ?raw import and entry below.

// Root config files
import packageJson from "/package.json?raw";
import viteConfig from "/vite.config.js?raw";
import tailwindConfig from "/tailwind.config.js?raw";
import postcssConfig from "/postcss.config.js?raw";
import indexHtml from "/index.html?raw";
import gitignore from "/.gitignore?raw";
import readme from "/README.md?raw";
import brandMd from "/BRAND.md?raw";
import designMd from "/DESIGN.md?raw";

// Scripts
import bundleJs from "/scripts/bundle.js?raw";

// src/ — constants
import brandJs from "/src/constants/brand.js?raw";
import svgTemplatesJs from "/src/constants/svgTemplates.js?raw";

// src/ — lib
import downloadFileJs from "/src/lib/downloadFile.js?raw";
import imageUtilsJs from "/src/lib/imageUtils.js?raw";
import parseBrandJs from "/src/lib/parseBrand.js?raw";
import parseDesignJs from "/src/lib/parseDesign.js?raw";
import sourceFilesJs from "/src/lib/sourceFiles.js?raw";

// src/ — hooks
import useDownloadsJs from "/src/hooks/useDownloads.js?raw";

// src/ — components
import canvasWaveJsx from "/src/components/CanvasWave.jsx?raw";
import downloadButtonJsx from "/src/components/DownloadButton.jsx?raw";
import footerJsx from "/src/components/Footer.jsx?raw";
import navbarJsx from "/src/components/Navbar.jsx?raw";
import printLayoutJsx from "/src/components/PrintLayout.jsx?raw";
import typewriterHeadingJsx from "/src/components/TypewriterHeading.jsx?raw";

// src/ — views
import colorSystemViewJsx from "/src/components/views/ColorSystemView.jsx?raw";
import conceptViewJsx from "/src/components/views/ConceptView.jsx?raw";
import logoViewJsx from "/src/components/views/LogoView.jsx?raw";
import typographyViewJsx from "/src/components/views/TypographyView.jsx?raw";
import systemViewJsx from "/src/components/views/SystemView.jsx?raw";

// src/ — entry
import appJsx from "/src/App.jsx?raw";
import indexCss from "/src/index.css?raw";
import mainJsx from "/src/main.jsx?raw";

export function getAllSourceFiles() {
  return {
    // Root
    "package.json": packageJson,
    "vite.config.js": viteConfig,
    "tailwind.config.js": tailwindConfig,
    "postcss.config.js": postcssConfig,
    "index.html": indexHtml,
    ".gitignore": gitignore,
    "README.md": readme,
    "BRAND.md": brandMd,
    "DESIGN.md": designMd,

    // Scripts
    "scripts/bundle.js": bundleJs,

    // src/constants
    "src/constants/brand.js": brandJs,
    "src/constants/svgTemplates.js": svgTemplatesJs,

    // src/lib
    "src/lib/downloadFile.js": downloadFileJs,
    "src/lib/imageUtils.js": imageUtilsJs,
    "src/lib/parseBrand.js": parseBrandJs,
    "src/lib/parseDesign.js": parseDesignJs,
    "src/lib/sourceFiles.js": sourceFilesJs,

    // src/hooks
    "src/hooks/useDownloads.js": useDownloadsJs,

    // src/components
    "src/components/CanvasWave.jsx": canvasWaveJsx,
    "src/components/DownloadButton.jsx": downloadButtonJsx,
    "src/components/Footer.jsx": footerJsx,
    "src/components/Navbar.jsx": navbarJsx,
    "src/components/PrintLayout.jsx": printLayoutJsx,
    "src/components/TypewriterHeading.jsx": typewriterHeadingJsx,

    // src/components/views
    "src/components/views/ColorSystemView.jsx": colorSystemViewJsx,
    "src/components/views/ConceptView.jsx": conceptViewJsx,
    "src/components/views/LogoView.jsx": logoViewJsx,
    "src/components/views/TypographyView.jsx": typographyViewJsx,
    "src/components/views/SystemView.jsx": systemViewJsx,

    // src/ entry
    "src/App.jsx": appJsx,
    "src/index.css": indexCss,
    "src/main.jsx": mainJsx,
  };
}
