import {API_TOKEN} from './settings';
import * as U from './urls';

// Блок функций для загрузки данных
async function loadData(url, errorMessage) {
    let response;
    try {
        response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_TOKEN
            }
        });
    } catch (err) {
        throw new Error(`${errorMessage}. Превышен лимит количества запросов. Попробуйте выполнить запрос позже.`);
    }
    if (response.status === 403) throw new Error(`${errorMessage}. Данные не доступны для вашего тарифного плана.`);
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

export async function loadCompetitionCalendar(competitionId, season) {
    let url = U.getCompetitionCalendarUrl(competitionId, season);
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

// Функция нижк преобразует переданную строку с датой в удобочитаемый формат
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

export function getDateString(rawData) {
    let date = new Date(Date.parse(rawData));
    return `${date.getDate()} ${MONTH_LIST[date.getMonth()]} ${date.getFullYear()}`;
}

// Функция для фильтрации списка матчей
export function matchesFilter(matches, search) {
    return matches.filter(match => {
        let f1, f2;
        f1 = f2 = false;
        if (match.homeTeam.id) f1 = match.homeTeam.name.toLowerCase().includes(search.toLowerCase());
        if (match.awayTeam.id) f2 = match.awayTeam.name.toLowerCase().includes(search.toLowerCase());
        return f1 || f2;
    });
}