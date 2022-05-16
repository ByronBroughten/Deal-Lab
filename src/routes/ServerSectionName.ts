import { SimpleSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import {
  savableNameS,
  SavableSectionName,
} from "../client/src/App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { StrictExtract } from "../client/src/App/sharedWithServer/utils/types";
import { StringTypeChecker } from "../client/src/App/utils/StringTypeChecker";

type ServerOnlyName = StrictExtract<SimpleSectionName, "serverOnlyUser">;
export type ServerSectionName = SavableSectionName | ServerOnlyName;

const serverNameArrs = {
  serverOnly: ["serverOnlyUser"] as ServerOnlyName[],
  get all() {
    return [
      ...this.serverOnly,
      ...savableNameS.arrs.all,
    ] as ServerSectionName[];
  },
} as const;

export const serverSectionS = new StringTypeChecker(serverNameArrs);
