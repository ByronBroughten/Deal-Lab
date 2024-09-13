import {
  numObj,
  NumObj,
  numToObj,
} from "../../stateSchemas/schema4ValueTraits/StateValue/NumObj";
import { numObjNext } from "../../stateSchemas/schema4ValueTraits/StateValue/numObjNext";
import { stringObj } from "../../stateSchemas/schema4ValueTraits/StateValue/StringObj";
import { makeExample } from "./makeExample";

export function makeNationalUtilityAverageList() {
  return makeExampleUtilityList("National utility averages", [
    ["Natural gas", numObjNext(["sqft"], "*0.019855")],
    ["Electricity", numObjNext("95.47+(", ["sqft"], "*0.0226446)")],
    ["Water/sewer", numObj(37.38)],
    ["Garbage", numObj(37.37)],
  ]);
}

type UtilityItemProp = [string, number | NumObj];
export function makeExampleUtilityList(
  displayName: string,
  itemPropArr: UtilityItemProp[]
) {
  return makeExample("periodicList", (utilityList) => {
    const valueSource = "valueDollarsEditor";
    utilityList.updateValues({
      itemValueSource: valueSource,
      itemPeriodicSwitch: "monthly",
      displayName: stringObj(displayName),
    });
    for (const itemProps of itemPropArr) {
      const item = utilityList.addAndGetChild("periodicItem", {
        sectionValues: {
          displayNameEditor: itemProps[0],
          valueSourceName: valueSource,
        },
      });
      item.onlyChild("valueDollarsEditor").updateValues({
        valueEditor: numToObj(itemProps[1]),
        valueEditorFrequency: "monthly",
      });
    }
  });
}
