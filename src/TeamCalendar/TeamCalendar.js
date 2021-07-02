import React, {useState, useEffect, useRef} from 'react';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import MatchList from '../MatchList/MatchList';
import ShowCountControl from '../ShowCountControl/ShowCountControl';
import {withRouter} from 'react-router-dom';
import {loadTeamCalendar, loadTeam, matchesFilter} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP} from '../settings';
import style from './TeamCalendar.module.css';
import commonStyle from '../common.module.css';
import logoCap from '../images/logo_cap.png';
import find from '../images/find.svg';

const PLAYER_POSITION_TRANSLATOR = {
    'Midfielder': 'Полузащитник',
    'Attacker': 'Атакующий',
    'Goalkeeper': 'Голкипер',
    'Defender': 'Защитник',
}

function TeamCalendar({location, history}) {
    let [team, setTeam] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);
    let [showSquad, setShowSquad] = useState(false);
    let searchInput = useRef(null);

    let params = new URLSearchParams(location.search);
    let teamId = params.get('team');
    let search = params.get('search');

    useEffect(() => {
        if (!teamId) {
            setError('Некорректный URL');
            return;
        }

        (async function () {
            try {
                let {matches} = await loadTeamCalendar(teamId);

                // Применяем фильтры
                if (search) matches = matchesFilter(matches, search);

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

    // Обработчик клика по кнопке поиска
    let findClickHandler = () => {
        let params = new URLSearchParams();
        params.append('team', teamId);

        let searchValue = searchInput.current.value.trim();
        if (searchValue) params.append('search', searchValue);

        history.push(`/team_calendar/?${params.toString()}`);
    }

    // Обработчик нажатия на Enter в поле ввода
    let enterHandler = event => {
        if (event.keyCode === 13) findClickHandler();
    }

    let content = <Preloader/>;
    if (team && matches) {
        content = (
            <div className={style.teams_calendar_container}>
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
                    <ul className={style.summary_info}>
                        {team.shortname ? <li><span>{team.shortname}</span></li> : ''}
                        {team.address ? <li><span>{team.address}</span></li> : ''}
                        {team.website ? <li><a href={team.website}>сайт команды</a></li> : ''}
                        {team.email ? <li><a href={`mailto:${team.email}`}>{team.email}</a></li> : ''}
                        {team.founded ? <li>{team.founded}</li> : ''}
                        {team.venue ? <li>{team.venue}</li> : ''}
                    </ul>
                    {team.squad.length > 0 ?
                        <div className={style.squad_block}>
                            <span className={style.show_squad_button} onClick={showSquadHandler}>
                                {showSquad ? "Скрыть состав" : "Показать состав"}
                            </span>
                            {showSquad ?
                                <div className={style.squad_table_container}>
                                    <table className={style.squad_table}>
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
                                </div>
                                :
                                ''
                            }
                        </div>
                        :
                        ''
                    }
                </div>
                <div className={style.filters}>
                    <input
                        type="text"
                        className={commonStyle.text_input}
                        ref={searchInput}
                        defaultValue={search ? search : ''}
                        onKeyUp={enterHandler}
                        placeholder="Название команды"
                    />
                    <img src={find} className={commonStyle.find_button} onClick={findClickHandler}/>
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
            </div>
        )
    }
    if (error) {
        content = <ErrorDisplay text={error}/>;
    }

    return <div>{content}</div>;
}

export default withRouter(TeamCalendar);