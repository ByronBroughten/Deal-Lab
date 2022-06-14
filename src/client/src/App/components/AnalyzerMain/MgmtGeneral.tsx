import React from "react";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import Mgmt from "./MgmtGeneral/Mgmt";

type Props = { className?: string; feId: string };
export function MgmtGeneral({ feId }: Props) {
  const mgmtGeneral = useSetterSection({
    sectionName: "mgmtGeneral",
    feId,
  });
  const mgmtIds = mgmtGeneral.childFeIds("mgmt");
  return (
    <MainSection
      {...{
        themeName: "mgmt",
        className: "MgmtGeneral-root",
      }}
    >
      <GeneralSectionTitle {...{ title: "Management", themeName: "mgmt" }} />
      <div>
        {mgmtIds.map((feId) => (
          <Mgmt key={feId} feId={feId} />
        ))}
      </div>
    </MainSection>
  );
}
