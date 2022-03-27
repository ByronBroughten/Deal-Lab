import React from "react";
import MainSection from "../appWide/MainSection";
import Mgmt from "./Mgmts/Mgmt";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import MainSectionTitle from "../appWide/MainSection/MainSectionTitle";
import styled from "styled-components";

type Props = { className?: string };
export default function Mgmts(props: Props) {
  const { analyzer } = useAnalyzerContext();

  const section = analyzer.section("mgmtGeneral");
  const mgmtIds = section.childFeIds("mgmt");

  return (
    <Styled sectionName="mgmt" {...props}>
      <MainSectionTitle title="Management" sectionName="mgmt" />
      <div>
        {mgmtIds.map((id) => (
          <Mgmt key={id} id={id} />
        ))}
      </div>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  margin-top: 0px;
`;
