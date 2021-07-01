import React, {useState, useEffect} from 'react';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import MatchList from '../MatchList/MatchList';
import ShowCountControl from '../ShowCountControl/ShowCountControl';
import {withRouter} from 'react-router-dom';
import {loadTeamCalendar, loadTeam} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP} from '../settings';
import style from './TeamCalendar.module.css';
import commonStyle from '../common.module.css';
import logoCap from "../images/logo_cap.png";

const PLAYER_POSITION_TRANSLATOR = {
    'Midfielder': 'Полузащитник',
    'Attacker': 'Атакующий',
    'Goalkeeper': 'Голкипер',
    'Defender': 'Защитник',
    '': ''
}

function TeamCalendar({location}) {
    let [team, setTeam] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);
    let [showSquad, setShowSquad] = useState(false);

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        let teamId = params.get('team');

        (async function () {
            try {
                let {matches} = await loadTeamCalendar(teamId);
                let team = await loadTeam(teamId);
                setMatches(matches);
                setTeam(team);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [location]);

    let showMoreHandler = () => {
        setCountForShow(countForShow + DEFAULT_SHOW_STEP);
    }

    let showSquadHandler = () => {
        setShowSquad(!showSquad);
    }

    let content = <Preloader/>;
    if (team && matches) {
        content = (
            <>
                <h1 className={commonStyle.competition_title}>{team.name}</h1>
                <div className={style.team_info}>
                    {team.crestUrl ?
                        <img
                            className={style.emblem} src={team.crestUrl}
                            alt="no logo"
                            onError={e => e.target.src = logoCap}
                        />
                        :
                        ''
                    }
                    <ul>
                        {team.shortname ? <li><span>{team.shortname}</span></li> : ''}
                        {team.address ? <li><span>{team.address}</span></li> : ''}
                        {team.website ? <li><a href={team.website}>сайт команды</a></li> : ''}
                        {team.email ? <li><a href={`mailto:${team.email}`}>{team.email}</a></li> : ''}
                        {team.founded ? <li>{team.founded}</li> : ''}
                        {team.venue ? <li>{team.venue}</li> : ''}
                    </ul>
                    {team.squad.length > 0 ?
                        <div>
                            <span onClick={showSquadHandler}>
                                {showSquad ? "Скрыть" : "Показать игроков"}
                            </span>
                            {showSquad ?
                                <table>
                                    <tbody>
                                    {team.squad.map(
                                        player =>
                                            <tr key={player.id}>
                                                <td>
                                                    {player.name}
                                                </td>
                                                <td>
                                                    {player.position ?
                                                        PLAYER_POSITION_TRANSLATOR[player.position] || player.position
                                                        :
                                                        ''
                                                    }
                                                </td>
                                            </tr>
                                    )}
                                    </tbody>
                                </table>
                                :
                                ''
                            }
                        </div>
                        :
                        ''
                    }
                </div>
                <MatchList matches={matches}/>
                {matches.length > countForShow ?
                    <ShowCountControl
                        currentCount={countForShow}
                        totalCount={matches.length}
                        changeCountHandler={showMoreHandler}
                    />
                    :
                    ''
                }
            </>
        )
    }
    if (error) {
        content = <ErrorDisplay text={error}/>;
    }

    return <div>{content}</div>;
}

export default withRouter(TeamCalendar);