import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj, NumObj } from "../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { makeExample } from "./makeExample";

type OneTimeItemProp = readonly [string, number | NumObj];
export function makeExampleOneTimeList(
  listTitle: string,
  itemPropArr: readonly OneTimeItemProp[],
  dbId?: string
): SectionPack<"onetimeList"> {
  return makeExample("onetimeList", (list) => {
    list.updateValues({ displayName: stringObj(listTitle) });
    dbId && list.updater.updateDbId(dbId);

    for (const itemProps of itemPropArr) {
      const value = itemProps[1];
      list.addChild("onetimeItem", {
        sectionValues: {
          displayNameEditor: itemProps[0],
          valueDollarsEditor: typeof value === "number" ? numObj(value) : value,
        },
      });
    }
  });
}