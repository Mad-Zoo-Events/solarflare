import React, { ReactElement, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { handleSocketMessage, initializeApp } from "./AppActions";
import { AppProps } from "./AppProps";
import { selectIsInitialized, selectMessageQueue, selectPresets } from "./AppSelectors";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { selectIgnoreKeystrokes } from "./components/ControlPanel/ControlPanelSelectors";
import PresetManager from "./components/PresetManager/PresetManager";
import SystemSettings from "./components/SystemSettings/SystemSettings";
import { RootState } from "./RootState";
import Routes from "./routes";

function App ({
    isInitialized,
    messageQueue,
    presets,
    ignoreKeystrokes,
    handleSocketMessage,
    initializeApp
}: AppProps): ReactElement {
    useEffect(() => {
        if (!isInitialized) {
            initializeApp();
        }
    }, []);

    messageQueue.forEach(m => {
        handleSocketMessage(m, presets, ignoreKeystrokes);
        messageQueue.shift();
    });

    return (
        <Router>
            <Switch>
                <Redirect exact from="/cp" to={Routes.controlPanel}/>
                <Route exact path={Routes.controlPanel}><ControlPanel /></Route>
                <Route exact path={Routes.presetManager}><PresetManager /></Route>
                <Route exact path={Routes.settings}><SystemSettings /></Route>
            </Switch>
        </Router>
    );
}

const mapDispatchToProps = {
    initializeApp: initializeApp,
    handleSocketMessage: handleSocketMessage
};

function mapStateToProps (state: RootState) {
    const presets = selectPresets(state);
    const isInitialized = selectIsInitialized(state);
    const messageQueue = selectMessageQueue(state);
    const ignoreKeystrokes = selectIgnoreKeystrokes(state);

    return {
        isInitialized,
        messageQueue,
        presets,
        ignoreKeystrokes
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
