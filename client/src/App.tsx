import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import ControlPanel from "./controlpanel/ControlPanel";
import PresetManager from "./presetmanager/PresetManager";
import Routes from "./routes";

function App () {
    return (
        <Router>
            <Switch>
                <Redirect exact from="/cp" to={Routes.controlPanel}/>
                <Route exact path={Routes.controlPanel}><ControlPanel /></Route>
                <Route exact path={Routes.presetManager}><PresetManager /></Route>
            </Switch>
        </Router>
    );
}

export default App;
