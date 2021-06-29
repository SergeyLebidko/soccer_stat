import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {loadTeamCalendar} from '../utils';
import style from './TeamCalendar.module.css';

function TeamCalendar({location}) {
    let [matches, setMatches] = useState(null);

    let params = new URLSearchParams(location.search);
    let team = params.get('team');

    useEffect(async () => {
        let {count, matches} = await loadTeamCalendar(team);
        setMatches(matches);
    }, []);

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
                                <span>Гости: {match.awayTeam.name}</span>
                                <span>Хозяева: {match.homeTeam.name}</span>
                            </li>
                    )}
                </ul>
                :
                ''
            }
        </div>
    );
}

export default withRouter(TeamCalendar);