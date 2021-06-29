const PROTOCOL = 'http';
const HOST = 'api.football-data.org';
const API_VERSION = 'v2';

const PLAN = 'TIER_ONE';
const AREAS = '2077';

// При формировании адреса для запроса лиг учитываем, что будем работать только с европейскими лигами с использованием бесплатного api
export function getCompetitionsUrl() {
    return `${PROTOCOL}://${HOST}/${API_VERSION}/competitions/?areas=${AREAS}&plan=${PLAN}`;
}

export function getTeamsUrl(competition) {
    return `${PROTOCOL}://${HOST}/${API_VERSION}/competitions/${competition}/teams`;
}

export function getCompetitionCalendarUrl(competition) {
    return `${PROTOCOL}://${HOST}/${API_VERSION}/competitions/${competition}/matches`;
}
