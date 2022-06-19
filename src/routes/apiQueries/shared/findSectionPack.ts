import { SectionPackRaw } from "../../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import { DbSectionName } from "../../../client/src/App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { DbSection, DbSectionInitProps } from "./DbSections/DbSection";

export interface FindSectionPackProps<SN extends DbSectionName = DbSectionName>
  extends DbSectionInitProps<SN> {}

export async function findSectionPack<SN extends DbSectionName = DbSectionName>(
  props: FindSectionPackProps<SN>
): Promise<SectionPackRaw<SN>> {
  const dbSection = DbSection.init(props);
  return (await dbSection).sectionPack();
}
