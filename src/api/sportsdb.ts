import type {
  AllLeaguesResponse,
  TeamsByLeagueResponse,
  SportsDbLeague,
  SportsDbTeam,
} from "@/types/sportsdb";

const BASE = "https://www.thesportsdb.com/api/v1/json/3";

async function fetchJson<T>(
  url: string,
  opts?: { signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: opts?.signal,
    // in Next.js App Router, fetch can cache. For now we keep it simple:
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${url}`);
  }
  return (await res.json()) as T;
}

export async function getAllLeagues(): Promise<SportsDbLeague[]> {
  const data = await fetchJson<AllLeaguesResponse>(`${BASE}/all_leagues.php`);
  // Keep only Soccer for this project (reduces noise)
  return (data.leagues ?? []).filter((l) => l.strSport === "Soccer");
}

export async function getTeamsByLeagueId(
  leagueId: string,
  opts?: { signal?: AbortSignal }
): Promise<SportsDbTeam[]> {
  const data = await fetchJson<TeamsByLeagueResponse>(
    `${BASE}/lookup_all_teams.php?id=${encodeURIComponent(leagueId)}`,
    opts
  );
  return data.teams ?? [];
}
