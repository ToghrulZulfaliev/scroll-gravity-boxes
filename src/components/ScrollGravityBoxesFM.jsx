import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function ScrollGravityBoxesFM() {
  const BOX_COUNT = 9;

  // hər box üçün state
  const boxes = useMemo(() => {
    return Array.from({ length: BOX_COUNT }).map((_, i) => ({
      y: useMotionValue(0),
      rotate: useMotionValue(Math.random() * 20 - 10), // -10 .. +10
      factor: 1 - i * 0.07, // dərinlik hissi
    }));
  }, []);

  const last = useRef({
    y: window.scrollY,
    t: performance.now(),
  });

  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;

      raf.current = requestAnimationFrame(() => {
        raf.current = 0;

        const nowY = window.scrollY;
        const nowT = performance.now();

        const dy = nowY - last.current.y;
        const dt = Math.max(1, nowT - last.current.t);

        const speed = dy / dt;
        const intensity = clamp(Math.abs(speed) * 45, 0, 2);
        const dir = dy >= 0 ? 1 : -1;

        boxes.forEach((box, i) => {
          const offset = intensity * 50 * (-dir) * box.factor;

          animate(box.y, box.y.get() + offset, {
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1,
          });

          animate(box.rotate, box.rotate.get() + offset * 0.15, {
            type: "spring",
            stiffness: 80,
            damping: 18,
          });
        });

        last.current.y = nowY;
        last.current.t = nowT;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [boxes]);

  return (
    <div className="min-h-[200vh] bg-white">
      <div className="relative mx-auto max-w-6xl pt-24">
        <div className="relative h-[700px]">
          {boxes.map((box, i) => (
            <motion.div
              key={i}
              style={{
                y: box.y,
                rotate: box.rotate,
                left: `${15 + (i % 4) * 20}%`,
                top: `${10 + Math.floor(i / 4) * 28}%`,
              }}
              className="absolute h-32 w-32 rounded-xl bg-green-600 shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
