import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetitionCalendar} from '../utils';
import style from './CompetitionCalendar.module.css';

function CompetitionCalendar({location}) {
    let [matches, setMatches] = useState(null);

    let params = new URLSearchParams(location.search);
    let competition = params.get('competition');

    useEffect(async () => {
        let {count, matches} = await loadCompetitionCalendar(competition);
        setMatches(matches);
    }, [])

    return (
        <div>
            {matches ?
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
                :
                ''
            }
        </div>
    )
}

export default CompetitionCalendar;