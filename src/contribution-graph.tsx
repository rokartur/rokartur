import {
  AnimatePresence,
  motion,
  useAnimate,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { CELL, LEVEL_OPACITY, STEP } from "./cell-grid.ts";
import calendar from "./contributions.json";
import { playHover, playPress } from "./sound.ts";

const GRID_TOP = 22;
const WIDTH = calendar.weeks.length * STEP - 3;
const HEIGHT = GRID_TOP + 7 * STEP - 3;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const GLIDE = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 } as const;
const TOOLTIP_HALF_WIDTH = 120;

type Day = (typeof calendar.weeks)[number][number];
type Cell = Day & { col: number; row: number };
type Focus =
  | { kind: "month"; key: string; label: string }
  | { kind: "level"; level: number }
  | null;
type Hover = { cell: Cell; x: number; y: number; boxX: number };

const weeks: Cell[][] = calendar.weeks.map((week, col) =>
  week.map((day) => ({ ...day, col, row: new Date(day.date).getUTCDay() })),
);
const cells = weeks.flat();
const cellsByDate = new Map(cells.map((cell) => [cell.date, cell]));
const months = monthLabels();

export function ContributionGraph() {
  const figureRef = useRef<HTMLElement>(null);
  const [svgRef, animateCells] = useAnimate<SVGSVGElement>();
  const inView = useInView(svgRef, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [hover, setHover] = useState<Hover | null>(null);
  const [focus, setFocus] = useState<Focus>(null);

  const caption = captionFor(focus);
  const counter = useSpring(0, { stiffness: 200, damping: 30 });
  const counterText = useTransform(counter, (value) => Math.round(value).toLocaleString("en"));
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) counter.jump(caption.value);
    else counter.set(caption.value);
  }, [inView, reduceMotion, caption.value, counter]);

  function showTooltip(event: PointerEvent<SVGSVGElement>) {
    const cell = cellFromTarget(event.target);
    const figure = figureRef.current;
    if (!cell || !figure || !(event.target instanceof SVGRectElement)) return;
    const box = event.target.getBoundingClientRect();
    const frame = figure.getBoundingClientRect();
    const x = box.left + box.width / 2 - frame.left;
    const boxX = Math.min(Math.max(x, TOOLTIP_HALF_WIDTH), frame.width - TOOLTIP_HALF_WIDTH);
    setHover({ cell, x, y: box.top - frame.top, boxX });
    playHover();
  }

  function hideTooltip(event: PointerEvent<SVGSVGElement>) {
    // Touch fires pointerleave right after the tap, which would close the tooltip it just opened.
    if (event.pointerType !== "touch") setHover(null);
  }

  function ripple(event: PointerEvent<SVGSVGElement>) {
    const origin = cellFromTarget(event.target);
    if (!origin) return;
    playPress();
    if (reduceMotion) return;
    void animateCells(
      "rect[data-date]",
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
    <figure ref={figureRef} className="relative flex flex-col gap-3 py-2">
      <svg
        ref={svgRef}
        className="block h-auto w-full cursor-pointer overflow-visible fill-muted-foreground text-sm"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label={`${calendar.total.toLocaleString("en")} GitHub contributions in the last year`}
        onPointerOver={showTooltip}
        onPointerLeave={hideTooltip}
        onPointerDown={ripple}
      >
        {months.map((month, index) => (
          <motion.text
            key={month.key}
            className="cursor-default fill-foreground"
            x={month.col * STEP}
            y={0}
            dominantBaseline="hanging"
            initial={{ opacity: 0, y: 4 }}
            animate={
              inView
                ? { opacity: focus?.kind === "month" && focus.key !== month.key ? 0.35 : 1, y: 0 }
                : undefined
            }
            transition={{
              opacity: { duration: 0.17, ease: EASE_OUT },
              y: { ...GLIDE, delay: index * 0.02 },
            }}
            onPointerEnter={() => setFocus({ kind: "month", key: month.key, label: month.long })}
            onPointerLeave={() => setFocus(null)}
          >
            {month.short}
          </motion.text>
        ))}
        {weeks.map((week, col) => (
          <motion.g
            key={week[0].date}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ ...GLIDE, delay: col * 0.005 }}
          >
            {week.map((cell) => (
              <motion.rect
                key={cell.date}
                className="origin-center transform-fill"
                data-date={cell.date}
                x={cell.col * STEP}
                y={GRID_TOP + cell.row * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                fillOpacity={LEVEL_OPACITY[cell.level]}
                animate={{ opacity: isDimmed(cell, focus) ? 0.15 : 1 }}
                transition={{ duration: 0.17, ease: EASE_OUT }}
              />
            ))}
          </motion.g>
        ))}
        <AnimatePresence>
          {hover && (
            <motion.rect
              key="ring"
              className="pointer-events-none fill-none stroke-foreground"
              strokeWidth={1.5}
              width={CELL + 4}
              height={CELL + 4}
              rx={4}
              initial={{ opacity: 0, scale: 0.6, ...ringPosition(hover.cell) }}
              animate={{ opacity: 1, scale: 1, ...ringPosition(hover.cell) }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.125 } }}
              transition={GLIDE}
            />
          )}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {hover && (
          <motion.div
            key="tooltip"
            className="pointer-events-none absolute top-0 left-0 z-10"
            initial={{ x: hover.boxX, y: hover.y }}
            animate={{ x: hover.boxX, y: hover.y }}
            transition={GLIDE}
          >
            <div className="-translate-x-1/2 -translate-y-full pb-2">
              <motion.div
                className="relative origin-bottom rounded-lg bg-foreground px-3 py-1.5 text-xs whitespace-nowrap text-background tabular-nums"
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4, transition: { duration: 0.125 } }}
                transition={GLIDE}
              >
                {describeDay(hover.cell)}
                <motion.svg
                  className="absolute top-full left-1/2 -ml-[5px] fill-foreground"
                  width={10}
                  height={5}
                  viewBox="0 0 10 5"
                  aria-hidden="true"
                  initial={{ x: hover.x - hover.boxX }}
                  animate={{ x: hover.x - hover.boxX }}
                  transition={GLIDE}
                >
                  <path d="M0 0h10L6 4a1.4 1.4 0 0 1-2 0z" />
                </motion.svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <figcaption className="flex items-baseline gap-1">
          <motion.span className="font-mono text-foreground tabular-nums">
            {counterText}
          </motion.span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={caption.text}
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)", transition: { duration: 0.125 } }}
              transition={{ duration: 0.17, ease: EASE_OUT }}
            >
              {caption.text}
            </motion.span>
          </AnimatePresence>
        </figcaption>
        <div className="flex items-center gap-1">
          <span className="mr-1">Less</span>
          {LEVEL_OPACITY.map((opacity, level) => (
            <motion.button
              key={level}
              type="button"
              className="grid size-4 place-items-center rounded-sm fill-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
              aria-label={
                level === 0
                  ? "Highlight days with no contributions"
                  : `Highlight level ${level} days`
              }
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.97 }}
              transition={GLIDE}
              onPointerEnter={() => {
                setFocus({ kind: "level", level });
                playHover();
              }}
              onPointerDown={playPress}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus({ kind: "level", level })}
              onBlur={() => setFocus(null)}
            >
              <svg className="size-[11px]" viewBox={`0 0 ${CELL} ${CELL}`} aria-hidden="true">
                <rect width={CELL} height={CELL} rx={2} fillOpacity={opacity} />
              </svg>
            </motion.button>
          ))}
          <span className="ml-1">More</span>
        </div>
      </div>
    </figure>
  );
}

function cellFromTarget(target: EventTarget) {
  if (!(target instanceof SVGRectElement) || !target.dataset.date) return undefined;
  return cellsByDate.get(target.dataset.date);
}

function ringPosition(cell: Cell) {
  return { x: cell.col * STEP - 2, y: GRID_TOP + cell.row * STEP - 2 };
}

function isDimmed(cell: Cell, focus: Focus) {
  if (!focus) return false;
  if (focus.kind === "month") return !cell.date.startsWith(focus.key);
  return cell.level !== focus.level;
}

function captionFor(focus: Focus) {
  if (!focus) return { value: calendar.total, text: "contributions in the last year" };
  if (focus.kind === "month") {
    const monthCells = cells.filter((cell) => cell.date.startsWith(focus.key));
    return {
      value: monthCells.reduce((sum, cell) => sum + cell.count, 0),
      text: `contributions in ${focus.label}`,
    };
  }
  const days = cells.filter((cell) => cell.level === focus.level).length;
  return {
    value: days,
    text: focus.level === 0 ? "days with no contributions" : `days at level ${focus.level} of 4`,
  };
}

function describeDay(cell: Cell) {
  const date = new Date(cell.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  if (cell.count === 0) return `No contributions on ${date}`;
  return `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${date}`;
}

function monthLabels() {
  const labels: { key: string; col: number; short: string; long: string }[] = [];
  for (const [col, week] of weeks.entries()) {
    const key = week[0].date.slice(0, 7);
    if (labels.at(-1)?.key === key) continue;
    const date = new Date(week[0].date);
    labels.push({
      key,
      col,
      short: date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
      long: date.toLocaleString("en", { month: "long", year: "numeric", timeZone: "UTC" }),
    });
  }
  // A month that starts in the last two columns of the previous label has no room for its own label.
  return labels.filter((label, index) => (labels[index + 1]?.col ?? Infinity) - label.col >= 3);
}
