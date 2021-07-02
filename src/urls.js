const PROTOCOL = 'https';
const HOST = 'api.football-data.org';
const API_VERSION = 'v2';

const PLAN = 'TIER_ONE';
const AREAS = '2077';

const BASE = `${PROTOCOL}://${HOST}/${API_VERSION}`;

// При формировании адреса для запроса лиг учитываем, что будем работать только с европейскими лигами с использованием бесплатного api
export function getCompetitionsUrl() {
    return `${BASE}/competitions/?areas=${AREAS}&plan=${PLAN}`;
}

export function getTeamsUrl(competitionId, season) {
    let url = `${BASE}/competitions/${competitionId}/teams`;
    if (season) url += `/?season=${season}`;
    return url;
}

export function getCompetitionCalendarUrl(competitionId, season, dateFrom, dateTo) {
    let url = `${BASE}/competitions/${competitionId}/matches`;
    if (season || (dateFrom && dateTo)) {
        let params = new URLSearchParams();
        if (season) params.append('season', season);
        if (dateFrom || dateTo) {
            params.append('dateFrom', dateFrom);
            params.append('dateTo', dateTo);
        }
        url += `/?${params.toString()}`;
    }
    return url;
}

export function getTeamCalendarUrl(teamId, dateFrom, dateTo) {
    let url = `${BASE}/teams/${teamId}/matches`;
    if (dateFrom || dateTo) {
        let params = new URLSearchParams();
        params.append('dateFrom', dateFrom);
        params.append('dateTo', dateTo);
        url += `/?${params.toString()}`;
    }
    return url;
}

export function getCompetitionUrl(competitionId) {
    return `${BASE}/competitions/${competitionId}`;
}

export function getTeamUrl(teamId) {
    return `${BASE}/teams/${teamId}`;
}
