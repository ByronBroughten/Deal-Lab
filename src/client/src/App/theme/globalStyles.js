import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1;

  }

  label {
    line-height: 1;
    margin: 0;
  }

  h6 {
    font-weight: 600;
    font-size: .95em;
  }

  h5 {
    margin: 0;
    margin-block-start: 0px;
    margin-block-end: 0px;
    line-height: 1;
  }

  .MuiButton-root {
    min-width: auto;
    text-transform: none;
  }

`;

export default GlobalStyle;
