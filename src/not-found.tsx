import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CELL, LEVEL_OPACITY, STEP } from "./cell-grid.ts";
import { playHover, playPress } from "./sound.ts";

const BITMAP = [
  "...............",
  "..#.#.###.#.#..",
  "..#.#.#.#.#.#..",
  "..###.#.#.###..",
  "....#.#.#...#..",
  "....#.###...#..",
  "...............",
];
const WIDTH = BITMAP[0].length * STEP - 3;
const HEIGHT = BITMAP.length * STEP - 3;
const NOISE_LEVELS = [0, 0, 0, 1, 2];
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const GLIDE = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 } as const;

type Cell = { col: number; row: number; level: number };

const cells: Cell[] = BITMAP.flatMap((line, row) =>
  line.split("").map((pixel, col) => ({
    col,
    row,
    level: pixel === "#" ? 4 : NOISE_LEVELS[Math.floor(Math.random() * NOISE_LEVELS.length)],
  })),
);

export function NotFound() {
  const [svgRef, animateCells] = useAnimate<SVGSVGElement>();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<Cell | null>(null);

  function ripple(origin: Cell) {
    playPress();
    if (reduceMotion) return;
    void animateCells(
      "rect[data-cell]",
      { scale: [1, 1.7, 1] },
      {
        duration: 0.55,
        ease: EASE_OUT,
        delay: (index) =>
          Math.hypot(cells[index].col - origin.col, cells[index].row - origin.row) * 0.028,
      },
    );
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <svg
          ref={svgRef}
          className="block h-auto w-80 max-w-full cursor-pointer overflow-visible fill-foreground"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={WIDTH}
          height={HEIGHT}
          role="img"
          aria-label="404"
          onPointerLeave={() => setHovered(null)}
        >
          {cells.map((cell) => (
            <motion.rect
              key={`${cell.col}-${cell.row}`}
              data-cell
              className="origin-center transform-fill"
              x={cell.col * STEP}
              y={cell.row * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              fillOpacity={LEVEL_OPACITY[cell.level]}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.34, ease: EASE_OUT, delay: (cell.col + cell.row) * 0.012 }}
              onPointerEnter={() => {
                setHovered(cell);
                playHover();
              }}
              onPointerDown={() => ripple(cell)}
            />
          ))}
          <AnimatePresence>
            {hovered && (
              <motion.rect
                key="ring"
                className="pointer-events-none fill-none stroke-foreground"
                strokeWidth={1.5}
                width={CELL + 4}
                height={CELL + 4}
                rx={4}
                initial={{ opacity: 0, scale: 0.6, ...ringPosition(hovered) }}
                animate={{ opacity: 1, scale: 1, ...ringPosition(hovered) }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.125 } }}
                transition={GLIDE}
              />
            )}
          </AnimatePresence>
        </svg>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.34, ease: EASE_OUT, delay: 0.2 }}
        >
          <p className="max-w-xs text-sm text-muted-foreground">
            <span className="font-mono text-foreground tabular-nums">0</span> contributions on{" "}
            <span className="font-mono break-all">{location.pathname}</span>
          </p>
          <motion.a
            href="/"
            className="inline-flex h-8 items-center rounded-lg bg-muted px-3 text-sm font-medium transition-colors hover:bg-muted/70"
            whileTap={{ scale: 0.97 }}
            onPointerEnter={playHover}
            onPointerDown={playPress}
          >
            Back home
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}

function ringPosition(cell: Cell) {
  return { x: cell.col * STEP - 2, y: cell.row * STEP - 2 };
}
