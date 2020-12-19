import React, { ReactElement, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { initializeApp } from "./AppActions";
import { AppProps } from "./AppProps";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import PresetManager from "./components/PresetManager/PresetManager";
import { RootState } from "./RootState";
import Routes from "./routes";

function App ({
    isInitialized,
    initializeApp
}:AppProps): ReactElement {
    useEffect(() => {
        if (!isInitialized) {
            initializeApp();
        }
    }, []);

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
    initializeApp: initializeApp
};

function mapStateToProps (state: RootState) {
    const { isInitialized } = state.app;

    return {
        isInitialized
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
