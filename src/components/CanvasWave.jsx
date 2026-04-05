import { useEffect, useRef } from "react";

const SPACING = 45;
const ROWS = 40;
const COLS = 80;
const FOV = 400;
const CAMERA_Z = 250;
const CAMERA_Y = -150;
const MOUSE_MAX_DIST = 350;

export default function CanvasWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles = [];
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        particles.push({
          x: (i - COLS / 2) * SPACING,
          z: (j - ROWS / 2) * SPACING,
          y: 0,
        });
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

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      particles.forEach((p) => {
        const baseY =
          Math.sin(p.x * 0.003 + time * 0.6) * 30 +
          Math.sin(p.z * 0.004 + time * 0.5) * 30;
        const dist = Math.sqrt(
          Math.pow(p.x - mouseX, 2) + Math.pow(p.z - mouseY, 2),
        );

        let mouseDisplacement = 0;
        if (dist < MOUSE_MAX_DIST) {
          mouseDisplacement = -50 * Math.pow(1 - dist / MOUSE_MAX_DIST, 2.8);
        }

        p.y = baseY + mouseDisplacement;

        const dx = p.x;
        const dy = p.y - CAMERA_Y;
        const dz = p.z + CAMERA_Z;

        if (dz > 0) {
          const scale = FOV / dz;
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none no-print"
    />
  );
}
