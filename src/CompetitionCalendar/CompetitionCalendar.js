import React, {useState, useEffect} from 'react';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import MatchList from '../MatchList/MatchList';
import ShowCountControl from '../ShowCountControl/ShowCountControl';
import {loadCompetition, loadCompetitionCalendar} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP} from '../settings';
import commonStyle from '../common.module.css';

function CompetitionCalendar({location}) {
    let [competition, setCompetition] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
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
                let {matches} = await loadCompetitionCalendar(competitionId);
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

    let content = <Preloader/>;
    if (matches && competition) {
        let matchesForShow = matches.filter((match, index) => index < countForShow);
        content = (
            <>
                <h1 className={commonStyle.competition_title}>{competition.name}</h1>
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
            </>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default CompetitionCalendar;