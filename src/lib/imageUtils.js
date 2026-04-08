function renderWaveToCanvas(width, height, { bgColor, particleRgb, time = 2.5, offsetY = 0 }) {
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
  const cameraY = -150 * s;
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
  const canvas = renderWaveToCanvas(width, height, { bgColor, particleRgb, offsetY, time });
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
