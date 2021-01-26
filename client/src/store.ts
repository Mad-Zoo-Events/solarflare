import reduxWebsocket from "@giantmachines/redux-websocket";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const reduxWebsocketMiddleware = reduxWebsocket({
    reconnectOnClose: true
});

const store = createStore(rootReducer, applyMiddleware(thunk, reduxWebsocketMiddleware));

export default store;
