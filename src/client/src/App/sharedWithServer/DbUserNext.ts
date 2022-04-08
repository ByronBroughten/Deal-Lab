import { z } from "zod";
import { SectionPackDb } from "./Analyzer/RawSectionPack";
import { BaseSectionsDb } from "./Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "./Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import { SectionNam, SectionName } from "./Analyzer/SectionMetas/SectionName";
import { zDbSectionPack } from "./Analyzer/SectionPackDb";
import { GuestAccessSections } from "./Crud";
import { zodSchema } from "./utils/zod";

export type DbUserNext = {
  [SN in SectionName<"dbStore">]: SectionPackDb<SN>[];
};
export type LoginUserNext = Omit<
  {
    [SN in SectionName<"initOnLogin">]: SectionPackDb<SN>[];
  },
  "row"
>;

export function isLoginUserNext(value: any): value is LoginUserNext {
  const zLoginUserSchema = makeZLoginUserSchema();
  return zLoginUserSchema.safeParse(value).success;
}

function makeZLoginUserSchema() {
  return z.object(
    SectionNam.arrs.fe.initOnLogin.reduce((partial, sectionName) => {
      partial[sectionName] = zodSchema.array(zDbSectionPack);
      return partial;
    }, {} as Partial<Record<keyof LoginUserNext, any>>) as Record<
      keyof LoginUserNext,
      any
    >
  );
}

type UserVarbs = BaseSectionsDb["user"]["varbSchemas"];
type ProtectedUserVarbs = BaseSectionsDb["userProtected"]["varbSchemas"];
export type NewUserData = {
  user: SchemaVarbsToDbValues<UserVarbs>;
  userProtected: SchemaVarbsToDbValues<ProtectedUserVarbs>;
  guestAccessSections: GuestAccessSections;
};
