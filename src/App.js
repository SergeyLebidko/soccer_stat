import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Competitions from './Competitions/Competitions';
import Teams from './Teams/Teams';
import CompetitionCalendar from './CompetitionCalendar/CompetitionCalendar';
import TeamCalendar from './TeamCalendar/TeamCalendar';
import NoMatch from './NoMatch/NoMatch';
import style from './App.module.css';

function App() {
    return (
        <div className={style.container}>
            <h1 className={style.site_title}>
                <Link to="/competitions">Soccer Stat</Link>
            </h1>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/competitions"/>
                </Route>
                <Route path="/competitions" component={Competitions}/>
                <Route path="/teams" component={Teams}/>
                <Route path="/competition_calendar" component={CompetitionCalendar}/>
                <Route path="/team_calendar" component={TeamCalendar}/>
                <Route path="*" component={NoMatch}/>
            </Switch>
        </div>
    );
}

export default App;