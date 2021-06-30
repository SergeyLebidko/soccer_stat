import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetition, loadTeams} from '../utils';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import style from './Teams.module.css';

function Teams({location}) {
    let [competition, setCompetition] = useState(null);
    let [teams, setTeams] = useState(null);
    let [error, setError] = useState(null);

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        let competitionId = params.get('competition');

        (async function () {
            try {
                let {teams} = await loadTeams(competitionId);
                let competition = await loadCompetition(competitionId);
                setTeams(teams);
                setCompetition(competition);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [location]);

    let content = <Preloader/>
    if (teams && competition) {
        content = (
            <>
                <h1 className={style.competition_title}>{competition.name}</h1>
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
            </>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default Teams;