import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export default function ScrollGravityBoxesFM() {
  const BOX_COUNT = 9;

  // Hər box üçün iki dəyər saxlayırıq: y və rotate
  const boxes = useMemo(() => {
    return Array.from({ length: BOX_COUNT }).map(() => ({
      y: useMotionValue(0),
      rotate: useMotionValue(0),
    }));
  }, []);

  // Əvvəlki scroll dəyəri
  const prevScroll = useRef(window.scrollY);

  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY;

      // Scroll fərqi: aşağı -> müsbət, yuxarı -> mənfi
      const diff = currentScroll - prevScroll.current;

      boxes.forEach((box, i) => {
        // Bir az "depth" hissi: birincilər çox, sonuncular az tərpənsin
        const factor = 0.35 - i * 0.02;

        // Hərəkət miqdarı
        const moveY = diff * factor;
        const rotate = diff * 0.03;

        // Yumşaq animasiya
        animate(box.y, box.y.get() + moveY, {
          type: "spring",
          stiffness: 140,
          damping: 22,
        });

        animate(box.rotate, box.rotate.get() + rotate, {
          type: "spring",
          stiffness: 100,
          damping: 20,
        });
      });

      prevScroll.current = currentScroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [boxes]);

  return (
    <div className="min-h-[200vh] bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:pt-24">
        <div className="relative h-[520px] sm:h-[620px] lg:h-[720px]">
          {boxes.map((box, i) => (
            <motion.div
              key={i}
              style={{ y: box.y, rotate: box.rotate }}
              className="
                absolute rounded-2xl bg-green-600 shadow-lg
                h-16 w-16
                sm:h-24 sm:w-24
                lg:h-32 lg:w-32
              "
            />
          ))}

          {/* ✅ Telefon layout (2 sütun) */}
          <div className="sm:hidden">
            {boxes.map((box, i) => (
              <motion.div
                key={`m-${i}`}
                style={{
                  y: box.y,
                  rotate: box.rotate,
                  left: `${10 + (i % 2) * 50}%`,
                  top: `${10 + Math.floor(i / 2) * 22}%`,
                }}
                className="absolute h-16 w-16 -translate-x-1/2 rounded-2xl bg-green-600 shadow-lg"
              />
            ))}
          </div>

          {/* ✅ Tablet layout (3 sütun) */}
          <div className="hidden sm:block lg:hidden">
            {boxes.map((box, i) => (
              <motion.div
                key={`t-${i}`}
                style={{
                  y: box.y,
                  rotate: box.rotate,
                  left: `${12 + (i % 3) * 32}%`,
                  top: `${10 + Math.floor(i / 3) * 24}%`,
                }}
                className="absolute h-24 w-24 -translate-x-1/2 rounded-2xl bg-green-600 shadow-lg"
              />
            ))}
          </div>

          {/* ✅ Desktop layout (4 sütun) */}
          <div className="hidden lg:block">
            {boxes.map((box, i) => (
              <motion.div
                key={`d-${i}`}
                style={{
                  y: box.y,
                  rotate: box.rotate,
                  left: `${15 + (i % 4) * 22}%`,
                  top: `${10 + Math.floor(i / 4) * 28}%`,
                }}
                className="absolute h-32 w-32 -translate-x-1/2 rounded-2xl bg-green-600 shadow-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
