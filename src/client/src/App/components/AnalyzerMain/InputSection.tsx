import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import Mgmt from "./MgmtGeneral/Mgmt";

type Props = {
  title: string;
  sectionName: "mgmt";
  className?: string;
};

export default function InputSection({ title, sectionName, className }: Props) {
  const { analyzer } = useAnalyzerContext();

  const section = analyzer.parent(sectionName);
  const sectionIds = section.childFeIds(sectionName);

  return (
    <MainSection {...{ sectionName, className }}>
      <GeneralSectionTitle {...{ title, sectionName }} />
      <div className="MainSection-entries">
        {sectionIds.map((feId) => {
          return sectionName === "mgmt" ? (
            <Mgmt {...{ feId, key: feId }} />
          ) : null;
        })}
      </div>
    </MainSection>
  );
}
