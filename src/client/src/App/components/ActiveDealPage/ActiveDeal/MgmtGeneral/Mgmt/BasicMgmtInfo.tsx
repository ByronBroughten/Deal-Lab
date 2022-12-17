import React from "react";
import styled from "styled-components";
import { switchNames } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import { useOpenWidth } from "../../../../appWide/customHooks/useOpenWidth";
import BasicSectionInfo from "../../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import { MainSectionTitleEditor } from "../../../../appWide/GeneralSection/MainSection/MainSectionTitleRow/MainSectionTitleEditor";
import { DollarPercentRadioSwap } from "../../general/DollarPercentRadioSwap";
import VacancyRate from "./BasicMgmtInfo/VacancyRate";

type Props = { feId: string; className?: string };
export default function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = {
    sectionName: "mgmt",
    feId,
  } as const;

  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const rentCut = switchNames("rentCut", "dollarsPercent");
  const rentCutDollars = switchNames(rentCut.dollars, "ongoing");
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      {viewIsOpen && (
        <div className="BasicSectionInfo-viewable viewable">
          <div className="BasicSectionInfo-subSections">
            <MainSectionTitleEditor
              className="MainSectionTitleRow-title"
              feInfo={feInfo}
            />
            <div className="BasicSectionInfo-subSection">
              <div className="BasicSectionInfo-subSection-viewable">
                <DollarPercentRadioSwap
                  {...{
                    names: {
                      switch: rentCut.switch,
                      percent: rentCut.percent,
                      dollars: rentCutDollars.monthly,
                      dollarsEditor: "rentCutDollarsEditor",
                      percentEditor: "rentCutPercentEditor",
                    },
                    feInfo,
                    title: "Cut of rent",
                    className: "BasicMgmtInfo-radioSwap",
                  }}
                />
              </div>
            </div>
            <div className="BasicSectionInfo-subSection">
              <div className="BasicSectionInfo-subSection-viewable">
                <VacancyRate feId={feId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .BasicSectionInfo-subSections {
  }

  .BasicSectionInfo-subSection {
  }
  .BasicMgmtInfo-radioSwap {
    .MuiInputBase-root {
      min-width: 85px;
    }
  }
  .VacancyRate-root {
    .MuiInputBase-root {
      min-width: 123px;
    }
  }
`;
