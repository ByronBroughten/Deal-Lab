import React from "react";
import UnitList from "./Property/UnitList";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import MainEntryBody from "../../../appWide/MainSection/MainSectionEntry/MainEntryBody";
import MainSectionEntry from "../../../appWide/MainSection/MainSectionEntry";
import MainEntryTitleRow from "../../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import ListGroup from "../general/ListGroup";

const sectionName = "property";
export default function Property({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  return (
    <MainSectionEntry>
      <MainEntryTitleRow {...{ feInfo, pluralName: "Properties" }} />
      <MainEntryBody>
        <BasicPropertyInfo feInfo={feInfo} className="ListGroup-root" />
        <UnitList feInfo={feInfo} className="ListGroup-root" />
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
