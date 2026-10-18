import { motion } from "motion/react";

const EASE_WRITE = [0.77, 0, 0.175, 1] as const;

// Strokes trace the scanned signature in pen order; seconds come from the original CSS keyframes.
const strokes = [
  {
    width: 18,
    delay: 0.08,
    duration: 0.32,
    d: "M 5 114 C 34 81 115 34 164 27 C 181 25 187 34 181 47 C 168 73 119 109 73 134",
  },
  {
    width: 18,
    delay: 0.24,
    duration: 0.22,
    d: "M 99 82 C 86 108 69 132 51 153 C 34 173 20 186 12 190",
  },
  { width: 18, delay: 0.39, duration: 0.14, d: "M 73 134 C 88 138 103 149 118 152" },
  {
    width: 16,
    delay: 0.48,
    duration: 0.16,
    d: "M 135 117 C 126 114 118 126 119 136 C 124 143 136 135 140 126 C 139 120 135 117 130 122",
  },
  {
    width: 26,
    delay: 0.58,
    duration: 0.18,
    d: "M 174 81 C 165 100 154 121 147 132 M 157 122 C 166 113 174 105 176 107 C 174 114 165 120 157 123 C 162 127 168 126 173 124",
  },
  {
    width: 38,
    delay: 0.68,
    duration: 0.32,
    d: "M 184 144 C 222 116 270 66 304 5 C 295 42 284 89 275 129",
  },
  { width: 18, delay: 0.83, duration: 0.15, d: "M 198 114 C 235 107 275 97 313 88" },
  {
    width: 17,
    delay: 0.9,
    duration: 0.28,
    d: "M 302 109 C 310 97 318 87 324 86 C 329 88 327 94 331 94 C 337 94 345 86 352 80 C 358 75 364 70 368 68 M 353 94 C 360 80 364 72 368 67 M 369 92 C 375 88 382 80 378 77 C 374 76 368 88 370 93 C 374 98 383 89 390 78 C 387 86 386 90 389 90 C 395 89 404 78 413 69 C 414 75 409 85 407 89 C 415 77 424 68 431 67",
  },
  { width: 14, delay: 1.1, duration: 0.1, d: "M 371 52 L 381 38" },
  { width: 16, delay: 1.14, duration: 0.32, d: "M 352 66 C 414 57 515 30 633 8" },
];

export function Signature({ delay }: { delay: number }) {
  return (
    <svg className="h-auto w-40" viewBox="0 0 638 195" aria-hidden="true">
      <defs>
        <mask
          id="signature-shape"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="638"
          height="195"
          style={{ maskType: "alpha" }}
        >
          <image href="/signature.svg" width="638" height="195" />
        </mask>
        <mask id="signature-write" maskUnits="userSpaceOnUse" x="0" y="0" width="638" height="195">
          <g mask="url(#signature-shape)">
            {strokes.map((stroke) => (
              <motion.path
                key={stroke.d}
                d={stroke.d}
                fill="none"
                stroke="#fff"
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    delay: delay + stroke.delay,
                    duration: stroke.duration,
                    ease: EASE_WRITE,
                  },
                  opacity: { delay: delay + stroke.delay, duration: 0.01 },
                }}
              />
            ))}
          </g>
        </mask>
      </defs>
      <rect width="638" height="195" className="fill-foreground" mask="url(#signature-write)" />
    </svg>
  );
}
