import React from "react";
import styled from "styled-components";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { ListGroupOngoingZone } from "../general/ListGroupOngoingZone";
import { ListGroupSingleTimeZone } from "../general/ListGroupSingleTimeZone";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

export function Mgmt({ feId }: { feId: string }) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled>
      <MainSectionTitleRow
        {...{
          ...feInfo,
          sectionTitle: "Management",
          pluralName: "managements",
          xBtn: true,
        }}
      />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="ListGroup-root" />
        <ListGroupOngoingZone
          {...{
            ...feInfo,
            childName: "ongoingCostListGroup",
            themeName: "mgmt",
            btnText: "+ Ongoing Costs",
            titleText: "Ongoing Costs",
          }}
        />
        <ListGroupSingleTimeZone
          {...{
            ...feInfo,
            childName: "upfrontCostListGroup",
            themeName: "mgmt",
            btnText: "+ Upfront Costs",
            titleText: "Upfront Costs",
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  :hover {
    .MainSectionTitleRow-xBtn {
      visibility: visible;
    }
  }
`;
