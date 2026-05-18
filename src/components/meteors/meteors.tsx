import { useEffect, useRef } from "react";
import "./meteors.css";

type Meteor = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
};

export const Meteors = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let meteors: Meteor[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createMeteor = (): Meteor => {
      return {
        x: -20,
        y: Math.random() * canvas.height,
        radius: Math.random() + 0.6,
        speed: Math.random() + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
      };
    };

    const populateInitialMeteors = () => {
      const amount = Math.max(
        30,
        Math.floor((canvas.width * canvas.height) / 80000),
      );

      meteors = Array.from({ length: amount }, () => ({
        ...createMeteor(),
        x: Math.random() * canvas.width,
      }));
    };

    const drawMeteor = (meteor: Meteor) => {
      if (!ctx) return;

      // cola horizontal
      const tailLength = meteor.radius * 25;

      const gradient = ctx.createLinearGradient(
        meteor.x - tailLength,
        meteor.y,
        meteor.x,
        meteor.y,
      );

      gradient.addColorStop(0, `rgba(140, 141, 143, 0)`);
      gradient.addColorStop(1, `rgba(140, 141, 143, ${meteor.opacity})`);

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = meteor.radius * 2;
      ctx.moveTo(meteor.x - tailLength, meteor.y);
      ctx.lineTo(meteor.x, meteor.y);
      ctx.stroke();

      // núcleo
      ctx.beginPath();
      ctx.fillStyle = `rgb(140, 141, 143)`;
      ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      meteors.forEach((meteor, index) => {
        meteor.x += meteor.speed;

        drawMeteor(meteor);

        if (meteor.x - meteor.radius > canvas.width) {
          meteors[index] = createMeteor();
        }
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    resize();
    populateInitialMeteors();
    animate();

    window.addEventListener("resize", () => {
      resize();
      populateInitialMeteors();
    });

    return () => {
      cancelAnimationFrame(animationFrame.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
