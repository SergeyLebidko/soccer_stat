import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetitions} from '../utils';
import style from './Competitions.module.css';

function Competitions() {
    let [competitions, setCompetitions] = useState(null);

    // При монтировании компонента сразу же загружаем список лиг
    useEffect(async () => {
        let {competitions} = await loadCompetitions();
        setCompetitions(competitions);
    }, []);

    return (
        <div>
            {competitions ?
                <ul>
                    {competitions.map(
                        competition =>
                            <li key={competition.id}>
                                <Link to={`/teams/?competition=${competition.id}`}>{competition.name}</Link>
                                <Link to={`/competition_calendar/?competition=${competition.id}`}>Календарь лиги</Link>
                            </li>
                    )}
                </ul>
                :
                ''
            }
        </div>
    )
}

export default Competitions;