import { createGlobalStyle } from "styled-components";
import SourceSansProTTF from "./SourceSansPro-Regular.ttf";

export const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: "Source Sans Pro";
    src: url(${SourceSansProTTF}) format("truetype");
  }
`;
