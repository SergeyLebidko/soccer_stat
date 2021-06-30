import {API_TOKEN} from './settings';
import * as U from './urls';

const MONTH_LIST = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
];

async function loadData(url, errorMessage) {
    let response;
    try {
        response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_TOKEN
            }
        });
    } catch (err) {
        throw new Error(`${errorMessage} (${err.toString()})`);
    }
    if (!response.ok) throw new Error(errorMessage);
    return await response.json();
}

export async function loadCompetitions() {
    let url = U.getCompetitionsUrl();
    let {competitions} = await loadData(url, 'Не удалось загрузить список лиг');
    return {competitions};
}

export async function loadTeams(competitionId) {
    let url = U.getTeamsUrl(competitionId);
    let {teams} = await loadData(url, 'Не удалось загрузить список команд лиги')
    return {teams};
}

export async function loadCompetitionCalendar(competitionId) {
    let url = U.getCompetitionCalendarUrl(competitionId);
    let {matches} = await loadData(url, 'Не удалось загрузить календарь лиги');
    return {matches};
}

export async function loadTeamCalendar(teamId) {
    let url = U.getTeamCalendarUrl(teamId);
    let {matches} = await loadData(url, 'Не удалось загрузить календарь команды');
    return {matches};
}

export async function loadCompetition(competitionId) {
    let url = U.getCompetitionUrl(competitionId);
    return await loadData(url, 'Не удалось загрузить данные лиги');
}

export async function loadTeam(teamId) {
    let url = U.getTeamUrl(teamId);
    return await loadData(url, 'Не удалось загрузить данные команды');
}

export function getDateString(rawData) {
    let date = new Date(Date.parse(rawData));
    return `${date.getDate()} ${MONTH_LIST[date.getMonth()]} ${date.getFullYear()}`;
}