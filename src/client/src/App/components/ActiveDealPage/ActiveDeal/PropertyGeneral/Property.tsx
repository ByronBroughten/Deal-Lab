import React from "react";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { ValueGroupOngoing } from "../../../appWide/ListGroup/ValueGroupOngoing";
import { ValueGroupSingleTime } from "../../../appWide/ListGroup/ValueGroupSingleTime";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { SingleTimeValue } from "../../../appWide/SingleTimeValue";
import { ValueOngoingSection } from "../../../appWide/ValueOngoingSection";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { UnitList } from "./Property/UnitList";

export function Property({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <MainSection>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Property",
          loadWhat: "Property",
        }}
      />
      <MainSectionBody themeName="property">
        <div className="ListGroup-lists">
          <BasicPropertyInfo feId={feId} className="MainSectionGroup" />
        </div>
        <UnitList feInfo={feInfo} />
        <ValueGroupSingleTime
          {...{
            feId: property.onlyChild("upfrontExpenseGroup").feId,
            titleText: "Upfront Costs",
            extraValueChildren: (
              <SingleTimeValue
                {...{
                  displayName: "Repairs",
                  feId: property.onlyChild("repairCostValue").feId,
                  className: "ValueGroup-value",
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
                <ValueOngoingSection
                  {...{
                    displayName: "Utilities",
                    feId: property.onlyChild("utilityCostValue").feId,
                    className: "ValueGroup-value",
                  }}
                />
                <ValueOngoingSection
                  {...{
                    displayName: "CapEx",
                    feId: property.onlyChild("capExCostValue").feId,
                    className: "ValueGroup-value",
                  }}
                />
              </>
            ),
          }}
        />
      </MainSectionBody>
    </MainSection>
  );
}
