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
        // Опытным путем я выяснил, что исключение при отправке запроса возникает при слишком частом обращении к серверу,
        // когда количество запросов превышает заданный для бесплатного тарифного плана лимит. В этом случае сервер может
        // и не вернуть ответ со статусом 429, как это описано в документации, а попросту заблокировать запрос не отправив
        // клиенту заголовок 'Access-Control-Allow-Origin'. Я не знаю, является ли это багом сервера или недокументированной
        // фичей, но, в любом случае, стараюсь учитывать эту особенность API.
        throw new Error(`${errorMessage}. Возможно, превышен лимит запросов. Попробуйте обновить страницу позже. (${err.message})`);
    }

    // Проверяем описанные в документации к API коды ошибок
    if (response.status === 403) throw new Error(`${errorMessage}. Данные не доступны для вашего тарифного плана.`);
    if (response.status === 404) throw new Error(`${errorMessage}. Запрошенные данные отсутствуют на сервере.`);
    if (response.status === 429) throw new Error(`${errorMessage}. Превышен лимит количества запросов. Попробуйте обновить страницу позже.`);

    let json = await response.json();

    // Если пришел ответ со статусом 400, то извлекаем из него сообщение сервера об ошибке и возвращаем "как есть"
    if (response.status === 400) throw new Error(`${errorMessage}. (${json.message}).`);

    // Если возникла непредвиденная ошибка другого рода - выдаем стандартное сообщение, дополненное кодом ошибки
    if (!response.ok) throw new Error(`${errorMessage}. Код ошибки - ${response.status}`);

    return json;
}

export async function loadCompetitions() {
    let url = U.getCompetitionsUrl();
    let {competitions} = await loadData(url, 'Не удалось загрузить список лиг');
    return {competitions};
}

export async function loadTeams(competitionId, season) {
    let url = U.getTeamsUrl(competitionId, season);
    let {teams} = await loadData(url, 'Не удалось загрузить список команд лиги')
    return {teams};
}

export async function loadCompetitionCalendar(competitionId, season, dateFrom, dateTo) {
    let url = U.getCompetitionCalendarUrl(competitionId, season, dateFrom, dateTo);
    let {matches} = await loadData(url, 'Не удалось загрузить календарь лиги');
    return {matches};
}

export async function loadTeamCalendar(teamId, dateFrom, dateTo) {
    let url = U.getTeamCalendarUrl(teamId, dateFrom, dateTo);
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