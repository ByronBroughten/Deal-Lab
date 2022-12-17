import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../theme/Theme";
import { DealGeneral } from "./ActiveDeal/DealGeneral";
import Financing from "./ActiveDeal/Financing";
import { MgmtGeneral } from "./ActiveDeal/MgmtGeneral";
import { PropertyGeneral } from "./ActiveDeal/PropertyGeneral";
import { MainSection } from "./appWide/GeneralSection/MainSection";
import { MainSectionTitleRow } from "./appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { MainSectionTitleEditor } from "./appWide/GeneralSection/MainSection/MainSectionTitleRow/MainSectionTitleEditor";
import { PageMainFn } from "./general/PageMain";

type Props = {
  feId: string;
  loginSuccess?: boolean;
  className?: string;
};
export function ActiveDeal({ className, feId }: Props) {
  const feInfo = { sectionName: "deal", feId } as const;
  const deal = useGetterSection(feInfo);
  return (
    <Styled {...{ className: `MainSections-root ${className ?? ""}` }}>
      <MainSection className="ActiveDeal-root">
        <MainSectionTitleRow
          {...{
            ...feInfo,
            sectionTitle: "Deal",
            pluralName: "deals",
            className: "ActiveDeal-mainSectionTitleRow",
          }}
        />
        <MainSectionTitleEditor
          className="ActiveDeal-mainSectionTitleEditor"
          feInfo={feInfo}
        />
        <div className="ActiveDeal-inputSectionsWrapper">
          {/* <div className="ActiveDeal-inputSections" style={{ flex: 0 }}> */}
          <PropertyGeneral feId={deal.onlyChildFeId("propertyGeneral")} />
          <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
          <Financing feId={deal.onlyChildFeId("financing")} />
          {/* </div> */}
        </div>
        <DealGeneral feId={feId} />
      </MainSection>
    </Styled>
  );
}

const Styled = styled(PageMainFn)`
  display: flex;
  flex: 0;
  background: ${theme.light};
  .ActiveDeal-root {
    background: ${theme.mainBackground};
    margin-top: ${theme.s1};
    padding-bottom: none;
    border-top-right-radius: ${theme.br0};
    box-shadow: none;
  }
  .PropertyGeneral-root {
    padding-top: ${theme.s4};
  }

  .ActiveDeal-mainSectionTitleEditor {
    margin-left: ${theme.s3};
    margin-top: ${theme.s3};
  }

  .ActiveDeal-mainSectionTitleRow {
    margin-left: ${theme.s3};
    .SectionTitleRow-sectionTitle {
      font-size: 22px;
    }
    .ListMenuBtn-root {
      background-color: ${theme.mainBackground};
      :hover {
        background-color: ${theme.primaryNext};
      }
    }
  }

  .ActiveDeal-inputSections {
  }
  .ActiveDeal-inputSectionsWrapper {
    margin: auto;
  }
  .DealGeneral-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
