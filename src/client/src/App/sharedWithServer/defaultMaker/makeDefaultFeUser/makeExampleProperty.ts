import { SectionValues } from "../../SectionsMeta/values/StateValue";
import {
  NumObj,
  numObj,
  numToObj,
} from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import {
  CapExValueMode,
  MaintenanceValueMode,
} from "../../SectionsMeta/values/StateValue/subStringValues";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { StrictPick } from "../../utils/types";
import { makeDefaultProperty } from "../makeDefaultProperty";
import {
  examplePropertyCapExListProps,
  examplePropertyUtilityProps,
  examplePropetyRepairProps,
} from "./makeExampleOngoingListsProps";

type ExamplePropertyProps = {
  property: StrictPick<
    SectionValues<"property">,
    | "displayName"
    | "purchasePrice"
    | "sqft"
    | "taxesOngoingEditor"
    | "homeInsOngoingEditor"
  >;
  units: { numBedrooms: NumObj; monthlyRent: NumObj }[];
  repairs: readonly (readonly [string, number | NumObj])[];
  utilities: readonly (readonly [string, number | NumObj])[];
  capEx: {
    valueMode: CapExValueMode;
    items: readonly (readonly [string, number | NumObj, number | NumObj])[];
  };
  maintenance: { valueMode: MaintenanceValueMode };
};

function makeExampleProperty(props: ExamplePropertyProps) {
  const property = PackBuilderSection.initAsOmniChild("property");
  property.loadSelf(makeDefaultProperty());
  property.updateValues({
    ...props.property,
    taxesOngoingSwitch: "yearly",
    homeInsOngoingSwitch: "yearly",
  });

  for (const { monthlyRent, ...rest } of props.units) {
    const unit = property.addAndGetChild("unit");
    unit.updateValues({
      ...rest,
      targetRentOngoingEditor: monthlyRent,
      targetRentOngoingSwitch: "monthly",
    });
  }

  const repairValue = property.onlyChild("repairValue");
  repairValue.updateValues({
    valueMode: "itemize",
  });
  const repairList = repairValue.onlyChild("singleTimeList");
  for (const [displayName, value] of props.repairs) {
    const repairItem = repairList.addAndGetChild("singleTimeItem");
    repairItem.updateValues({
      valueSourceName: "labeledEquation",
      displayNameEditor: displayName,
      valueEditor: numToObj(value),
    });
  }

  const utilityValue = property.onlyChild("utilityValue");
  utilityValue.updateValues({ valueMode: "itemize" });
  const utilityList = utilityValue.onlyChild("ongoingList");
  for (const [displayName, value] of props.utilities) {
    const utilityItem = utilityList.addAndGetChild("ongoingItem");
    utilityItem.updateValues({
      valueSourceName: "labeledEquation",
      valueOngoingSwitch: "monthly",
      displayNameEditor: displayName,
      valueEditor: numToObj(value),
    });
  }

  const capExValue = property.onlyChild("capExValue");
  capExValue.updateValues({
    valueMode: props.capEx.valueMode,
  });
  const capExList = capExValue.onlyChild("capExList");
  for (const [displayName, lifeSpan, replacementCost] of props.capEx.items) {
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
    valueMode: props.maintenance.valueMode,
  });

  return property.makeSectionPack();
}

export const makeExampleDealProperty = () =>
  makeExampleProperty({
    property: {
      displayName: stringObj("160 Example Ave E"),
      purchasePrice: numObj(250000),
      sqft: numObj(2500),
      taxesOngoingEditor: numObj(2500),
      homeInsOngoingEditor: numObjNext("1000+(", ["numUnits"], "*200)"),
    },
    units: [
      {
        numBedrooms: numObj(3),
        monthlyRent: numObj(1800),
      },
      {
        numBedrooms: numObj(3),
        monthlyRent: numObj(1800),
      },
    ],
    repairs: [
      ["Replace toilet", 200],
      ["Replace locks", 150],
      ["Repair oven", 200],
      ["New flooring", numObjNext("3*", ["sqft"])],
      ["Replace faucet", 100],
    ],
    utilities: [
      ["Water", numObjNext("60*", ["numUnits"])],
      ["Garbage", numObjNext("50*", ["numUnits"])],
    ],
    capEx: {
      valueMode: "fivePercentRent",
      items: [],
    },
    maintenance: {
      valueMode: "onePercentAndSqft",
    },
  });

export const makeExampleStoreProperty = () =>
  makeExampleProperty({
    property: {
      displayName: stringObj("Example Property"),
      purchasePrice: numObj(250000),
      sqft: numObj(2500),
      taxesOngoingEditor: numObj(2800),
      homeInsOngoingEditor: numObj(1800),
    },
    units: [
      {
        numBedrooms: numObj(4),
        monthlyRent: numObj(2300),
      },
      {
        numBedrooms: numObj(2),
        monthlyRent: numObj(1400),
      },
    ],
    repairs: examplePropetyRepairProps,
    utilities: examplePropertyUtilityProps,
    capEx: {
      valueMode: "itemize",
      items: examplePropertyCapExListProps,
    },
    maintenance: { valueMode: "onePercentAndSqft" },
  });
