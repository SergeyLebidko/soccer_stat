import {API_TOKEN} from './settings';
import * as U from './urls';

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
    let {count, competitions} = await loadData(url, 'Не удалось загрузить список лиг');
    return {count, competitions};
}

export async function loadTeams(competition) {
    let url = U.getTeamsUrl(competition);
    let {count, teams} = await loadData(url, 'Не удалось загрузить список команд лиги')
    return {count, teams};
}

export async function loadCompetitionCalendar(competition) {
    let url = U.getCompetitionCalendarUrl(competition);
    let {count, matches} = await loadData(url, 'Не удалось загрузить календарь лиги');
    return {count, matches};
}

export async function loadTeamCalendar(team) {
    let url = U.getTeamCalendar(team);
    let {count, matches} = await loadData(url, 'Не удалось загрузить календарь команды');
    return {count, matches};
}