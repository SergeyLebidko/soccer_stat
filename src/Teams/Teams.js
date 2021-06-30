import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetition, loadTeams} from '../utils';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import logoCap from '../images/logo_cap.png';
import style from './Teams.module.css';
import commonStyle from '../common.module.css';

function Teams({location}) {
    let [competition, setCompetition] = useState(null);
    let [teams, setTeams] = useState(null);
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

    // При формировании карточек команд учитываем, что для некоторых команд api не возвращает доступное лого.
    // Но даже если лого есть в api, оно может быть недоступно для загрузки.
    // В этом случае на его место вставляем заглушку.
    if (teams && competition) {
        content = (
            <>
                <h1 className={commonStyle.competition_title}>{competition.name}</h1>
                <ul className={style.teams_list}>
                    {teams.map(
                        team =>
                            <li key={team.id} className={style.card}>
                                <div className={style.emblem_block}>
                                    {team.crestUrl ?
                                        <img
                                            className={style.emblem} src={team.crestUrl}
                                            alt="no logo"
                                            onError={e => e.target.src = logoCap}
                                        />
                                        :
                                        ''
                                    }
                                </div>
                                <div className={style.link_block}>
                                    <Link to={`/team_calendar/?team=${team.id}`}>
                                        {team.name}
                                    </Link>
                                    <span className={style.country_title}>{team.area.name} ({team.venue})</span>
                                    {team.website ? <a href={team.website}>сайт команды</a> : ''}
                                </div>

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