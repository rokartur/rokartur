import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const query = `{user(login:"rokartur"){
  contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}
  pinnedItems(first:6,types:REPOSITORY){nodes{... on Repository{name description url homepageUrl stargazerCount}}}
}}`;
const user = JSON.parse(
  execFileSync("gh", ["api", "graphql", "-f", `query=${query}`, "--jq", ".data.user"], {
    encoding: "utf8",
  }),
);
const calendar = user.contributionsCollection.contributionCalendar;

const pinned = user.pinnedItems.nodes.map((repo) => ({
  name: repo.name,
  description: repo.description ?? "",
  url: repo.url,
  homepage: repo.homepageUrl || null,
  stars: repo.stargazerCount,
}));
writeFileSync(
  new URL("../src/pinned.json", import.meta.url),
  `${JSON.stringify(pinned, null, 2)}\n`,
);
console.log(`${pinned.length} pinned repos: ${pinned.map((repo) => repo.name).join(", ")}`);
// GitHub's own quartiles put most days at level 1, so levels come from quartiles of active days.
const active = calendar.weeks
  .flatMap((week) => week.contributionDays.map((day) => day.contributionCount))
  .filter((count) => count > 0)
  .sort((a, b) => a - b);
const cuts = [0.25, 0.5, 0.75].map((p) => active[Math.floor(p * (active.length - 1))]);
const toLevel = (count) => {
  if (count === 0) return 0;
  const index = cuts.findIndex((cut) => count <= cut);
  return index === -1 ? 4 : index + 1;
};

const weeks = calendar.weeks.map((week) =>
  week.contributionDays.map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: toLevel(day.contributionCount),
  })),
);
writeFileSync(
  new URL("../src/contributions.json", import.meta.url),
  `${JSON.stringify({ total: calendar.totalContributions, weeks }, null, 2)}\n`,
);
console.log(
  `${calendar.totalContributions} contributions, ${weeks[0][0].date} to ${weeks.at(-1).at(-1).date}`,
);
