import React, {useState, useEffect} from 'react';
import {loadTeams} from '../utils';
import style from './Teams.module.css';

function Teams({location}) {
    let [teams, setTeams] = useState(null);

    let params = new URLSearchParams(location.search);
    let competition = params.get('competition');

    useEffect(async () => {
        let {teams} = await loadTeams(competition);
        setTeams(teams);
    }, []);

    return (
        <div>
            {teams ?
                <ul>
                    {teams.map(
                        team => <li key={team.id}>{team.name}</li>
                    )}
                </ul>
                :
                ''
            }
        </div>
    )
}

export default Teams;