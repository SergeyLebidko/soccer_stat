import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadTeams} from '../utils';
import style from './Teams.module.css';

function Teams({location}) {
    let [teams, setTeams] = useState(null);
    let [error, setError] = useState(null);

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        let competition = params.get('competition');

        (async function () {
            let {teams} = await loadTeams(competition);
            setTeams(teams);
        })();
    }, [location]);

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