"use client";

import type { SportsDbTeam } from "@/types/sportsdb";

type Props = {
  teams: SportsDbTeam[];
};

export default function TeamList({ teams }: Props) {
  if (teams.length === 0) {
    return <p style={{ opacity: 0.8 }}>No teams found.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {teams.map((t) => (
        <div
          key={t.idTeam}
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr",
            gap: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #e5e5e5",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: "1px solid #eee",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              background: "#fafafa",
            }}
          >
            {t.strTeamBadge ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.strTeamBadge}
                alt={`${t.strTeam} badge`}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: 12, opacity: 0.7 }}>N/A</span>
            )}
          </div>

          <div style={{ display: "grid", gap: 2 }}>
            <div style={{ fontWeight: 700 }}>{t.strTeam}</div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              {t.strCountry ?? "—"} • Stadium: {t.strStadium ?? "—"} • Founded:{" "}
              {t.intFormedYear ?? "—"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
