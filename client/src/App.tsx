import React, { ReactElement, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { getVersion, fetchPresets } from "./AppActions";
import { AppProps } from "./AppProps";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import PresetManager from "./components/PresetManager/PresetManager";
import Routes from "./routes";

function App ({
    getVersion,
    getPresets
}:AppProps): ReactElement {
    useEffect(getVersion, []);
    useEffect(getPresets, []);

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

const mapDispatchToProps = {
    getVersion: getVersion,
    getPresets: fetchPresets
};

export default connect(null, mapDispatchToProps)(App);
