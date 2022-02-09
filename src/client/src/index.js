import React from "react";
import { StylesProvider } from "@material-ui/core";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Normalize } from "styled-normalize";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "./App/theme/Theme";

const root = document.getElementById("root");
console.log("entrypoint");
ReactDOM.render(
  <React.StrictMode>
    <Normalize />
    <BrowserRouter>
      <StylesProvider injectFirst>
        <Theme>
          <App />
        </Theme>
      </StylesProvider>
    </BrowserRouter>
  </React.StrictMode>,
  root
);
reportWebVitals();
