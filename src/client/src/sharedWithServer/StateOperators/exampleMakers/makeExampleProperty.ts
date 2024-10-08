import { sectionNames } from "../../stateSchemas/schema2SectionNames";
import { StateValue } from "../../stateSchemas/schema4ValueTraits/StateValue";
import {
  numObj,
  NumObj,
  numToObj,
} from "../../stateSchemas/schema4ValueTraits/StateValue/NumObj";
import { stringObj } from "../../stateSchemas/schema4ValueTraits/StateValue/StringObj";
import { SectionPack } from "../../StateTransports/SectionPack";
import { Arr } from "../../utils/Arr";
import { DefaultUpdaterSection } from "../DefaultUpdaters/DefaultUpdaterSection";
import { makeExample } from "./makeExample";
import { makeExampleCapExList } from "./makeExampleCapEx";

type OngoingItemProps = [string, number | NumObj][];

const propertySectionNames = Arr.extractStrict(sectionNames, [
  // these don't need to be sectionNames. They could be
  // childNames or arbitrary labels if need be
  "property",
  "unit",
  "repairValue",
  "capExValue",
  "maintenanceValue",
  "costOverrunValue",
  "sellingCostValue",
] as const);

type PropertySectionName = (typeof propertySectionNames)[number];
type NeededPropertyVarbsSchema = Partial<{
  [SN in PropertySectionName]: any;
}>;
type NeededPropertyVarbsByDealMode = {
  [DM in StateValue<"dealMode">]: NeededPropertyVarbsSchema & {
    dealMode: StateValue<"dealMode">;
  };
};

type CheckNeededPropertyVarbs<T extends NeededPropertyVarbsByDealMode> = T;

interface CommonProperty {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  displayName: string;
  dateTimeFirstSaved?: number;

  purchasePrice: NumObj;
  sqft: NumObj;
}

interface PropertyHoldAndArv {
  afterRepairValueEditor: NumObj;
  holdingPeriodMonths: NumObj;
}

interface SharedSections {
  repairValue: OngoingItemProps;
  costOverrunValue: {
    valuePercent: NumObj;
  };
}

interface HoldingSections {
  utilityHolding: OngoingItemProps;
  taxesHoldingYearly: NumObj;
  homeInsHoldingYearly: NumObj;
}

interface OngoingSections {
  taxesOngoingYearly: NumObj;
  homeInsOngoingYearly: NumObj;
  utilityOngoing: OngoingItemProps;
  capExValue: {
    valueSourceName: StateValue<"capExValueSource">;
    items: [string, number | NumObj, number | NumObj][];
  };
  maintenanceValue: {
    valueSourceName: StateValue<"maintainanceValueSource">;
  };
}

type NeededPropertyVarbs = CheckNeededPropertyVarbs<{
  homeBuyer: SharedSections &
    OngoingSections & {
      dealMode: "homeBuyer";
      property: CommonProperty & {
        likability: NumObj;
      };
      unit: { rentMonthly?: NumObj; numBedrooms: NumObj }[];
    };
  buyAndHold: SharedSections &
    OngoingSections & {
      dealMode: "buyAndHold";
      property: CommonProperty;
      unit: { rentMonthly: NumObj; numBedrooms: NumObj }[];
    };
  fixAndFlip: SharedSections &
    HoldingSections & {
      dealMode: "fixAndFlip";
      property: CommonProperty &
        PropertyHoldAndArv & {
          numUnitsEditor: NumObj;
        };
      sellingCostValue: {
        valueSourceName: StateValue<"sellingCostSource">;
        valuePercent?: NumObj;
      };
    };
  brrrr: SharedSections &
    HoldingSections &
    OngoingSections & {
      dealMode: "brrrr";
      property: CommonProperty & PropertyHoldAndArv;
      unit: { rentMonthly: NumObj; numBedrooms: NumObj }[];
    };
}>;

type Props<DM extends StateValue<"dealMode">> = NeededPropertyVarbs[DM];
export function makeExampleProperty<DM extends StateValue<"dealMode">>(
  props: Props<DM>
): SectionPack<"property"> {
  return makeExample("property", (property) => {
    const { displayName, dateTimeFirstSaved, ...rest } = props.property;
    property.updateValues({
      yearBuilt: numObj(1950),
      ...rest,
      propertyMode: props.dealMode,
      displayName: stringObj(displayName),
      ...(dateTimeFirstSaved && {
        dateTimeFirstSaved,
        dateTimeLastSaved: dateTimeFirstSaved,
      }),
    });

    const repairValue = property.onlyChild("repairValue");
    repairValue.updateValues({
      valueSourceName: "listTotal",
    });

    const repairList = repairValue.onlyChild("onetimeList");
    for (const [displayName, value] of props.repairValue) {
      const repairItem = repairList.addAndGetChild("onetimeItem");
      repairItem.updateValues({
        valueSourceName: "valueDollarsEditor",
        displayNameEditor: displayName,
        valueDollarsEditor: numToObj(value),
      });
    }

    const costOverrunValue = property.onlyChild("costOverrunValue");
    costOverrunValue.updateValues({
      valuePercentEditor: props.costOverrunValue.valuePercent,
      valueSourceName: "valuePercentEditor",
    });

    switch (props.dealMode) {
      case "buyAndHold":
      case "homeBuyer":
      case "brrrr": {
        addUtilities(property, "utilityOngoing", props.utilityOngoing);
        const taxesOngoing = property.onlyChild("taxesOngoing");
        taxesOngoing.onlyChild("valueDollarsEditor").updateValues({
          valueEditorFrequency: "yearly",
          valueEditor: props.taxesOngoingYearly,
        });
        const homeInsOngoing = property.onlyChild("homeInsOngoing");
        homeInsOngoing.onlyChild("valueDollarsEditor").updateValues({
          valueEditorFrequency: "yearly",
          valueEditor: props.homeInsOngoingYearly,
        });

        const capExValue = property.onlyChild("capExValueOngoing");
        capExValue.updateValues({
          valueSourceName: props.capExValue.valueSourceName,
        });
        const capExList = capExValue.onlyChild("capExList");
        capExList.loadSelfSectionPack(
          makeExampleCapExList("Example CapEx", props.capExValue.items)
        );

        const maintenance = property.onlyChild("maintenanceOngoing");
        maintenance.updateValues({
          valueSourceName: props.maintenanceValue.valueSourceName,
        });
      }
    }

    switch (props.dealMode) {
      case "homeBuyer":
      case "buyAndHold":
      case "brrrr": {
        for (let i = 0; i < props.unit.length; i++) {
          const { rentMonthly, ...rest } = props.unit[i];
          let unit: DefaultUpdaterSection<"unit">;
          if (i === 0) {
            unit = property.onlyChild("unit");
          } else {
            unit = property.addAndGetChild("unit");
          }

          unit.updateValues({ numBedrooms: rest.numBedrooms });
          const rentEditor = unit.onlyChild("targetRentEditor");
          rentEditor.updateValues({
            valueEditorFrequency: "monthly",
            ...(rentMonthly && { valueEditor: rentMonthly }),
          });
        }
      }
    }

    switch (props.dealMode) {
      case "fixAndFlip":
      case "brrrr": {
        addUtilities(property, "utilityHolding", props.utilityHolding);
        const { afterRepairValueEditor, holdingPeriodMonths } = props.property;
        property.updateValues({ afterRepairValueEditor });
        property.onlyChild("holdingPeriod").updateValues({
          valueEditor: holdingPeriodMonths,
          valueEditorUnit: "months",
        });
      }
    }

    if (props.dealMode === "fixAndFlip") {
      const { numUnitsEditor } = props.property;
      property.updateValues({ numUnitsEditor });

      const sellingValue = property.onlyChild("sellingCostValue");
      sellingValue.updateValues({
        valueSourceName: props.sellingCostValue.valueSourceName,
        ...(props.sellingCostValue.valuePercent && {
          valuePercentEditor: props.sellingCostValue.valuePercent,
        }),
      });
    }
  });
}

function addUtilities(
  property: DefaultUpdaterSection<"property">,
  utilityChildName: "utilityHolding" | "utilityOngoing",
  itemProps: OngoingItemProps
) {
  const utilityChild = property.onlyChild(utilityChildName);
  utilityChild.updateValues({ valueSourceName: "listTotal" });
  const utilityList = utilityChild.onlyChild("periodicList");
  for (const [displayName, value] of itemProps) {
    const periodicItem = utilityList.addAndGetChild("periodicItem", {
      sectionValues: {
        valueSourceName: "valueDollarsEditor",
        displayNameEditor: displayName,
      },
    });
    periodicItem.onlyChild("valueDollarsEditor").updateValues({
      valueEditorFrequency: "monthly",
      valueEditor: numToObj(value),
    });
  }
}
