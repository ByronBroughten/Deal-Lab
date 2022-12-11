import { createGlobalStyle } from "styled-components";
import RobotoTTF from "./Roboto/Roboto-Regular.ttf";
import SourceSansProTTF from "./SourceSansPro/SourceSansPro-Regular.ttf";

export const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: "Source Sans Pro";
    src: url(${SourceSansProTTF}) format("truetype");
  }
  @font-face {
    font-family: "Roboto";
    src: url(${RobotoTTF}) format("truetype");
  }
`;
