import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetitions} from '../utils';
import Preloader from '../Preloader/Preloader';
import style from './Competitions.module.css';

function Competitions() {
    let [competitions, setCompetitions] = useState(null);
    let [error, setError] = useState(null);

    // При монтировании компонента сразу же загружаем список лиг
    useEffect(() => {
        (async function () {
            try {
                let {competitions} = await loadCompetitions();
                setCompetitions(competitions);
            } catch (err) {
                setError(err);
            }
        })();
    }, []);

    let content = <Preloader/>;
    if (competitions) {
        content = (
            <ul>
                {competitions.map(
                    competition =>
                        <li key={competition.id}>
                            <Link to={`/teams/?competition=${competition.id}`}>{competition.name}</Link>
                            <Link to={`/competition_calendar/?competition=${competition.id}`}>Календарь лиги</Link>
                        </li>
                )}
            </ul>
        );
    }
    if (error) {

    }

    return <div>{content}</div>;
}

export default Competitions;