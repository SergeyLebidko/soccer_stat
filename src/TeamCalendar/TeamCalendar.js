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

function TeamCalendar({location}) {
    let [team, setTeam] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);

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
                    <div>

                    </div>
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
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default withRouter(TeamCalendar);