import { numToObj } from "../../stateSchemas/schema4ValueTraits/StateValue/NumObj";
import { stringObj } from "../../stateSchemas/schema4ValueTraits/StateValue/StringObj";
import { SectionPack } from "../../StateTransports/SectionPack";
import { timeS } from "../../utils/timeS";
import { makeExample } from "./makeExample";
import {
  avgHomeAdvisorNahbCapExProps,
  ExampleCapExProps,
} from "./makeExamplePeriodicListProps";

export function makeHomeAdvisorNahbCapExList() {
  return makeExampleCapExList(
    "HomeAdvisor & NAHB Averages",
    avgHomeAdvisorNahbCapExProps,
    timeS.now()
  );
}

export function makeExampleCapExList(
  displayName: string,
  capExProps: ExampleCapExProps,
  dateTimeSaved?: number
): SectionPack<"capExList"> {
  return makeExample("capExList", (capExList) => {
    capExList.updateValues({
      displayName: stringObj(displayName),
      ...(dateTimeSaved && {
        dateTimeFirstSaved: dateTimeSaved,
        dateTimeLastSaved: dateTimeSaved,
      }),
    });

    for (const [displayName, lifeSpan, replacementCost] of capExProps) {
      const item = capExList.addAndGetChild("capExItem");
      item.updateValues({
        displayNameEditor: displayName,
        costToReplace: numToObj(replacementCost),
      });
      item.onlyChild("lifespanEditor").updateValues({
        valueEditor: numToObj(lifeSpan),
        valueEditorUnit: "years",
      });
    }
  });
}
