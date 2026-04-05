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
