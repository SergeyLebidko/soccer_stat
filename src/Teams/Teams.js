import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadTeams} from '../utils';
import style from './Teams.module.css';

function Teams({location}) {
    let [teams, setTeams] = useState(null);

    let params = new URLSearchParams(location.search);
    let competition = params.get('competition');

    useEffect(async () => {
        let {count, teams} = await loadTeams(competition);
        setTeams(teams);
    }, []);

    return (
        <div>
            {teams ?
                <ul>
                    {teams.map(
                        team =>
                            <li key={team.id}>
                                <Link to={`/team_calendar/?team=${team.id}`}>
                                    {team.name}
                                </Link>
                            </li>
                    )}
                </ul>
                :
                ''
            }
        </div>
    );
}

export default Teams;