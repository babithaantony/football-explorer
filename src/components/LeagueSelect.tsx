"use client";

import type { SportsDbLeague } from "@/types/sportsdb";

type Props = {
  leagues: SportsDbLeague[];
  value: string;
  onChange: (leagueId: string) => void;
};

export default function LeagueSelect({ leagues, value, onChange }: Props) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 600 }}>League</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
      >
        <option value="">Select a league…</option>
        {leagues.map((l) => (
          <option key={l.idLeague} value={l.idLeague}>
            {l.strLeague}
          </option>
        ))}
      </select>
    </label>
  );
}
