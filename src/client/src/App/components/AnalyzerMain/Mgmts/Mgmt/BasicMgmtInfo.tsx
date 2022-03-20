import React from "react";
import BasicSectionInfo from "../../../appWide/MainSection/MainSectionEntry/MainEntryBody/BasicSectionInfo";
import { useOpenWidth } from "../../../appWide/SectionTitleRow";
import ToggleViewBtn from "../../../general/ToggleViewBtn";
import DollarPercentRadioSwap from "../../general/DollarPercentRadioSwap";
import VacancyRate from "./BasicMgmtInfo/VacancyRate";
import { switchNames } from "../../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/switchNames";
import { FeInfo } from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";

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
    <BasicSectionInfo
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      <div className="viewable">
        <div className="title-row">
          <h6 className="title-text">Basics</h6>
          <ToggleViewBtn {...{ viewIsOpen, onClick: trackWidthToggleView }} />
        </div>

        {viewIsOpen && (
          <div className="BasicSectionInfo-subSections">
            <div className="BasicSectionInfo-subSection">
              <div className="BasicSectionInfo-subSection-viewable">
                <DollarPercentRadioSwap
                  {...{ names: rentCutNames, feInfo, title: "Cut of rent" }}
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
    </BasicSectionInfo>
  );
}
