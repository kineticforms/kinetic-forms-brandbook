import { useEffect, useRef } from "react";

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

export default function AnimatedWaveCanvas({
  aspectRatio = "1/1",
  bgColor = "#ffffff",
  particleRgb = "113, 113, 122",
  logoSvg = null,
  logoScale = 0.3,
  logoAspectRatio = 1,
  verticalShift = 0,
  speed = 0.008,
}) {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!logoSvg) return;
    let cancelled = false;
    svgToImage(logoSvg).then((img) => {
      if (!cancelled) logoRef.current = img;
    });
    return () => { cancelled = true; };
  }, [logoSvg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let cancelled = false;
    let time = 0;

    const getSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let { w, h } = getSize();

    const render = () => {
      if (cancelled) return;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      const refDiag = 900;
      const diag = Math.sqrt(w * w + h * h);
      const s = diag / refDiag;
      const cols = Math.ceil(60 * s);
      const rows = Math.ceil(30 * s);
      const spacing = 45;
      const fov = 400 * s;
      const cameraZ = 250 * s;
      const cameraY = -150 * s;
      const amplitude = 30 * s;
      const yOff = h * verticalShift;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - cols / 2) * spacing;
          const z = (j - rows / 2) * spacing;
          const y =
            Math.sin(x * 0.003 - time * 0.6) * amplitude +
            Math.sin(z * 0.004 - time * 0.5) * amplitude * 0.65 +
            Math.sin((x * 0.6 + z) * 0.0025 - time * 0.4) * amplitude * 0.3;
          const dx = x;
          const dy = y - cameraY;
          const dz = z + cameraZ;
          if (dz > 0) {
            const scale = fov / dz;
            const x2d = w / 2 + dx * scale;
            const y2d = h / 2 + yOff + dy * scale;
            if (x2d > -10 && x2d < w + 10 && y2d > -10 && y2d < h + 10) {
              const alpha = Math.max(0, Math.min(1, scale * 1.5 - 0.05));
              ctx.beginPath();
              ctx.arc(x2d, y2d, Math.max(0.5, scale * 2), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${particleRgb}, ${(alpha * 0.45).toFixed(3)})`;
              ctx.fill();
            }
          }
        }
      }

      const logo = logoRef.current;
      if (logo) {
        const lh = Math.min(w, h) * logoScale;
        const lw = lh * logoAspectRatio;
        ctx.drawImage(logo, (w - lw) / 2, (h - lh) / 2, lw, lh);
      }

      time += speed;
      animId = requestAnimationFrame(render);
    };

    render();

    const onResize = () => { ({ w, h } = getSize()); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [bgColor, particleRgb, logoScale, logoAspectRatio, verticalShift, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block"
      style={{ aspectRatio }}
    />
  );
}
