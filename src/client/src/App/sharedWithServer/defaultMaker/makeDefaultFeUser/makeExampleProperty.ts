import { sectionNames } from "../../SectionsMeta/SectionName";
import { StateValue } from "../../SectionsMeta/values/StateValue";
import { NumObj, numToObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { Arr } from "../../utils/Arr";
import { makeDefaultProperty } from "../makeDefaultProperty";

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
  afterRepairValue: NumObj;
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
      property: CommonProperty & { numBedroomsEditor: NumObj };
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

function addUtilities(
  property: PackBuilderSection<"property">,
  utilityChildName: "utilityHolding" | "utilityOngoing",
  itemProps: OngoingItemProps
) {
  const utilityChild = property.onlyChild(utilityChildName);
  utilityChild.updateValues({ valueSourceName: "listTotal" });
  const utilityList = utilityChild.onlyChild("ongoingList");
  for (const [displayName, value] of itemProps) {
    const utilityItem = utilityList.addAndGetChild("ongoingItem");
    utilityItem.updateValues({
      valueSourceName: "valueEditor",
      valuePeriodicSwitch: "monthly",
      displayNameEditor: displayName,
      valuePeriodicEditor: numToObj(value),
    });
  }
}

type Props<DM extends StateValue<"dealMode">> = NeededPropertyVarbs[DM];
export function makeExampleProperty<DM extends StateValue<"dealMode">>(
  props: Props<DM>
) {
  const { displayName, dateTimeFirstSaved, ...rest } = props.property;
  const property = PackBuilderSection.initAsOmniChild("property");
  property.loadSelf(makeDefaultProperty());
  property.updateValues({
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
    const repairItem = repairList.addAndGetChild("singleTimeItem");
    repairItem.updateValues({
      valueSourceName: "valueEditor",
      displayNameEditor: displayName,
      valueEditor: numToObj(value),
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
      taxesOngoing.updateValues({
        valueDollarsPeriodicSwitch: "yearly",
        valueDollarsPeriodicEditor: props.taxesOngoingYearly,
      });
      const homeInsOngoing = property.onlyChild("homeInsOngoing");
      homeInsOngoing.updateValues({
        valueDollarsPeriodicSwitch: "yearly",
        valueDollarsPeriodicEditor: props.homeInsOngoingYearly,
      });

      const capExValue = property.onlyChild("capExValue");
      capExValue.updateValues({
        valueSourceName: props.capExValue.valueSourceName,
      });
      const capExList = capExValue.onlyChild("capExList");
      for (const [displayName, lifeSpan, replacementCost] of props.capExValue
        .items) {
        const item = capExList.addAndGetChild("capExItem");
        item.updateValues({
          displayNameEditor: displayName,
          costToReplace: numToObj(replacementCost),
          lifespanSpanEditor: numToObj(lifeSpan),
          valuePeriodicSwitch: "yearly",
          lifespanSpanSwitch: "years",
        });
      }

      const maintenance = property.onlyChild("maintenanceValue");
      maintenance.updateValues({
        valueSourceName: props.maintenanceValue.valueSourceName,
      });
    }
  }

  switch (props.dealMode) {
    case "buyAndHold":
    case "brrrr": {
      for (const { rentMonthly, ...rest } of props.unit) {
        const unit = property.addAndGetChild("unit");
        unit.updateValues({
          ...rest,
          targetRentPeriodicSwitch: "monthly",
          targetRentPeriodicEditor: rentMonthly,
        });
      }
    }
  }

  switch (props.dealMode) {
    case "fixAndFlip":
    case "brrrr": {
      addUtilities(property, "utilityHolding", props.utilityHolding);
      const { afterRepairValue, holdingPeriodMonths } = props.property;
      property.updateValues({
        afterRepairValue,
        holdingPeriodSpanEditor: holdingPeriodMonths,
        holdingPeriodSpanSwitch: "months",
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

  return property.makeSectionPack();
}
