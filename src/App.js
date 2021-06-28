import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Navigation from './Navigation/Navigation';
import MainPage from './MainPage/MainPage';
import './App.css';

function App() {
    return (
        <>
            <h1>Soccer Stat</h1>
            <Navigation/>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route path="/competition_list" component={Cap}/>
                <Route path="/team_list" component={Cap}/>
                <Route path="/competition_calendar" component={Cap}/>
                <Route path="/team_calendar" component={Cap}/>
            </Switch>
        </>
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