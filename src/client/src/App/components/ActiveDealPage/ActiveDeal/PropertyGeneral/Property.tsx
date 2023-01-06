import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { ValueGroupOngoing } from "../../../appWide/ListGroup/ValueGroupOngoing";
import { ValueGroupSingleTime } from "../../../appWide/ListGroup/ValueGroupSingleTime";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionOneTime } from "../../../appWide/ValueSectionOneTime";
import { ValueSectionOngoing } from "../../../appWide/ValueSectionOngoing";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { UnitList } from "./Property/UnitList";

export function Property({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <Styled className="Property-root">
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Property",
          loadWhat: "Property",
        }}
      />
      <MainSectionBody themeName="property">
        <div className="Property-basicInfoAndUnits">
          <BasicPropertyInfo feId={feId} className="Property-basicInfo" />
          <UnitList feInfo={feInfo} />
        </div>
        <ValueGroupSingleTime
          {...{
            className: "Property-upfrontCostsGroup",
            feId: property.onlyChild("upfrontExpenseGroup").feId,
            titleText: "Upfront Costs",
            extraValueChildren: (
              <ValueSectionOneTime
                {...{
                  displayName: "Repairs",
                  feId: property.onlyChild("repairCostValue").feId,
                  className: "ValueGroup-value",
                  showXBtn: false,
                }}
              />
            ),
          }}
        />
        <ValueGroupOngoing
          {...{
            className: "Property-ongoingCostGroup",
            feId: property.onlyChild("ongoingExpenseGroup").feId,
            titleText: "Ongoing Costs",
            extraValueChildren: (
              <>
                <ValueSectionOngoing
                  {...{
                    displayName: "CapEx",
                    feId: property.onlyChild("capExCostValue").feId,
                    className: "ValueGroup-value",
                    showXBtn: false,
                  }}
                />
                <ValueSectionOngoing
                  {...{
                    displayName: "Maintenance",
                    feId: property.onlyChild("maintenanceCostValue").feId,
                    className: "ValueGroup-value",
                    showXBtn: false,
                  }}
                />
                <ValueSectionOngoing
                  {...{
                    displayName: "Utilities",
                    feId: property.onlyChild("utilityCostValue").feId,
                    className: "ValueGroup-value",
                    showXBtn: false,
                  }}
                />
              </>
            ),
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .Property-basicInfoAndUnits {
    display: flex;
    flex-wrap: wrap;
  }
  .Property-basicInfo {
    margin: ${theme.flexElementSpacing};
    margin-right: ${theme.s3};
  }
  .Property-upfrontCostsGroup,
  .Property-ongoingCostGroup {
    margin-top: ${theme.s3};
  }
`;
