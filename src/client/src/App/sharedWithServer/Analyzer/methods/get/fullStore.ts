import Analyzer from "../../../Analyzer";
import { Inf } from "../../SectionMetas/Info";
import { ExtraStoreNameOneParent } from "../../SectionMetas/relNameArrs/StoreTypes";
import StateSection from "../../StateSection";

export function fullStoreEntries(
  this: Analyzer,
  feStoreName: ExtraStoreNameOneParent
): StateSection[] {
  // Get the parent so that the order is preserved.
  const parent = this.parent(feStoreName);
  return parent.childFeIds(feStoreName).map((id) => {
    return this.section(Inf.fe(feStoreName, id));
  }) as StateSection[];
}
export function fullStoreTitlesAndDbIds(
  this: Analyzer,
  sectionName: ExtraStoreNameOneParent
): { title: string; dbId: string }[] {
  return this.fullStoreEntries(sectionName).map((section) => ({
    title: section.value("title", "string"),
    dbId: section.dbId,
  }));
}
