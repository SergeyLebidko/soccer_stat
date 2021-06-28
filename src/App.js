import React from 'react';
import {HashRouter, Switch, Route} from "react-router-dom";
import MainPage from './MainPage/MainPage';
import './App.css';

function App() {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route path="/competition_list" component={Cap}/>
                <Route path="/team_list" component={Cap}/>
                <Route path="/competition_calendar" component={Cap}/>
                <Route path="/team_calendar" component={Cap}/>
            </Switch>
        </HashRouter>
    );
}

export default App;


// Временный компонент-заглушка
function Cap() {
    return (
        <div>
            Раздел находится в разработке
        </div>
    )
}