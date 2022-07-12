import { SectionPack } from "../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { ChildSectionName } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { allDbStoreChildNames } from "../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";

export const serverSectionNames = allDbStoreChildNames;
export type ServerStoreName = typeof serverSectionNames[number];
export type ServerSectionName<CN extends ServerStoreName = ServerStoreName> =
  ChildSectionName<"dbStore", CN>;

export type ServerSectionPack<CN extends ServerStoreName = ServerStoreName> =
  SectionPack<ServerSectionName<CN>>;

export interface ServerPack<CN extends ServerStoreName = ServerStoreName> {
  dbStoreName: CN;
  sectionPack: ServerSectionPack<CN>;
}
export interface ServerStoreInfo<CN extends ServerStoreName = ServerStoreName> {
  dbStoreName: CN;
  dbId: string;
}
