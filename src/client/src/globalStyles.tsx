import { GlobalStyles } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { createGlobalStyle } from "styled-components";
// @ts-ignore
import RobotoTTF from "./fonts/Roboto/Roboto-Regular.ttf";
// @ts-ignore
import SourceSansProTTF from "./fonts/SourceSansPro/SourceSansPro-Regular.ttf";

export const muiTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
    @font-face {
      font-family: 'Source Sans Pro';
      src: url(${SourceSansProTTF}) format(truetype);
    }
    @font-face {
      font-family: 'Roboto';
      src: url(${RobotoTTF}) format(truetype);
    }
  `,
    },
  },
  typography: {
    fontFamily: `Source Sans Pro, Roboto, san-serif`,
  },
});

export const muiGlobalStyles = (
  <GlobalStyles
    styles={{
      html: {
        height: "100%",
        margin: 0,
        padding: 0,
      },
      body: {
        height: "100%",
        margin: 0,
        padding: 0,
        lineHeight: 1,
      },
      label: {
        lineHeight: 1,
        margin: 0,
      },
      "& .MuiButton-root": {
        minWidth: "auto",
        textTransform: "none",
      },
    }}
  />
);

export const StyledComponentsGlobalStyle = createGlobalStyle`  
  html, body {
    height: 100%
    margin: 0;
    padding: 0;
  }
  body {
    line-height: 1;
  }
  label {
    line-height: 1;
    margin: 0;
  }
  .MuiButton-root {
    min-width: auto;
    text-transform: none;
  }

`;
