import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoing } from "../../appWide/ListGroup/ListGroupOngoing";
import { ListGroupSingleTime } from "../../appWide/ListGroup/ListGroupSingleTime";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

export default function Mgmt({ feId }: { feId: string }) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <MainSection>
      <MainSectionTitleRow {...{ ...feInfo, pluralName: "managements" }} />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="ListGroup-root" />
        <ListGroupOngoing
          listParentInfo={feInfo}
          listAsChildName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbNameBase="expenses"
          themeName="mgmt"
        />
        <ListGroupSingleTime
          listParentInfo={feInfo}
          listAsChildName="upfrontCostList"
          totalVarbName="upfrontExpenses"
          titleText="Upfront Costs"
          themeName="mgmt"
        />
      </MainSectionBody>
    </MainSection>
  );
}
