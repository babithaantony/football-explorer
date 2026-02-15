import { useEffect, useState, useRef, useCallback } from "react";
import { SportsDbLeague, SportsDbTeam } from '../types/sportsdb';
import { getAllLeagues, getTeamsByLeagueId } from "@/api/sportsdb";

type LoadState = "idle" | "loading" | "success" | "error" | false | true;

const cache = new Map<string, SportsDbTeam[]>();


type UseTeamReturnType = {
    leagues: SportsDbLeague[] | [],
    teams: SportsDbTeam[] | [],
    loadState: LoadState,
    errorMsg: string,
    reFetch: () => void;
}

export const useTemas = (leagueId: string): UseTeamReturnType => {

    const [teams, setTeams] = useState<SportsDbTeam[]>([]);
    const [leagues, setLeagues] = useState<SportsDbLeague[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("idle");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const abortRef = useRef<AbortController | null>(null);
    

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getAllLeagues();
                if (cancelled) return;
                setLeagues(data);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => {
            cancelled = true;
        };
        
    }, []);

    const load = useCallback(async (force: boolean) => {
            if (!leagueId) {
                setTeams([]);
                setLoadState("idle");
                setErrorMsg("");
                return;
            }

            if (!force) {
                const cached = cache.get(leagueId);
                if (cached) {
                    setTeams(cached);
                    setLoadState(false);
                    setErrorMsg("");
                return;
                }
            }

            abortRef.current?.abort();
            const ac = new AbortController();
            abortRef.current = ac;

            setLoadState("loading");
            setErrorMsg("");

             try {
                const data = await getTeamsByLeagueId(leagueId, { signal: ac.signal });
                setTeams(data);
                cache.set(leagueId, data);
                setLoadState("success");
            } catch (e: unknown) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setLoadState("error");
                setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
            }
        
        }, [leagueId])

     useEffect(() => {
        void load(false);
        return () => abortRef.current?.abort();
    }, [load]);

    const reFetch = useCallback(() => {
        void load(true);
    }, [load])

    return {
    leagues,
    teams,
    loadState,
    errorMsg,
    reFetch
  };

}