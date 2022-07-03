import {
  SimpleSectionName,
  simpleSectionNames,
} from "../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import {
  DbSectionName,
  savableNameS,
} from "../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/storeArrs";
import { Arr } from "../client/src/App/sharedWithServer/utils/Arr";
import { StrictExtract } from "../client/src/App/sharedWithServer/utils/types";
import { StringTypeChecker } from "../client/src/App/utils/StringTypeChecker";

type ServerOnlyName = StrictExtract<SimpleSectionName, "serverOnlyUser">;
export type ServerSectionName = DbSectionName | ServerOnlyName;

const serverOnlyNames = Arr.extractStrict(simpleSectionNames, [
  "serverOnlyUser",
] as const);
export const serverSectionNames = [
  ...serverOnlyNames,
  ...savableNameS.arrs.all,
] as ServerSectionName[];

const serverNameArrs = {
  serverOnly: ["serverOnlyUser"] as ServerOnlyName[],
  get all() {
    return serverSectionNames;
  },
} as const;

export const serverSectionS = new StringTypeChecker(serverNameArrs);
