import { AnimatePresence, LayoutGroup, motion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { ContributionGraph } from "./contribution-graph.tsx";
import pinned from "./pinned.json";
import { Signature } from "./signature.tsx";
import { playHover, playPress } from "./sound.ts";

const EASE_ENTER = [0.16, 1, 0.3, 1] as const;
const GLIDE = { type: "spring", visualDuration: 0.28, bounce: 0 } as const;
const PRESS = { scale: 0.97 } as const;

const page: Variants = { show: { transition: { staggerChildren: 0.055 } } };
const block: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.34, ease: EASE_ENTER } },
};

const socials = [
  { label: "GitHub", href: "https://github.com/rokartur", icon: <GitHubIcon /> },
  { label: "X", href: "https://x.com/rokartur_", icon: <XIcon /> },
  { label: "LinkedIn", href: "https://linkedin.com/in/rokartur/en", icon: <LinkedInIcon /> },
];

export function App() {
  return (
    <motion.main
      className="mx-auto max-w-2xl px-4 pb-16"
      initial="hidden"
      animate="show"
      variants={page}
    >
      <motion.header
        variants={block}
        className="flex items-center justify-between border-b border-border py-4"
      >
        <div className="flex items-center gap-x-4">
          <img
            src="/avatar.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full ring-1 ring-border grayscale"
          />
          <div>
            <h1 className="text-sm font-medium">Artur Rok</h1>
            <p className="text-xs text-muted-foreground">Independent builder, Katowice</p>
          </div>
        </div>
        <LocalTime />
      </motion.header>

      <motion.section variants={block} className="mt-8 space-y-4">
        <p className="text-sm text-balance">
          I build small, focused software. Mostly <Code>macOS apps</Code> that fix one thing the
          system gets wrong, and <Code>developer tools</Code> I wanted for myself.
          <br />
          <br />
          Almost mastered TypeScript, learning something new every week. Not a fan of Next.js.
        </p>
        <Signature delay={0.4} />
        <nav aria-label="Social links" className="flex flex-wrap items-center gap-2">
          {socials.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-muted px-3 text-sm font-medium transition-colors hover:bg-muted/70"
              whileTap={PRESS}
              onPointerEnter={playHover}
              onPointerDown={playPress}
            >
              {social.icon}
              {social.label}
            </motion.a>
          ))}
        </nav>
      </motion.section>

      <motion.section variants={block} aria-label="GitHub contributions" className="mt-12">
        <ContributionGraph />
      </motion.section>

      <motion.section variants={block} aria-label="Projects" className="mt-12">
        <ProjectList />
      </motion.section>
    </motion.main>
  );
}

function ProjectList() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <LayoutGroup>
      <ul className="flex flex-col gap-4" onPointerLeave={() => setHovered(null)}>
        {pinned.map((project) => (
          <li
            key={project.name}
            className="relative isolate flex items-center gap-4 rounded-lg border border-border px-4 py-3 text-sm"
            onPointerEnter={() => {
              setHovered(project.name);
              playHover();
            }}
          >
            {hovered === project.name && (
              <motion.span
                layoutId="project-highlight"
                className="absolute inset-0 -z-10 rounded-lg bg-muted/50"
                transition={GLIDE}
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="leading-snug font-medium">{project.name}</h2>
              <p className="line-clamp-2 text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on GitHub, ${project.stars} stars`}
                className="inline-flex h-7 items-center gap-1 rounded-lg bg-muted px-2 transition-colors hover:bg-muted/70"
                whileTap={PRESS}
                onPointerDown={playPress}
              >
                <span className="font-mono text-xs tabular-nums">{project.stars}</span>
                <GitHubIcon />
              </motion.a>
              {project.homepage && (
                <motion.a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} website`}
                  className="group inline-flex size-7 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-muted/70"
                  whileTap={PRESS}
                  onPointerDown={playPress}
                >
                  <ArrowIcon />
                </motion.a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </LayoutGroup>
  );
}

const warsawTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = warsawTime.formatToParts(now);
  const time = parts
    .filter((part) => part.type !== "timeZoneName" && part.type !== "literal")
    .map((part) => part.value)
    .join(":");
  const zone = parts.find((part) => part.type === "timeZoneName")?.value;

  return (
    <p
      aria-label={`Local time in Katowice: ${time} ${zone}`}
      className="flex items-baseline gap-1.5 font-mono text-xs text-muted-foreground tabular-nums"
    >
      <span aria-hidden="true" className="flex overflow-hidden text-foreground">
        {time.split("").map((char, index) => (
          <AnimatePresence key={index} mode="popLayout" initial={false}>
            <motion.span
              key={char}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={GLIDE}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        ))}
      </span>
      <span aria-hidden="true">{zone}</span>
    </p>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.8125rem]">{children}</span>
  );
}

function GitHubIcon() {
  return (
    <svg className="size-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="size-4 fill-none stroke-current transition-transform duration-170 ease-out group-hover:translate-x-px group-hover:-translate-y-px"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
