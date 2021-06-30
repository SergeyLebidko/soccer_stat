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
    'PRELIMINARY_ROUND': 'Предварительный раунд',
    'REGULAR_SEASON': 'Регулярный',
    'QUALIFICATION_ROUND_1': '1 раунд квалификаци',
    'QUALIFICATION_ROUND_2': '2 раунд квалификаци',
    'QUALIFICATION_ROUND_3': '3 раунд квалификаци',
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
                <table className={style.match_table}>
                    <tbody>
                    <tr key="header_captions" className={style.row}>
                        <th>
                            Дата проведения
                        </th>
                        <th>
                            Статус
                        </th>
                        <th>
                            Этап
                        </th>
                        <th>
                            Гости
                        </th>
                        <th>
                            Хозяева
                        </th>
                        <th>
                            Исход матча
                        </th>
                    </tr>
                    {matches.map(
                        (match, index) => {
                            if ((index + 1) > countForShow) return '';
                            return (
                                <tr key={match.id} className={style.row}>
                                    <td>
                                        {getDateString(match.utcDate)}
                                    </td>
                                    <td>
                                        {STATUS_TRANSLATOR[match.status]}
                                    </td>
                                    <td>
                                        {STAGE_TRANSLATOR[match.stage] || match.stage}
                                    </td>
                                    <td>
                                        {match.awayTeam.id ?
                                            <Link to={`/team_calendar/?team=${match.awayTeam.id}`}>
                                                {match.awayTeam.name}
                                            </Link>
                                            :
                                            '-'
                                        }
                                    </td>
                                    <td>
                                        {match.homeTeam.id ?
                                            <Link to={`/team_calendar/?team=${match.homeTeam.id}`}>
                                                {match.homeTeam.name}
                                            </Link>
                                            :
                                            '-'
                                        }
                                    </td>
                                    <td>
                                        {getScoreText(match)}
                                    </td>
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
                {matches.length > countForShow ?
                    <div className={style.show_more_block}>
                        <button onClick={showMoreHandler} className={style.show_more_button}>
                            Показать
                            еще {(matches.length - countForShow) > DEFAULT_SHOW_STEP ? DEFAULT_SHOW_STEP : (matches.length - countForShow)}
                        </button>
                    </div>
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