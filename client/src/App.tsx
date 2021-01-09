import React, { ReactElement, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { handleSocketMessage, initializeApp } from "./AppActions";
import { AppProps } from "./AppProps";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import PresetManager from "./components/PresetManager/PresetManager";
import { BackendMessage } from "./domain/client/BackendMessage";
import { RootState } from "./RootState";
import Routes from "./routes";

function App ({
    isInitialized,
    messageQueue,
    presets,
    handleSocketMessage,
    initializeApp
}: AppProps): ReactElement {
    useEffect(() => {
        if (!isInitialized) {
            initializeApp();
        }
    }, []);

    messageQueue.forEach(m => {
        const message: BackendMessage = JSON.parse(m);
        if (message) {
            handleSocketMessage(message, presets);
        }
        messageQueue.shift();
    });

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
    initializeApp: initializeApp,
    handleSocketMessage: handleSocketMessage
};

function mapStateToProps (state: RootState) {
    const { isInitialized, messageQueue, presets } = state.app;

    return {
        isInitialized,
        messageQueue,
        presets
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
