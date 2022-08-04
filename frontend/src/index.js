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
// import "bootstrap/dist/css/bootstrap.min.css";

const store = createStore(rootReducer,composeWithDevTools());
//Redux is a predictable state container for JavaScript apps. As the application grows, it becomes difficult to keep it organized and maintain data flow. 
//Redux solves this problem by managing application’s state with a single global object called Store.

//Another common feature which you may wish to add to your app is the redux-devtools-extension integration.
//The extension is a suite of tools which give you absolute control over your Redux store - it allows you to inspect and replay actions, explore your state at different times, dispatch actions directly to the store, and much more.

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);