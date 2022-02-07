import React from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import theme from "../theme/Theme";
import MainSections from "./AnalyzerForm/MainSections";

const AnalyzerMain = () => {
  return (
    <main>
      <AnalyzerBackground>
        <MainSections />
      </AnalyzerBackground>
      <ToastContainer />
    </main>
  );
};

const AnalyzerBackground = styled.div`
  display: grid;
  position: relative;
  z-index: 0;
  background-color: ${theme.plus.light};
`;

export default AnalyzerMain;
