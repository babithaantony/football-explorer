import { useEffect, useState, useRef } from "react";
import { SportsDbLeague, SportsDbTeam } from '../types/sportsdb';
import { getAllLeagues, getTeamsByLeagueId } from "@/api/sportsdb";

type LoadState = "idle" | "loading" | "success" | "error";


type UseTeamReturnType = {
    leagues: SportsDbLeague[] | [],
    teams: SportsDbTeam[] | [],
    loadState: LoadState,
    errorMsg: string,
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

    useEffect(() => {
        if (!leagueId) {
        setTeams([]);
        setLoadState("idle");
        setErrorMsg("");
        return;
        }

        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        setLoadState("loading");
        setErrorMsg("");

        (async () => {
        try {
            const data = await getTeamsByLeagueId(leagueId, { signal: ac.signal });
            setTeams(data);
            setLoadState("success");
        } catch (e: unknown) {
            if (e instanceof DOMException && e.name === "AbortError") return;
            setLoadState("error");
            setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
        }
        })();

        return () => {
        ac.abort();
        };
    }, [leagueId]);


    return {
    leagues,
    teams,
    loadState,
    errorMsg
  };

}