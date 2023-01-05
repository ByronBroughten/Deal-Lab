import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionZone } from "../../../appWide/ValueSectionZone";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

export function Mgmt({ feId }: { feId: string }) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  const mgmt = useGetterSection(feInfo);
  return (
    <Styled>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Mgmt",
          loadWhat: "Management",
        }}
      />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="ListGroup-root" />
        <ValueSectionZone
          {...{
            ...feInfo,
            childName: "ongoingExpenseValue",
            displayName: "Other Ongoing Expenses",
            plusBtnText: "+ Other ongoing expenses",
            className: "Mgmt-ongoingExpenseValue",
          }}
        />
        <ValueSectionZone
          {...{
            ...feInfo,
            childName: "upfrontExpenseValue",
            displayName: "One-time expenses",
            plusBtnText: "+ One-time expenses",
            className: "Mgmt-oneTimeExpenseValue",
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

  .Mgmt-oneTimeExpenseValue {
    margin-left: ${theme.s3};
  }

  .ValueSectionBtn-root {
    width: 150px;
  }
`;
