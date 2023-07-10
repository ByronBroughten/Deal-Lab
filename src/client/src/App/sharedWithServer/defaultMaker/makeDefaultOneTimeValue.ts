import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultOneTimeValue() {
  const onetimeValue = PackBuilderSection.initAsOmniChild("onetimeValue");
  onetimeValue.updateValues({ valueSourceName: "none" });
  const list = onetimeValue.addAndGetChild("onetimeList");
  list.updateValues({ itemValueSource: "valueDollarsEditor" });
  return onetimeValue.makeSectionPack();
}
