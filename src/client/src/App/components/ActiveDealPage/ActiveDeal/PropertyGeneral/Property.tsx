import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
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
    <Styled>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Property",
          loadWhat: "Property",
        }}
      />
      <MainSectionBody themeName="property">
        <div className="Property-basicInfoAndUnits">
          <div className="ListGroup-lists">
            <BasicPropertyInfo feId={feId} className="MainSectionGroup" />
          </div>
          <UnitList feInfo={feInfo} />
        </div>
        <ValueGroupSingleTime
          {...{
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
  .MainSectionBody-root {
    flex-direction: column;
  }
  .MainSectionBody-inner {
    flex-direction: column;
  }

  .Property-basicInfoAndUnits {
    display: flex;
    flex-wrap: wrap;
  }
`;
