import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { useSectionSetter } from "../../sharedWithServer/SectionFocal/SectionSetter";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import Mgmt from "./MgmtGeneral/Mgmt";

type Props = { className?: string; feId: string };
export function MgmtGeneral({ className, feId }: Props) {
  const sectionName = "mgmtGeneral";
  const { analyzer } = useAnalyzerContext();
  const mgmtGeneral = useSectionSetter({ sectionName, feId });

  const section = analyzer.parent("mgmt");
  const sectionIds = section.childFeIds("mgmt");

  const mgmtIds = mgmtGeneral.childFeIds("mgmt");
  return (
    <MainSection {...{ sectionName: "mgmt", className }}>
      <GeneralSectionTitle {...{ title: "Management", sectionName }} />
      <div className="MainSection-entries">
        {mgmtIds.map((feId) => {
          <Mgmt {...{ id: feId, key: feId }} />;
        })}
      </div>
    </MainSection>
  );
}
