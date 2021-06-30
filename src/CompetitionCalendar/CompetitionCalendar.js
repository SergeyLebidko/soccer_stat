import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import {loadCompetition, loadCompetitionCalendar} from '../utils';
import style from './CompetitionCalendar.module.css';

function CompetitionCalendar({location}) {
    let [competition, setCompetition] = useState(null);
    let [matches, setMatches] = useState(null);
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

    let content = <Preloader/>;
    if (matches && competition) {
        content = (
            <>
                <h1>{competition.name}</h1>
                <ul>
                    {matches.map(
                        match =>
                            <li key={match.id}>
                                <span>Дата проведения: {match.utcDate}</span>
                                <span>Статус: {match.status}</span>
                                <span>Этап: {match.stage}</span>
                                <Link to={`/team_calendar/?team=${match.awayTeam.id}`}>
                                    Гости: {match.awayTeam.name}
                                </Link>
                                <Link to={`/team_calendar/?team=${match.homeTeam.id}`}>
                                    Хозяева: {match.homeTeam.name}
                                </Link>
                            </li>
                    )}
                </ul>
            </>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default CompetitionCalendar;