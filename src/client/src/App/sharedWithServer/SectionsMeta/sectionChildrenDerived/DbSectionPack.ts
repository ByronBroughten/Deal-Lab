import { childToSectionName } from "./ChildSectionName";
import { DbSectionName, DbStoreName } from "./DbStoreName";
import { isSectionPack, SectionPack } from "./SectionPack";

export type DbSectionPack<CN extends DbStoreName = DbStoreName> = SectionPack<
  DbSectionName<CN>
>;

export interface DbPack<CN extends DbStoreName = DbStoreName> {
  dbStoreName: CN;
  sectionPack: DbSectionPack<CN>;
}

export function isDbStoreSectionPack<CN extends DbStoreName>(
  value: any,
  dbStoreName: CN
): value is SectionPack<DbSectionName<CN>> {
  const isPack = isSectionPack(value);
  const sectionName = childToSectionName("dbStore", dbStoreName);
  const isOfSectionName = value.sectionName === sectionName;
  return isPack && isOfSectionName;
}
