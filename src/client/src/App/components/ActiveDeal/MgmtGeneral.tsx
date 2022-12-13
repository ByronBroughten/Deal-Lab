import React from "react";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { GeneralSection } from "../appWide/GeneralSection";
import { MainSectionBtn } from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtn";
import { Mgmt } from "./MgmtGeneral/Mgmt";

type Props = { className?: string; feId: string };
export function MgmtGeneral({ feId }: Props) {
  const mgmtGeneral = useSetterSection({
    sectionName: "mgmtGeneral",
    feId,
  });
  const mgmtIds = mgmtGeneral.childFeIds("mgmt");
  const addMgmt = () => mgmtGeneral.addChild("mgmt");
  return (
    <GeneralSection
      {...{
        themeName: "mgmt",
        className: "MgmtGeneral-root",
      }}
    >
      {mgmtIds.length === 0 && <div className="GeneralSectionInfo-root" />}
      <div className="MainSection-entries">
        {mgmtIds.map((feId) => (
          <Mgmt key={feId} feId={feId} />
        ))}
      </div>
      {mgmtIds.length === 0 && (
        <MainSectionBtn
          className="MainSection-addChildBtn"
          onClick={addMgmt}
          text="+ Management Costs"
        />
      )}
    </GeneralSection>
  );
}
