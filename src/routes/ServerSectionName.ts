import { savableNameS } from "../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { StringTypeChecker } from "../client/src/App/utils/StringTypeChecker";

const serverNameArrs = {
  serverOnly: ["userProtected"] as const,
  get all() {
    return [...this.serverOnly, ...savableNameS.arrs.all] as const;
  },
} as const;

export type ServerSectionName = typeof serverNameArrs.all[number];
export const serverSectionS = new StringTypeChecker(serverNameArrs);
