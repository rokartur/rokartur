import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html className="scroll-smooth bg-black motion-reduce:scroll-auto" lang="en">
    <head>
      <HeadContent />
    </head>
    <body className="m-0 bg-black font-mono text-[#f4f4f2] antialiased scheme-dark select-none [font-synthesis:none]">
      {children}
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      { href: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
      { href: "/apple-touch-icon.png", rel: "apple-touch-icon" },
    ],
    meta: [
      { charSet: "utf-8" },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      { title: "rokartur" },
      {
        content:
          "Independent builder creating focused macOS products, developer tools, and web apps.",
        name: "description",
      },
      { content: "#000000", name: "theme-color" },
      { content: "dark", name: "color-scheme" },
    ],
  }),
  shellComponent: RootDocument,
});
