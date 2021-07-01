import React, {useState, useEffect, useRef} from 'react';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import MatchList from '../MatchList/MatchList';
import ShowCountControl from '../ShowCountControl/ShowCountControl';
import {loadCompetition, loadCompetitionCalendar} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP} from '../settings';
import commonStyle from '../common.module.css';
import style from './CompetitionCalendar.module.css'
import find from '../images/find.svg';

function CompetitionCalendar({history, location}) {
    let [competition, setCompetition] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);
    let searchInput = useRef(null);

    let params = new URLSearchParams(location.search);
    let competitionId = params.get('competition');
    let search = params.get('search');

    useEffect(() => {
        if (!competitionId) {
            setError('Некорректный URL');
            return;
        }

        (async function () {
            try {
                let {matches} = await loadCompetitionCalendar(competitionId);

                // Если нужно - фильтруем список матчей
                if (search) {
                    matches = matches.filter(match => {
                        let f1, f2;
                        f1 = f2 = false;
                        if (match.homeTeam.id) f1 = match.homeTeam.name.toLowerCase().includes(search.toLowerCase());
                        if (match.awayTeam.id) f2 = match.awayTeam.name.toLowerCase().includes(search.toLowerCase());
                        return f1 || f2;
                    });
                }

                let competition = await loadCompetition(competitionId);
                setMatches(matches);
                setCompetition(competition);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [location])

    let showMoreHandler = () => {
        setCountForShow(countForShow + DEFAULT_SHOW_STEP);
    }

    // Обработчик клика по кнопке поиска
    let findClickHandler = () => {
        let params = new URLSearchParams();
        params.append('competition', competitionId);

        let searchValue = searchInput.current.value.trim();
        if (searchValue) params.append('search', searchValue);

        history.push(`/competition_calendar/?${params.toString()}`);
    }

    // Обработчик нажатия на Enter в поле ввода
    let enterHandler = event => {
        if (event.keyCode === 13) findClickHandler();
    }

    let content = <Preloader/>;
    if (matches && competition) {
        let matchesForShow = matches.filter((match, index) => index < countForShow);
        content = (
            <div className={style.matches_container}>
                <h1 className={commonStyle.competition_title}>{competition.name}</h1>
                <div className={style.filters}>
                    <input
                        type="text"
                        className={commonStyle.text_input}
                        ref={searchInput}
                        defaultValue={search ? search : ''}
                        onKeyUp={enterHandler}
                    />
                    <img src={find} className={commonStyle.find_button} onClick={findClickHandler}/>
                </div>
                <MatchList matches={matchesForShow}/>
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
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default CompetitionCalendar;