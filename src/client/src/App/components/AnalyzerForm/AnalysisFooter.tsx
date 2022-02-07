import React from "react";
import styled from "styled-components";
import CurrentAnalysis from "./AnalysisFooter/CurrentAnalysis";

type Props = { className?: string };
export default function CurrentAnalyses({ className }: Props) {
  return (
    <AnalysisFooter className={`AnalysisFooter-root ${className}`}>
      <CurrentAnalysis className="blockPhantom" />
      <CurrentAnalysis className="viewable" />
    </AnalysisFooter>
  );
}

const AnalysisFooter = styled.div`
  .CurrentAnalysis-root.blockPhantom {
    display: block;
    /* visibility: hidden; */
    margin: 0px;
    background: red;
  }
  .CurrentAnalysis-root.viewable {
    position: sticky;
    z-index: 1;
    bottom: 0;
    width: 100%;
    padding: 0;
  }
`;
