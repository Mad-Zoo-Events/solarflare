import React, { ReactElement } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import PresetManager from "./components/PresetManager/PresetManager";
import Routes from "./routes";

function App (): ReactElement {
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
