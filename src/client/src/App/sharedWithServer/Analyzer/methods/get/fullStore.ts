import Analyzer from "../../../Analyzer";
import { InfoS } from "../../../SectionMetas/Info";
import { ExtraStoreNameOneParent } from "../../../SectionMetas/relSectionTypes/StoreTypes";
import StateSection from "../../StateSection";

export function fullStoreEntries(
  this: Analyzer,
  feStoreName: ExtraStoreNameOneParent
): StateSection[] {
  // Get the parent so that the order is preserved.
  const parent = this.parent(feStoreName);
  return parent.childFeIds(feStoreName).map((id) => {
    return this.section(InfoS.fe(feStoreName, id));
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
