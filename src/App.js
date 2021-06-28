import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Navigation from './Navigation/Navigation';
import MainPage from './MainPage/MainPage';
import CompetitionList from './CompetitionList/CompetitionList';
import TeamList from './TeamList/TeamList';
import CompetitionCalendar from './CompetitionCalendar/CompetitionCalendar';
import TeamCalendar from './TeamCalendar/TeamCalendar';
import style from './App.module.css';

function App() {
    return (
        <div className={style.container}>
            <h1 className={style.site_title}>Soccer Stat</h1>
            <Navigation/>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route path="/competition_list" component={CompetitionList}/>
                <Route path="/team_list" component={TeamList}/>
                <Route path="/competition_calendar" component={CompetitionCalendar}/>
                <Route path="/team_calendar" component={TeamCalendar}/>
            </Switch>
        </div>
    );
}

export default App;