export type SportsDbLeague = {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string | null;
};

export type SportsDbTeam = {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string | null;
  strStadium?: string | null;
  strCountry?: string | null;
  intFormedYear?: string | null;
  strStadiumThumb?: string | null;
};

export type AllLeaguesResponse = {
  leagues: SportsDbLeague[];
};

export type TeamsByLeagueResponse = {
  teams: SportsDbTeam[] | null;
};
