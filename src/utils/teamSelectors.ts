import type { SportsDbTeam } from "@/types/sportsdb";

export type SortKey = "name" | "formedYear" | "stadium";
export type SortDir = "asc" | "desc";

export function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function filterByQuery(teams: SportsDbTeam[], query: string) {
  const q = normalize(query);
  if (!q) return teams;
  return teams.filter((t) => normalize(t.strTeam).includes(q));
}

export function sortTeams(teams: SportsDbTeam[], key: SortKey, dir: SortDir) {
  const copy = [...teams];

  copy.sort((a, b) => {
    const av =
      key === "name"
        ? a.strTeam
        : key === "stadium"
        ? a.strStadium ?? ""
        : Number(a.intFormedYear ?? 0);

    const bv =
      key === "name"
        ? b.strTeam
        : key === "stadium"
        ? b.strStadium ?? ""
        : Number(b.intFormedYear ?? 0);

    // string compare
    if (typeof av === "string" && typeof bv === "string") {
      const cmp = av.localeCompare(bv);
      return dir === "asc" ? cmp : -cmp;
    }

    // number compare
    const cmp = (av as number) - (bv as number);
    return dir === "asc" ? cmp : -cmp;
  });

  return copy;
}
