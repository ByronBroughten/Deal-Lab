import React from "react";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleRow from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import ListGroup from "../general/ListGroup";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

const sectionName = "mgmt";
export default function Mgmt({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  return (
    <MainSection>
      <MainSectionTitleRow {...{ feInfo, pluralName: "managements" }} />
      <MainSectionBody>
        <div className="ListGroup-root">
          <div className="ListGroup-viewable">
            <div className="ListGroup-titleRow">
              <h6 className="ListGroup-titleText">Basic Info</h6>
            </div>
            <div className="ListGroup-lists">
              <BasicMgmtInfo feInfo={feInfo} className="ListGroup-root" />
            </div>
          </div>
        </div>
        <ListGroup
          feInfo={feInfo}
          listSectionName="upfrontCostList"
          titleText="Upfront Costs"
          totalVarbName="upfrontExpenses"
        />
        <ListGroup
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbName="ongoingExpenses"
        />
      </MainSectionBody>
    </MainSection>
  );
}
