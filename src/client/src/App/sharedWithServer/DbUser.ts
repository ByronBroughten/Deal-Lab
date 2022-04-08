import { z } from "zod";
import { DbEntry, zDbEntry } from "./Analyzer/DbEntry";
import { BaseSectionsDb } from "./Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "./Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "./Analyzer/SectionMetas/SectionName";
import { GuestAccessSections } from "./Crud";

export type DbUser = Record<SectionName<"dbStore">, DbEntry[]>;
export type LoginUser = Omit<
  Record<SectionName<"initOnLogin">, DbEntry[]>,
  "row"
>;

export const zDbEntryArr = z.array(zDbEntry);

type UserVarbs = BaseSectionsDb["user"]["varbSchemas"];
type ProtectedUserVarbs = BaseSectionsDb["userProtected"]["varbSchemas"];
export type NewUserData = {
  user: SchemaVarbsToDbValues<UserVarbs>;
  userProtected: SchemaVarbsToDbValues<ProtectedUserVarbs>;
  guestAccessSections: GuestAccessSections;
};
