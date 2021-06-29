import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetitions} from '../utils';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
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
                setError(err.message);
            }
        })();
    }, []);

    let content = <Preloader/>;
    if (competitions) {
        content = (
            <div className={style.card_container}>
                {competitions.map(
                    competition =>
                        <div key={competition.id} className={style.card}>
                            <Link to={`/competition_calendar/?competition=${competition.id}`}>
                                <img
                                    src={competition.emblemUrl || competition.area.ensignUrl}
                                    className={style.emblem}
                                />
                            </Link>
                            <h1 className={style.competition_title}>{competition.name}</h1>
                            <h3 className={style.country_title}>{competition.area.name}</h3>
                            <Link to={`/teams/?competition=${competition.id}`}>Команды</Link>
                        </div>
                )}
            </div>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default Competitions;