import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/icons/icons.css";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom"
import {legacy_createStore as createStore}  from "redux"
import {Provider} from "react-redux"
import {composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "./reducer";

const store = createStore(rootReducer,composeWithDevTools());
// //Redux is a predictable state container for JavaScript apps. As the application grows, it becomes difficult to keep it organized and maintain data flow. Redux solves this problem by managing application’s state with a single global object called Store.

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);