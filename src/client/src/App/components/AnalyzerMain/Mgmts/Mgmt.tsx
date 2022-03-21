import React from "react";
import MainSectionEntry from "../../appWide/MainSection/MainSectionEntry";
import MainEntryBody from "../../appWide/MainSection/MainSectionEntry/MainEntryBody";
import MainEntryTitleRow from "../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import ListGroup from "../general/ListGroup";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

const sectionName = "mgmt";
export default function Mgmt({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  return (
    <MainSectionEntry>
      <MainEntryTitleRow {...{ feInfo, pluralName: "Mgmts" }} />
      <MainEntryBody>
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
          titleText="Upfront Costs:"
          totalVarbName="upfrontExpenses"
        />
        <ListGroup
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs:"
          totalVarbName="ongoingExpenses"
        />
      </MainEntryBody>
    </MainSectionEntry>
  );
}
