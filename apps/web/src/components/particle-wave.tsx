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

    const getWavePoint = (x: number, y: number, layer: number) => {
      const nx = x / width;
      const ny = y / height;

      const waveA = Math.sin(nx * 9.5 + time * 0.9 + layer * 0.45) * 28;
      const waveB = Math.cos(nx * 4.2 - time * 0.55 + ny * 3.5) * 18;
      const waveC = Math.sin(ny * 7.8 + time * 0.4 + layer) * 14;

      return {
        x: x + Math.sin(ny * 4 + time * 0.3 + layer) * 10,
        y: y + waveA + waveB + waveC,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.48);
      gradient.addColorStop(0, "rgba(255,255,255,0.035)");
      gradient.addColorStop(0.45, "rgba(255,255,255,0.012)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const layers = 3;
      for (let layer = 0; layer < layers; layer += 1) {
        const yStart = height * (0.14 + layer * 0.1);
        const yEnd = height * (0.72 + layer * 0.05);
        const yStep = 15;
        const xStep = 14;

        for (let y = yStart; y <= yEnd; y += yStep) {
          let prevPoint: { x: number; y: number } | null = null;

          for (let x = width * -0.05; x <= width * 1.05; x += xStep) {
            const point = getWavePoint(x, y, layer);
            const depth = 1 - Math.abs(point.y - height * 0.48) / (height * 0.55);
            const alpha = Math.max(0.04, depth * (0.18 - layer * 0.028));
            const radius = Math.max(0.7, 1.8 * depth);

            if (prevPoint) {
              ctx.beginPath();
              ctx.moveTo(prevPoint.x, prevPoint.y);
              ctx.lineTo(point.x, point.y);
              ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.22})`;
              ctx.lineWidth = 0.55;
              ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(255,255,255,0.08)";
            ctx.fill();
            ctx.shadowBlur = 0;

            prevPoint = point;
          }
        }
      }

      const vignette = ctx.createLinearGradient(0, 0, 0, height);
      vignette.addColorStop(0, "rgba(0,0,0,0.65)");
      vignette.addColorStop(0.2, "rgba(0,0,0,0.15)");
      vignette.addColorStop(0.8, "rgba(0,0,0,0.1)");
      vignette.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      time += 0.016;
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

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-95" aria-hidden="true" />;
}
