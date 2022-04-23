import React from "react";
import styled from "styled-components";
import { switchNames } from "../../../../sharedWithServer/SectionMetas/baseSections/switchNames";
import { FeInfo } from "../../../../sharedWithServer/SectionMetas/Info";
import BasicSectionInfo from "../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import { useOpenWidth } from "../../../appWide/SectionTitleRow";
import DollarPercentRadioSwap from "../../general/DollarPercentRadioSwap";
import VacancyRate from "./BasicMgmtInfo/VacancyRate";

type Props = { feInfo: FeInfo; className?: string };
export default function BasicMgmtInfo({ feInfo, className }: Props) {
  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const rentCut = switchNames("rentCut", "dollarsPercent");
  const rentCutDollars = switchNames(rentCut.dollars, "ongoing");
  const rentCutNames = {
    switch: rentCut.switch,
    percent: rentCut.percent,
    dollars: rentCutDollars.monthly,
  };

  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      <div className="viewable">
        {viewIsOpen && (
          <div className="BasicSectionInfo-subSections">
            <div className="BasicSectionInfo-subSection">
              <div className="BasicSectionInfo-subSection-viewable">
                <DollarPercentRadioSwap
                  {...{
                    names: rentCutNames,
                    feInfo,
                    title: "Cut of rent",
                    className: "BasicMgmtInfo-radioSwap",
                  }}
                />
              </div>
            </div>
            <div className="BasicSectionInfo-subSection">
              <div className="BasicSectionInfo-subSection-viewable">
                <VacancyRate feInfo={feInfo} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
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
