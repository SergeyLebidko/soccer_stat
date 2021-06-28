import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Competitions from './Competitions/Competitions';
import style from './App.module.css';


function App() {
    return (
        <div className={style.container}>
            <h1 className={style.site_title}>Soccer Stat</h1>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/competitions"/>
                </Route>
                <Route path="/competitions" component={Competitions}/>
            </Switch>
        </div>
    );
}

export default App;