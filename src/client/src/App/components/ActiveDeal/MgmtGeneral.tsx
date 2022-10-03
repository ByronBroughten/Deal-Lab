import React from "react";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { GeneralSection } from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
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
      <GeneralSectionTitle {...{ title: "Management", themeName: "mgmt" }} />
      {mgmtIds.length === 0 && <div className="GeneralSectionInfo-root" />}
      <div className="MainSection-entries">
        {mgmtIds.map((feId) => (
          <Mgmt key={feId} feId={feId} />
        ))}
      </div>
      <div className="GeneralSection-addEntryBtnDiv">
        <MainSectionTitleBtn
          themeName="mgmt"
          className="MainSection-addChildBtn"
          onClick={addMgmt}
          text="Add Management Costs"
        />
      </div>
    </GeneralSection>
  );
}
