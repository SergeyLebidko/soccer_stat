import React from 'react';
import {HashRouter, Switch, Route} from "react-router-dom";
import './App.css';

function App() {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Cap}/>
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