import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numToObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { ExampleCapExProps } from "./makeExampleOngoingListsProps";

export function makeExampleCapExList(
  displayName: string,
  capExProps: ExampleCapExProps,
  dateTimeSaved?: number
): SectionPack<"capExList"> {
  const capExList = PackBuilderSection.initAsOmniChild("capExList");
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
      lifespanSpanEditor: numToObj(lifeSpan),
      valueDollarsPeriodicSwitch: "yearly",
      lifespanSpanSwitch: "years",
    });
  }
  return capExList.makeSectionPack();
}
