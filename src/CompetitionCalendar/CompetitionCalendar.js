import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import {loadCompetition, loadCompetitionCalendar, getDateString} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP} from '../settings';
import style from './CompetitionCalendar.module.css';
import commonStyle from '../common.module.css';

const STATUS_TRANSLATOR = {
    'SCHEDULED': 'Запланирован',
    'POSTPONED': 'Перенесен',
    'CANCELED': 'Отменен',
    'SUSPENDED': 'Остановлен',
    'IN_PLAY': 'Идет игра',
    'PAUSED': 'Перерыв',
    'AWARDED': 'Идет награждение',
    'FINISHED': 'Игра окончена'
}

const STAGE_TRANSLATOR = {
    'REGULAR_SEASON': 'Регулярный',
    '1ST_QUALIFYING_ROUND': '1 раунд квалификаци',
    '2ND_QUALIFYING_ROUND': '2 раунд квалификации',
    '3RD_QUALIFYING_ROUND': '3 раунд квалификации',
    'PLAY_OFF_ROUND': 'Плей офф',
    'GROUP_STAGE': 'Групповой этап',
    'ROUND_OF_16': '1/8 финала',
    'QUARTER_FINALS': 'Четвертьфинал',
    'SEMI_FINALS': 'Полуфинал',
    'FINAL': 'Финал'
}

function getScoreText(match) {
    let score = match.score;
    let winner = score.winner;
    if (!winner) return '-/-';

    let {fullTime, halfTime, extraTime, penalties} = score;

    let awayTeamScore = fullTime.awayTeam + halfTime.awayTeam + extraTime.awayTeam + penalties.awayTeam;
    let homeTeamScore = fullTime.homeTeam + halfTime.homeTeam + extraTime.homeTeam + penalties.homeTeam;

    return `${awayTeamScore}/${homeTeamScore}`;
}

function CompetitionCalendar({location}) {
    let [competition, setCompetition] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        let competitionId = params.get('competition');

        if (!competitionId) {
            setError('Некорректный URL');
            return;
        }

        (async function () {
            try {
                let {matches} = await loadCompetitionCalendar(competitionId);
                let competition = await loadCompetition(competitionId);
                setMatches(matches);
                setCompetition(competition);
            } catch (err) {
                setError(err.message);
            }

        })();
    }, [location])

    let showMoreHandler = () => {
        setCountForShow(countForShow + DEFAULT_SHOW_STEP);
    }

    let content = <Preloader/>;
    if (matches && competition) {
        content = (
            <>
                <h1 className={commonStyle.competition_title}>{competition.name}</h1>
                <ul className={style.matches_list}>
                    <li key="header_captions" className={style.card}>
                        <span className={style.info_block + ' ' + style.date_block}>
                            Дата проведения
                        </span>
                        <span className={style.info_block + ' ' + style.status_block}>
                            Статус
                        </span>
                        <span className={style.info_block + ' ' + style.stage_block}>
                            Этап
                        </span>
                        <span className={style.info_block + ' ' + style.command_block}>
                            Гости
                        </span>
                        <span className={style.info_block + ' ' + style.command_block}>
                            Хозяева
                        </span>
                        <span className={style.info_block + ' ' + style.score_block}>
                            Исход матча
                        </span>
                    </li>
                    {matches.map(
                        (match, index) => {
                            if ((index + 1) > countForShow) return '';
                            return (
                                <li key={match.id} className={style.card}>
                                <span className={style.info_block + ' ' + style.date_block}>
                                    {getDateString(match.utcDate)}
                                </span>
                                    <span className={style.info_block + ' ' + style.status_block}>
                                    {STATUS_TRANSLATOR[match.status]}
                                </span>
                                    <span className={style.info_block + ' ' + style.stage_block}>
                                    {STAGE_TRANSLATOR[match.stage]}
                                </span>
                                    <span className={style.info_block + ' ' + style.command_block}>
                                    <Link to={`/team_calendar/?team=${match.awayTeam.id}`}>
                                        {match.awayTeam.name}
                                    </Link>
                                </span>
                                    <span className={style.info_block + ' ' + style.command_block}>
                                    <Link to={`/team_calendar/?team=${match.homeTeam.id}`}>
                                        {match.homeTeam.name}
                                    </Link>
                                </span>
                                    <span className={style.info_block + ' ' + style.score_block}>
                                    {getScoreText(match)}
                                </span>
                                </li>
                            )
                        }
                    )}
                </ul>
                {matches.length > countForShow ?
                    <button onClick={showMoreHandler}>Показать еще</button>
                    :
                    ''
                }
            </>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default CompetitionCalendar;