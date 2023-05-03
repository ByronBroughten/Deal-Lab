import { sectionNames } from "../../SectionsMeta/SectionName";
import { StateValue } from "../../SectionsMeta/values/StateValue";
import { NumObj, numToObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { Arr } from "../../utils/Arr";
import { makeDefaultProperty } from "../makeDefaultProperty";

const propertySectionNames = Arr.extractStrict(sectionNames, [
  // these don't need to be sectionNames. They could be
  // childNames or arbitrary labels if need be
  "property",
  "unit",
  "repairValue",
  "utilityValue",
  "capExValue",
  "maintenanceValue",
  "costOverrunValue",
  "sellingCostValue",
] as const);

type PropertySectionName = typeof propertySectionNames[number];
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
  taxesYearly: NumObj;
  homeInsYearly: NumObj;
}

interface SharedSections {
  repairValue: [string, number | NumObj][];
  utilityValue: [string, number | NumObj][];
  costOverrunValue: {
    valuePercent: NumObj;
  };
}

type NeededPropertyVarbs = CheckNeededPropertyVarbs<{
  buyAndHold: SharedSections & {
    dealMode: "buyAndHold";
    property: CommonProperty;
    unit: { rentMonthly: NumObj; numBedrooms: NumObj }[];
    capExValue: {
      valueSourceName: StateValue<"capExValueSource">;
      items: [string, number | NumObj, number | NumObj][];
    };
    maintenanceValue: {
      valueSourceName: StateValue<"maintainanceValueSource">;
    };
  };
  fixAndFlip: SharedSections & {
    dealMode: "fixAndFlip";
    property: CommonProperty & {
      afterRepairValue: NumObj;
      holdingPeriodMonths: NumObj;
      numUnitsEditor: NumObj;
    };

    sellingCostValue: {
      valueSourceName: StateValue<"sellingCostSource">;
      valuePercent?: NumObj;
    };
  };
}>;

type Props<DM extends StateValue<"dealMode">> = NeededPropertyVarbs[DM];
export function makeExampleProperty<DM extends StateValue<"dealMode">>(
  props: Props<DM>
) {
  const {
    displayName,
    taxesYearly,
    homeInsYearly,
    dateTimeFirstSaved,
    ...rest
  } = props.property;
  const property = PackBuilderSection.initAsOmniChild("property");
  property.loadSelf(makeDefaultProperty());
  property.updateValues({
    ...rest,
    propertyMode: props.dealMode,
    displayName: stringObj(displayName),
    taxesOngoingSwitch: "yearly",
    taxesOngoingEditor: taxesYearly,
    homeInsOngoingSwitch: "yearly",
    homeInsOngoingEditor: homeInsYearly,
    ...(dateTimeFirstSaved && {
      dateTimeFirstSaved,
      dateTimeLastSaved: dateTimeFirstSaved,
    }),
  });

  const repairValue = property.onlyChild("repairValue");
  repairValue.updateValues({
    valueSourceName: "listTotal",
  });

  const repairList = repairValue.onlyChild("singleTimeList");
  for (const [displayName, value] of props.repairValue) {
    const repairItem = repairList.addAndGetChild("singleTimeItem");
    repairItem.updateValues({
      valueSourceName: "valueEditor",
      displayNameEditor: displayName,
      valueEditor: numToObj(value),
    });
  }

  const utilityValue = property.onlyChild("utilityValue");
  utilityValue.updateValues({ valueSourceName: "listTotal" });
  const utilityList = utilityValue.onlyChild("ongoingList");
  for (const [displayName, value] of props.utilityValue) {
    const utilityItem = utilityList.addAndGetChild("ongoingItem");
    utilityItem.updateValues({
      valueSourceName: "valueEditor",
      valueOngoingSwitch: "monthly",
      displayNameEditor: displayName,
      valueOngoingEditor: numToObj(value),
    });
  }

  const costOverrunValue = property.onlyChild("costOverrunValue");
  costOverrunValue.updateValues({
    valuePercentEditor: props.costOverrunValue.valuePercent,
    valueSourceName: "valuePercentEditor",
  });

  if (props.dealMode === "buyAndHold") {
    for (const { rentMonthly, ...rest } of props.unit) {
      const unit = property.addAndGetChild("unit");
      unit.updateValues({
        ...rest,
        targetRentOngoingSwitch: "monthly",
        targetRentOngoingEditor: rentMonthly,
      });
    }

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
        valueOngoingSwitch: "yearly",
        lifespanSpanSwitch: "years",
      });
    }

    const maintenance = property.onlyChild("maintenanceValue");
    maintenance.updateValues({
      valueSourceName: props.maintenanceValue.valueSourceName,
    });
  }

  if (props.dealMode === "fixAndFlip") {
    const { afterRepairValue, holdingPeriodMonths, numUnitsEditor } =
      props.property;
    property.updateValues({
      numUnitsEditor,
      afterRepairValue,
      holdingPeriodSpanEditor: holdingPeriodMonths,
      holdingPeriodSpanSwitch: "months",
    });

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
