import { useEffect, useRef } from "react";
import { renderWaveSurgeFrame } from "../lib/imageUtils";

function svgToImage(svgString) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (err) => { URL.revokeObjectURL(url); reject(err); };
    img.src = url;
  });
}

const SURGE_DURATION = 2.5;

export default function DiscordAnimatedIcon({
  bgColor = "#000000",
  particleRgb = "161, 161, 170",
  logoSvg = null,
  logoScale = 0.35,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let surgeStart = null;
    let animating = false;
    let logoImg = null;
    let cancelled = false;

    const getSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return { w: 100, h: 100 };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let { w, h } = getSize();

    const drawFrame = (elapsed) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.clip();
      renderWaveSurgeFrame(ctx, w, h, elapsed, {
        bgColor,
        particleRgb,
        logoImg,
        logoScale,
        surgeDuration: SURGE_DURATION,
      });
      ctx.restore();
    };

    // Load logo, then redraw resting frame with it
    if (logoSvg) {
      svgToImage(logoSvg).then((img) => {
        if (cancelled) return;
        logoImg = img;
        if (!animating) drawFrame(null);
      });
    }

    // Initial resting frame (wave only, logo draws once loaded)
    drawFrame(null);

    const loop = (timestamp) => {
      if (!animating) return;
      const elapsed = (timestamp - surgeStart) / 1000;
      if (elapsed >= SURGE_DURATION) {
        drawFrame(null);
        animating = false;
        return;
      }
      drawFrame(elapsed);
      animId = requestAnimationFrame(loop);
    };

    const startSurge = () => {
      if (animating) return;
      surgeStart = performance.now();
      animating = true;
      animId = requestAnimationFrame(loop);
    };

    const onEnter = () => { startSurge(); };
    const onResize = () => {
      ({ w, h } = getSize());
      if (!animating) drawFrame(null);
    };

    canvas.addEventListener("mouseenter", onEnter);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("resize", onResize);
    };
  }, [bgColor, particleRgb, logoScale, logoSvg]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block"
      style={{ aspectRatio: "1/1", borderRadius: "50%" }}
      title="Hover to play"
    />
  );
}
