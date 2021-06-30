const PROTOCOL = 'http';
const HOST = 'api.football-data.org';
const API_VERSION = 'v2';

const PLAN = 'TIER_ONE';
const AREAS = '2077';

const BASE = `${PROTOCOL}://${HOST}/${API_VERSION}`;

// При формировании адреса для запроса лиг учитываем, что будем работать только с европейскими лигами с использованием бесплатного api
export function getCompetitionsUrl() {
    return `${BASE}/competitions/?areas=${AREAS}&plan=${PLAN}`;
}

export function getTeamsUrl(competitionId) {
    return `${BASE}/competitions/${competitionId}/teams`;
}

export function getCompetitionCalendarUrl(competitionId) {
    return `${BASE}/competitions/${competitionId}/matches`;
}

export function getTeamCalendarUrl(teamId) {
    return `${BASE}/teams/${teamId}/matches`;
}

export function getCompetitionUrl(competitionId) {
    return `${BASE}/competitions/${competitionId}`;
}
