import React from 'react';
import {Switch, Route} from 'react-router-dom';

import style from './App.module.css';

function App() {
    return (
        <div className={style.container}>
            <h1 className={style.site_title}>Soccer Stat</h1>
            <Switch>
            </Switch>
        </div>
    );
}

export default App;