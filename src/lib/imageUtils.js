function renderWaveToCanvas(width, height, { bgColor, particleRgb, time = 2.5, offsetY = 0, cameraYFactor = 1 }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Scale all parameters relative to the live animation's reference diagonal
  const refDiag = 900;
  const diag = Math.sqrt(width * width + height * height);
  const s = diag / refDiag;

  // Scale particle count with canvas size for consistent visual density
  const cols = Math.ceil(80 * s);
  const rows = Math.ceil(40 * s);
  const spacing = 45;
  const fov = 400 * s;
  const cameraZ = 250 * s;
  const cameraY = -150 * s * cameraYFactor;
  const amplitude = 30 * s;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - cols / 2) * spacing;
      const z = (j - rows / 2) * spacing;

      const y =
        Math.sin(x * 0.003 + time * 0.6) * amplitude +
        Math.sin(z * 0.004 + time * 0.5) * amplitude * 0.65 +
        Math.sin((x * 0.6 + z) * 0.0025 + time * 0.4) * amplitude * 0.3;

      const dx = x;
      const dy = y - cameraY;
      const dz = z + cameraZ;

      if (dz > 0) {
        const scale = fov / dz;
        const x2d = width / 2 + dx * scale;
        const y2d = height / 2 + offsetY + dy * scale;

        if (
          x2d > -10 &&
          x2d < width + 10 &&
          y2d > -10 &&
          y2d < height + 10
        ) {
          const alpha = Math.max(0, Math.min(1, scale * 1.5 - 0.05));
          ctx.beginPath();
          ctx.arc(x2d, y2d, Math.max(0.5, scale * 2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${particleRgb}, ${(alpha * 0.45).toFixed(3)})`;
          ctx.fill();
        }
      }
    }
  }

  return canvas;
}

export async function generateWaveBannerImage(
  width,
  height,
  logoSvg,
  logoDrawW,
  logoDrawH,
  type,
  bgColor,
  particleRgb,
) {
  // For wide banners, shift the wave surface up so the logo sits on the dots,
  // and pick a time value that dips on the left, building to a crest center-right
  const isWide = width / height > 1.5;
  const offsetY = isWide ? -height * 0.18 : 0;
  const time = isWide ? 0.8 : 2.5;
  const cameraYFactor = 1;
  const canvas = renderWaveToCanvas(width, height, { bgColor, particleRgb, offsetY, time, cameraYFactor });
  const ctx = canvas.getContext("2d");

  if (logoSvg) {
    const img = await svgToImage(logoSvg);
    ctx.drawImage(
      img,
      (width - logoDrawW) / 2,
      (height - logoDrawH) / 2,
      logoDrawW,
      logoDrawH,
    );
  }

  return canvasToBlob(canvas, type, 0.95);
}

function svgToImage(svgString) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality = 1.0) {
  const mimeType = `image/${type === "jpg" ? "jpeg" : type}`;
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

// ── Wave-surge rendering (shared by Discord preview + GIF export) ─────

export function renderWaveSurgeFrame(ctx, w, h, elapsed, {
  bgColor,
  particleRgb,
  baseTime = 2.5,
  surgeDuration = 2.5,
  logoImg = null,
  logoScale = 0.5,
}) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const refDiag = 900;
  const diag = Math.sqrt(w * w + h * h);
  const s = diag / refDiag;

  // Dense grid + small particles so the wave surface reads at icon sizes
  const cols = Math.ceil(100 * s);
  const rows = Math.ceil(50 * s);
  const spacing = 27;
  const gridHalfW = (cols / 2) * spacing;
  const fov = 400 * s;
  const cameraZ = 250 * s;
  const cameraY = -150 * s;
  const baseAmplitude = 30 * s;
  const surgeWidth = gridHalfW * 0.5;

  let surgeX = 0;
  let surgeIntensity = 0;
  let waveTime = baseTime;

  if (elapsed !== null && elapsed < surgeDuration) {
    const p = elapsed / surgeDuration;
    surgeX = -gridHalfW * 1.3 + p * gridHalfW * 2.6;
    surgeIntensity = Math.sin(p * Math.PI) * 3.5;
    waveTime = baseTime + elapsed * 1.5;
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - cols / 2) * spacing;
      const z = (j - rows / 2) * spacing;

      const distFromSurge = Math.abs(x - surgeX);
      const surgeFactor = Math.max(0, 1 - distFromSurge / surgeWidth);
      const amplitude = baseAmplitude * (1 + surgeIntensity * surgeFactor);

      const y =
        Math.sin(x * 0.003 - waveTime * 0.6) * amplitude +
        Math.sin(z * 0.004 - waveTime * 0.5) * amplitude * 0.65 +
        Math.sin((x * 0.6 + z) * 0.0025 - waveTime * 0.4) * amplitude * 0.3;

      const dx = x;
      const dy = y - cameraY;
      const dz = z + cameraZ;

      if (dz > 0) {
        const scale = fov / dz;
        const x2d = w / 2 + dx * scale;
        const y2d = h / 2 + dy * scale;
        if (x2d > -10 && x2d < w + 10 && y2d > -10 && y2d < h + 10) {
          const alpha = Math.max(0, Math.min(1, scale * 1.5 - 0.05));
          const opacityMul = 1 + surgeFactor * surgeIntensity * 0.12;
          const radiusMul = 1 + surgeFactor * surgeIntensity * 0.06;
          ctx.beginPath();
          ctx.arc(x2d, y2d, Math.max(0.3, scale * 1.0 * radiusMul), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${particleRgb}, ${(alpha * 0.5 * Math.min(opacityMul, 2.5)).toFixed(3)})`;
          ctx.fill();
        }
      }
    }
  }

  if (logoImg) {
    // Subtle scale pulse timed to the surge crest passing center
    let pulse = 1;
    if (elapsed !== null && elapsed < surgeDuration) {
      const p = elapsed / surgeDuration;
      const nearCenter = Math.max(0, 1 - Math.abs(p - 0.5) * 5);
      pulse = 1 + nearCenter * 0.06;
    }
    const lh = Math.min(w, h) * logoScale * pulse;
    const lw = lh;
    ctx.drawImage(logoImg, (w - lw) / 2, (h - lh) / 2, lw, lh);
  }
}

// ── GIF generators ────────────────────────────────────────────────────

function yieldToMain() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function loadGifenc() {
  return import("https://cdn.jsdelivr.net/npm/gifenc@1.0.3/+esm");
}

export async function generateDiscordAnimatedGif(
  size, logoSvg, bgColor, particleRgb, logoScale = 0.5,
) {
  const { GIFEncoder, quantize, applyPalette } = await loadGifenc();

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const logoImg = logoSvg ? await svgToImage(logoSvg) : null;

  const fps = 20;
  const surgeDuration = 2.5;
  const totalFrames = Math.ceil(fps * surgeDuration);
  const delay = Math.round(1000 / fps);
  const gif = GIFEncoder();

  for (let frame = 0; frame <= totalFrames; frame++) {
    const elapsed = frame / fps;
    const isLast = frame === totalFrames;

    renderWaveSurgeFrame(ctx, size, size, isLast ? null : elapsed, {
      bgColor, particleRgb, logoImg, logoScale, surgeDuration,
    });

    const imageData = ctx.getImageData(0, 0, size, size);
    const palette = quantize(imageData.data, 256);
    const index = applyPalette(imageData.data, palette);
    gif.writeFrame(index, size, size, {
      palette,
      delay: isLast ? 3000 : delay,
      ...(frame === 0 ? { repeat: 0 } : {}),
    });

    if (frame % 5 === 0) await yieldToMain();
  }

  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}

export async function generateAnimatedWaveGif(
  width, height, logoSvg, logoDrawW, logoDrawH, bgColor, particleRgb,
) {
  const { GIFEncoder, quantize, applyPalette } = await loadGifenc();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const logoImg = logoSvg ? await svgToImage(logoSvg) : null;

  const isWide = width / height > 1.5;
  const offsetY = isWide ? -height * 0.18 : 0;

  const fps = 15;
  const duration = 4;
  const totalFrames = fps * duration;
  const delay = Math.round(1000 / fps);
  const timePerFrame = 0.48 / fps;

  const refDiag = 900;
  const diag = Math.sqrt(width * width + height * height);
  const s = diag / refDiag;
  const cols = Math.ceil(70 * s);
  const rows = Math.ceil(35 * s);
  const spacing = 45;
  const fov = 400 * s;
  const cameraZ = 250 * s;
  const cameraY = -150 * s;
  const amplitude = 30 * s;

  const gif = GIFEncoder();

  for (let frame = 0; frame < totalFrames; frame++) {
    const time = frame * timePerFrame;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

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
          const x2d = width / 2 + dx * scale;
          const y2d = height / 2 + offsetY + dy * scale;
          if (x2d > -10 && x2d < width + 10 && y2d > -10 && y2d < height + 10) {
            const alpha = Math.max(0, Math.min(1, scale * 1.5 - 0.05));
            ctx.beginPath();
            ctx.arc(x2d, y2d, Math.max(0.5, scale * 2), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleRgb}, ${(alpha * 0.45).toFixed(3)})`;
            ctx.fill();
          }
        }
      }
    }

    if (logoImg) {
      ctx.drawImage(logoImg, (width - logoDrawW) / 2, (height - logoDrawH) / 2, logoDrawW, logoDrawH);
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    const palette = quantize(imageData.data, 256);
    const index = applyPalette(imageData.data, palette);
    gif.writeFrame(index, width, height, {
      palette,
      delay,
      ...(frame === 0 ? { repeat: 0 } : {}),
    });

    if (frame % 4 === 0) await yieldToMain();
  }

  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}

export async function generateRasterImage(
  svgString,
  width,
  height,
  type,
  bgColor = null,
) {
  const img = await svgToImage(svgString);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (bgColor || type === "jpeg" || type === "jpg") {
    ctx.fillStyle = bgColor || "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvasToBlob(canvas, type);
}

export async function generatePaddedSocialImage(
  svgString,
  canvasW,
  canvasH,
  drawW,
  drawH,
  type,
  bgColor,
) {
  const img = await svgToImage(svgString);
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
  ctx.drawImage(img, (canvasW - drawW) / 2, (canvasH - drawH) / 2, drawW, drawH);
  return canvasToBlob(canvas, type, 0.95);
}
