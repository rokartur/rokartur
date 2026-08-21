import { createFileRoute } from "@tanstack/react-router";
import {
  domAnimation,
  LazyMotion,
  m,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const signatureStrokes = [
  {
    d: "M 5 114 C 34 81 115 34 164 27 C 181 25 187 34 181 47 C 168 73 119 109 73 134",
    delay: 0.08,
    duration: 0.32,
    width: 18,
  },
  {
    d: "M 99 82 C 86 108 69 132 51 153 C 34 173 20 186 12 190",
    delay: 0.24,
    duration: 0.22,
    width: 18,
  },
  {
    d: "M 73 134 C 88 138 103 149 118 152",
    delay: 0.39,
    duration: 0.14,
    width: 18,
  },
  {
    d: "M 135 117 C 126 114 118 126 119 136 C 124 143 136 135 140 126 C 139 120 135 117 130 122",
    delay: 0.48,
    duration: 0.16,
    width: 16,
  },
  {
    d: "M 174 81 C 165 100 154 121 147 132 M 157 122 C 166 113 174 105 176 107 C 174 114 165 120 157 123 C 162 127 168 126 173 124",
    delay: 0.58,
    duration: 0.18,
    width: 26,
  },
  {
    d: "M 184 144 C 222 116 270 66 304 5 C 295 42 284 89 275 129",
    delay: 0.68,
    duration: 0.32,
    width: 38,
  },
  {
    d: "M 198 114 C 235 107 275 97 313 88",
    delay: 0.83,
    duration: 0.15,
    width: 18,
  },
  {
    d: "M 302 109 C 310 97 318 87 324 86 C 329 88 327 94 331 94 C 337 94 345 86 352 80 C 358 75 364 70 368 68 M 353 94 C 360 80 364 72 368 67 M 369 92 C 375 88 382 80 378 77 C 374 76 368 88 370 93 C 374 98 383 89 390 78 C 387 86 386 90 389 90 C 395 89 404 78 413 69 C 414 75 409 85 407 89 C 415 77 424 68 431 67",
    delay: 0.9,
    duration: 0.28,
    width: 17,
  },
  {
    d: "M 371 52 L 381 38",
    delay: 1.1,
    duration: 0.1,
    width: 14,
  },
  {
    d: "M 352 66 C 414 57 515 30 633 8",
    delay: 1.14,
    duration: 0.32,
    width: 16,
  },
] as const;

const projects = [
  {
    href: "https://bettercmdtab.app",
    kind: "Master your Mac’s ⌘Tab",
    name: "BetterCmdTab",
  },
  {
    href: "https://betteraudio.pro",
    kind: "Master your Mac’s audio",
    name: "BetterAudio",
  },
  {
    href: "https://usagefleet.com",
    kind: "One subscription, many machines",
    name: "usagefleet",
  },
  {
    href: "https://github.com/rokartur/vexdock",
    kind: "Self-hosted Vercel alternative",
    name: "vexdock",
  },
];

const Home = () => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const duration = prefersReducedMotion ? 0.16 : 0.28;
  const contentDelay = prefersReducedMotion ? 0 : 1.18;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <main className="ml-[clamp(2rem,6vw,5.75rem)] w-[min(calc(100%-4rem),45rem)] pt-15.5 pb-27.5 max-[42.5rem]:ml-5 max-[42.5rem]:w-[calc(100%-2.5rem)] max-[42.5rem]:pt-11.5">
          <header className="mb-18">
            <h1 className="sr-only">Artur Rok</h1>
            <svg
              aria-hidden="true"
              className="mb-6 -ml-2.5 block aspect-638/195 w-[min(23.125rem,82vw)]"
              viewBox="0 0 638 195"
            >
              <defs>
                <mask
                  className="mask-type-alpha"
                  height="195"
                  id="signature-shape"
                  maskUnits="userSpaceOnUse"
                  width="638"
                  x="0"
                  y="0"
                >
                  <image height="195" href="/signature.svg" width="638" />
                </mask>
                <mask
                  height="195"
                  id="signature-write"
                  maskUnits="userSpaceOnUse"
                  width="638"
                  x="0"
                  y="0"
                >
                  <g mask="url(#signature-shape)">
                    {signatureStrokes.map((stroke) => (
                      <m.path
                        animate={{ opacity: 1, strokeDashoffset: 0 }}
                        d={stroke.d}
                        fill="none"
                        initial={{
                          opacity: 0,
                          strokeDashoffset: prefersReducedMotion ? 0 : 1,
                        }}
                        key={stroke.d}
                        pathLength={1}
                        stroke="white"
                        strokeDasharray="1 1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={stroke.width}
                        transition={{
                          opacity: {
                            delay: prefersReducedMotion ? 0 : stroke.delay,
                            duration: prefersReducedMotion ? 0.16 : 0.01,
                            ease: easeOut,
                          },
                          strokeDashoffset: {
                            delay: prefersReducedMotion ? 0 : stroke.delay,
                            duration: prefersReducedMotion
                              ? 0
                              : stroke.duration,
                            ease: easeInOut,
                          },
                        }}
                      />
                    ))}
                  </g>
                </mask>
              </defs>
              <rect
                fill="#e9e4da"
                height="195"
                mask="url(#signature-write)"
                width="638"
              />
            </svg>
            <m.p
              animate={{ opacity: 1, transform: "translateY(0)" }}
              className="mb-0 max-w-147.5 text-[0.9375rem] leading-[1.75] text-pretty text-[#999995]"
              initial={{ opacity: 0, transform: "translateY(6px)" }}
              transition={{
                delay: contentDelay,
                duration,
                ease: easeOut,
              }}
            >
              keep things useful and simple
            </m.p>
            <m.nav
              animate={{ opacity: 1, transform: "translateY(0)" }}
              aria-label="Social links"
              className="mt-1.5 flex gap-4 text-[0.9375rem] text-[#999995]"
              initial={{ opacity: 0, transform: "translateY(6px)" }}
              transition={{
                delay: contentDelay + 0.08,
                duration,
                ease: easeOut,
              }}
            >
              <a
                className="flex min-h-11 text-center items-center text-[0.9375rem] no-underline underline-offset-4 transition-colors duration-150 hover:text-[#f4f4f2]"
                href="https://github.com/rokartur"
                rel="noopener noreferrer"
                target="_blank"
              >
                gh
              </a>
              <a
                className="flex min-h-11 text-center items-center text-[0.9375rem] no-underline underline-offset-4 transition-colors duration-150 hover:text-[#f4f4f2]"
                href="https://x.com/rokartur_"
                rel="noopener noreferrer"
                target="_blank"
              >
                x
              </a>
              <a
                className="flex min-h-11 text-center items-center text-[0.9375rem] no-underline underline-offset-4 transition-colors duration-150 hover:text-[#f4f4f2]"
                href="https://linkedin.com/in/rokartur/en"
                rel="noopener noreferrer"
                target="_blank"
              >
                ld
              </a>
            </m.nav>
          </header>

          <section
            className="scroll-mt-8"
            id="work"
            aria-labelledby="projects"
            aria-label="projects"
          >
            <m.header
              className="mb-5"
              initial={{ opacity: 0, transform: "translateY(8px)" }}
              transition={{
                delay: contentDelay + 0.16,
                duration,
                ease: easeOut,
              }}
              viewport={{ margin: "-64px", once: true }}
              whileInView={{ opacity: 1, transform: "translateY(0)" }}
            >
              <h2
                className="m-0 hidden text-base font-normal text-balance text-[#60605c]"
                id="work-title"
              >
                projects
              </h2>
            </m.header>
            <ol className="m-0 grid w-full max-w-md list-none p-0">
              {projects.map((project, index) => (
                <m.li
                  initial={{
                    opacity: 0,
                    transform: prefersReducedMotion
                      ? "translateY(0)"
                      : "translateY(8px)",
                  }}
                  key={project.name}
                  transition={{
                    delay:
                      contentDelay +
                      (prefersReducedMotion ? 0 : 0.16 + (index + 1) * 0.045),
                    duration,
                    ease: easeOut,
                  }}
                  viewport={{ margin: "-48px", once: true }}
                  whileInView={{
                    opacity: 1,
                    transform: "translateY(0)",
                  }}
                >
                  <a
                    className="group flex min-h-12 items-baseline gap-3 no-underline underline-offset-4"
                    href={project.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <h3 className="m-0 shrink-0 text-base font-medium tracking-[-0.02em] text-balance group-hover:underline">
                      {project.name}
                    </h3>
                    <span className="text-xs text-[#999995]">
                      {project.kind}
                    </span>
                  </a>
                </m.li>
              ))}
            </ol>
          </section>
        </main>
      </LazyMotion>
    </MotionConfig>
  );
};

export const Route = createFileRoute("/")({ component: Home });
