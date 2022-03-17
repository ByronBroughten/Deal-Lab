import { z } from "zod";
import { DbSectionSchemas } from "../Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "../Analyzer/SectionMetas/SectionName";
import { GuestAccessSections } from "./crudTypes";
import { DbEntry, zDbEntry } from "../Analyzer/DbEntry";

export type DbUser = Record<SectionName<"dbStore">, DbEntry[]>;
export type LoginUser = Omit<
  Record<SectionName<"initOnLogin">, DbEntry[]>,
  "row"
>;

export const zDbEntryArr = z.array(zDbEntry);

type UserVarbs = DbSectionSchemas["user"]["varbs"];
type ProtectedUserVarbs = DbSectionSchemas["userProtected"]["varbs"];
export type NewUserData = {
  user: SchemaVarbsToDbValues<UserVarbs>;
  userProtected: SchemaVarbsToDbValues<ProtectedUserVarbs>;
  guestAccessSections: GuestAccessSections;
};
