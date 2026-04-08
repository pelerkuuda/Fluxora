"use client";

import { useEffect, useRef } from "react";

export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? 520;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const sparkleNoise = (x: number, y: number, layer: number) => {
      const hash = Math.sin(x * 12.9898 + y * 78.233 + layer * 37.719) * 43758.5453;
      const fract = hash - Math.floor(hash);
      const pulse = Math.sin(time * 0.9 + fract * Math.PI * 2) * 0.5 + 0.5;
      return 0.55 + pulse * 0.9;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(width * 0.5, height * 0.42, 0, width * 0.5, height * 0.42, width * 0.44);
      glow.addColorStop(0, "rgba(255,255,255,0.05)");
      glow.addColorStop(0.5, "rgba(255,199,0,0.035)");
      glow.addColorStop(1, "rgba(255,199,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const rows = 9;
      for (let layer = 0; layer < rows; layer += 1) {
        const yBase = height * 0.22 + layer * 26;
        const amplitude = 14 + layer * 2.2;
        const depthFactor = 1 - layer / rows;
        let prevPoint: { x: number; y: number } | null = null;

        for (let x = width * 0.08; x <= width * 0.92; x += 18) {
          const y =
            yBase +
            Math.sin(x * 0.011 + time * 0.8 + layer * 0.45) * amplitude +
            Math.cos(x * 0.0045 + time * 0.42 + layer) * 9;

          const normalizedX = (x - width * 0.5) / (width * 0.5);
          const revealMask = Math.max(0.18, 1 - Math.abs(normalizedX) * 0.82);
          const sparkle = sparkleNoise(x * 0.01, y * 0.01, layer);
          const alpha = (0.065 + depthFactor * 0.075) * revealMask * sparkle;
          const radius = 0.8 + depthFactor * 1.55;

          if (prevPoint) {
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.18})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(255,255,255,${alpha * 0.28})`;
          ctx.fill();
          ctx.shadowBlur = 0;

          prevPoint = { x, y };
        }
      }

      const vignette = ctx.createLinearGradient(0, 0, 0, height);
      vignette.addColorStop(0, "rgba(0,0,0,0.52)");
      vignette.addColorStop(0.24, "rgba(0,0,0,0.08)");
      vignette.addColorStop(0.78, "rgba(0,0,0,0.12)");
      vignette.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      time += 0.014;
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-90" aria-hidden="true" />;
}
