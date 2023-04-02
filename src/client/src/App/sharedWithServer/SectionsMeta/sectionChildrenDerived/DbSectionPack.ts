import { SectionPackArrs } from "../../StatePackers/PackMakerSection";
import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { childToSectionName } from "./ChildSectionName";
import {
  DbSectionName,
  DbStoreName,
  dbStoreNameS,
  DbStoreType,
} from "./DbStoreName";
import { isSectionPack, SectionPack, validateSectionPack } from "./SectionPack";

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
export function validateDbSectionPack<CN extends DbStoreName>(
  value: any,
  dbStoreName: CN
): SectionPack<DbSectionName<CN>> {
  validateSectionPack(value);
  if (isDbStoreSectionPack(value, dbStoreName)) return value;
  throw new Error(
    `value is not a valid sectionPack from dbStore "${dbStoreName}"`
  );
}

type ValidateDbPackArrProps<CN extends DbStoreName> = {
  value: any;
  dbStoreName: CN;
};
export function validateDbSectionPackArr<CN extends DbStoreName>({
  value,
  dbStoreName,
}: ValidateDbPackArrProps<CN>): SectionPack<DbSectionName<CN>>[] {
  const arr = Arr.validateIsArray(value);
  for (const element of arr) {
    validateDbSectionPack(element, dbStoreName);
  }
  return arr;
}

export function validateDbSectionPackArrs(
  value: any,
  dbStoreType?: DbStoreType
): SectionPackArrs<"dbStore"> {
  const packArrs = Obj.validateObjToAny(value);
  for (const key of Obj.keys(packArrs)) {
    const dbStoreName = dbStoreNameS.validate(key, dbStoreType);
    validateDbSectionPackArr({
      dbStoreName,
      value: packArrs[dbStoreName],
    });
  }
  return value;
}
