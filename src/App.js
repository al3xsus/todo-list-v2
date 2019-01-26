import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import TasksManager from './pages/TasksManager';

const App = () => (
    <Fragment>
        <main>
            <Route path="/" component={TasksManager}/>
        </main>
    </Fragment>
);

export default App;
