import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoing } from "../../appWide/ListGroup/ListGroupOngoing";
import { ListGroupSingleTime } from "../../appWide/ListGroup/ListGroupSingleTime";
import { useGetterSection } from "./../../../sharedWithServer/stateClassHooks/useGetterSection";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

export function Mgmt({ feId }: { feId: string }) {
  const mgmt = useGetterSection({ sectionName: "mgmt", feId });
  return (
    <MainSection>
      <MainSectionTitleRow {...{ ...mgmt.feInfo, pluralName: "managements" }} />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="ListGroup-root" />
        <ListGroupOngoing
          feId={mgmt.onlyChild("ongoingCostListGroup").feId}
          titleText="Ongoing Costs"
          themeName="mgmt"
        />
        <ListGroupSingleTime
          feId={mgmt.onlyChild("upfrontCostListGroup").feId}
          titleText="Upfront Costs"
          themeName="mgmt"
        />
      </MainSectionBody>
    </MainSection>
  );
}
