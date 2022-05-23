import React from "react";
import { useSectionSetter } from "../../../sharedWithServer/SectionFocal/SectionSetter";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRowNext } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowNext";
import ListGroup from "../general/ListGroup";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

// turn mgmt back to how it was
// add and test the editor update function
// implement a bigStringEditor update
// implement a numObj update in one of the basicInfos
// implement some kind of list—maybe units would be best at that point
// it's the simplest.
// see if the totals add up right.
// implement price
// implement outputList

// then put in the first list on the first property
// and just put that in the current property.
// I think that's the way to go.
// I'll get to see a bit of its functionality.
// Do it with one of the upfront cost lists. There should be two.

// you'll still have to make a new editor for it to work
// unless your new list item lacks editors for now.

export default function Mgmt({ feId }: { feId: string }) {
  const sectionName = "mgmt";
  const mgmt = useSectionSetter({ sectionName, feId });
  const { feInfo } = mgmt;

  // this won't really work unless I convert everything.
  // otherwise there will be all kinds of errors from passing
  // in ids and sectionNames that don't exist on analyzer state
  // I guess I don't have to mind that the handlers and
  // stuff like that will be broken. But I need the
  // sections to populate properly

  return (
    <MainSection>
      <MainSectionTitleRowNext
        {...{ info: feInfo, pluralName: "managements" }}
      />
      <MainSectionBody>
        <div className="ListGroup-root">
          <div className="ListGroup-viewable">
            {/* <div className="ListGroup-titleRow">
              <h6 className="ListGroup-titleText">Basic Info</h6>
            </div> */}
            <div className="ListGroup-lists">
              <BasicMgmtInfo feInfo={feInfo} className="ListGroup-root" />
            </div>
          </div>
        </div>
        <ListGroup
          feInfo={feInfo}
          listSectionName="ongoingCostList"
          titleText="Ongoing Costs"
          totalVarbName="ongoingExpenses"
        />
        <ListGroup
          feInfo={feInfo}
          listSectionName="upfrontCostList"
          titleText="Upfront Costs"
          totalVarbName="upfrontExpenses"
        />
      </MainSectionBody>
    </MainSection>
  );
}
