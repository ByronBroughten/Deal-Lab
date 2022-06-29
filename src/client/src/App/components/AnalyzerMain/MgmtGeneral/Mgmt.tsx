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
      <MainSectionBody>
        <div className="ListGroup-root">
          <div className="ListGroup-viewable">
            {/* <div className="ListGroup-titleRow">
              <h6 className="ListGroup-titleText">Basic Info</h6>
            </div> */}
            <div className="ListGroup-lists">
              <BasicMgmtInfo feId={feId} className="ListGroup-root" />
            </div>
          </div>
        </div>
        <ListGroupOngoing
          parentInfo={feInfo}
          sectionName="ongoingCostList"
          titleText="Ongoing Costs"
          itemName="ongoingItem"
          totalVarbNameBase="ongoingExpenses"
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
