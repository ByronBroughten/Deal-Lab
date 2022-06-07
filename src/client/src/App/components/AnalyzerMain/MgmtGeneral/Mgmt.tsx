import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupNext } from "../general/ListGroupNext";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

export default function Mgmt({ feId }: { feId: string }) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <MainSection>
      <MainSectionTitleRow {...{ feInfo, pluralName: "managements" }} />
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
        <ListGroupNext
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbName="ongoingExpenses"
        />
        <ListGroupNext
          feInfo={feInfo}
          listSectionName="upfrontCostList"
          titleText="Upfront Costs"
          totalVarbName="upfrontExpenses"
        />
      </MainSectionBody>
    </MainSection>
  );
}
