import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { ValueGroupOngoing } from "../../../appWide/ListGroup/ValueGroupOngoing";
import { ValueGroupSingleTime } from "../../../appWide/ListGroup/ValueGroupSingleTime";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionOneTime } from "../../../appWide/ValueSectionOneTime";
import { ValueSectionOngoing } from "../../../appWide/ValueSectionOngoing";
import { BackToDealBtn } from "../BackToDealBtn";
import {
  CompletionStatus,
  MainDealSection,
  MainDealSectionProps,
} from "../MainDealSection";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { Units } from "./Property/Units";

// function getPropertyCompletionStatus(
//   property: GetterSection<"property">
// ): CompletionStatus {
//   let allEmpty = true;
//   let allValid = true;
//   const updateBools = ({
//     isEmpty,
//     isValid,
//   }: {
//     isEmpty: boolean;
//     isValid: boolean;
//   }) => {
//     if (!isEmpty) allEmpty = false;
//     if (!isValid) allValid = false;
//   };

//   const varbNames = [
//     "price",
//     "taxesOngoingEditor",
//     "homeInsOngoingEditor",
//     "sqft",
//   ] as const;
//   for (const varbName of varbNames) {
//     updateBools(property.checkInputValue(varbName));
//   }
//   const units = property.children("unit");
//   if (units.length === 0) {
//     updateBools({ isEmpty: true, isValid: false });
//   }

//   const unitVarbNames = ["targetRentOngoingEditor", "numBedrooms"] as const;
//   for (const unit of units) {
//     for (const varbName of unitVarbNames) {
//       updateBools(unit.checkInputValue(varbName));
//     }
//   }
//   const repairsValue = property.onlyChild("repairCostValue");
//   const isItemized = repairsValue.valueNext("isItemized");
//   if (!isItemized) {
//     updateBools(repairsValue.checkInputValue("valueEditor"));
//   }

//   const childNames = [
//     "capExCostValue",
//     "maintenanceCostValue",
//     "utilityCostValue",
//   ] as const;
//   for (const childName of childNames) {
//     const ongoingValue = property.onlyChild(childName);
//     const isItemized = ongoingValue.valueNext("isItemized");
//     if (!isItemized) {
//       updateBools(ongoingValue.checkInputValue("valueEditor"));
//     }
//   }
//   if (allEmpty) return "allEmpty";
//   if (allValid) return "allValid";
//   else return "someInvalid";
// }

export function Property({
  feId,
  showInputs,
  openInputs,
  closeInputs,
  hide,
  completionStatus,
}: MainDealSectionProps & {
  closeInputs: () => void;
  completionStatus: CompletionStatus;
}) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  const completionStatusProps = {
    allEmpty: { title: "Start Property" },
    someInvalid: { title: "Continue Property" },
    allValid: { title: "Edit Property" },
  };

  const props = completionStatusProps[completionStatus];
  return (
    <Styled
      {...{
        ...feInfo,
        showInputs,
        openInputs,
        closeInputs,
        btnTitle: props.title,
        sectionTitle: "Property",
        hide,
        className: "Property-root",
        displayName: property.valueNext("displayName").mainText,
        completionStatus,
        detailVarbPropArr: property.varbInfoArr([
          "targetRentYearly",
          "expensesYearly",
          "upfrontExpenses",
        ] as const),
      }}
    >
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Property",
          loadWhat: "Property",
          showControls: showInputs ? true : false,
          rightTop: <BackToDealBtn onClick={closeInputs} />,
        }}
      />
      <MainSectionBody themeName="property">
        <BasicPropertyInfo feId={feId} className="Property-basicInfo" />
        <Units {...{ feId }} />
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

const Styled = styled(MainDealSection)<{
  $showInputs?: boolean;
  $hide?: boolean;
}>`
  .Property-unitList {
  }

  .Property-basicInfo {
  }
  .Property-upfrontCostsGroup,
  .Property-ongoingCostGroup {
    margin-top: ${theme.s3};
  }
`;
