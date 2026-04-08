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

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let row = 0; row < 8; row += 1) {
        const yBase = height * 0.22 + row * 34;
        const amplitude = 18 + row * 2.5;
        const alpha = 0.035 + row * 0.012;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.012 + time * 0.9 + row * 0.55) * amplitude +
            Math.cos(x * 0.006 + time * 0.45 + row) * 8;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let x = 0; x <= width; x += 42) {
          const y =
            yBase +
            Math.sin(x * 0.012 + time * 0.9 + row * 0.55) * amplitude +
            Math.cos(x * 0.006 + time * 0.45 + row) * 8;

          const glow = row % 2 === 0 ? "255, 199, 0" : "255, 255, 255";
          ctx.beginPath();
          ctx.arc(x, y, row % 3 === 0 ? 1.8 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${glow}, ${0.16 + row * 0.02})`;
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgba(255, 199, 0, 0.18)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.42, 10, width * 0.5, height * 0.42, width * 0.46);
      gradient.addColorStop(0, "rgba(255, 199, 0, 0.08)");
      gradient.addColorStop(1, "rgba(255, 199, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.015;
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
