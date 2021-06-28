import {API_TOKEN} from './settings';
import * as U from './urls';

async function loadData(url, errorMessage) {
    let response = await fetch(url, {
        headers: {
            'X-Auth-Token': API_TOKEN
        }
    });
    if (!response.ok) throw new Error(errorMessage);
    let json = await response.json();
    return json;
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