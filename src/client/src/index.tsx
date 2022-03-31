import React from "react";
import ReactDOM from "react-dom";
import { AppRegistry } from "react-native";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

// const root = document.getElementById("root");
// ReactDOM.render(<App />, root);
reportWebVitals();
