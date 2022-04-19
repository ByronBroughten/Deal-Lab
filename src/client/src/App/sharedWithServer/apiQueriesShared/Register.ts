import { z } from "zod";
import { DbEntry, zDbEntryArr } from "../Analyzer/DbEntry";
import { BaseSectionsDb } from "../Analyzer/SectionMetas/relSections/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../Analyzer/SectionMetas/relSections/rel/valueMetaTypes";
import {
  SectionName,
  sectionNameS,
} from "../Analyzer/SectionMetas/SectionName";
import { SectionPackRaw, zSectionPackDbArr } from "../Analyzer/SectionPackRaw";
import { NextRes } from "../apiQueriesSharedTypes";
import { dbLimits } from "../utils/dbLimts";
import { validationMessage, zodSchema, zValidate } from "../utils/zod";

export type RegisterQueryObjects = {
  req: {
    body: RegisterReqBody;
  };
  res: NextRes<"nextLogin">;
};
export type RegisterReqBody = {
  registerFormData: RegisterFormData;
  guestAccessSections: GuestAccessSectionsNext;
};

export type GuestAccessSectionsNext = {
  [SN in SectionName<"feGuestAccessStore">]: SectionPackRaw<"db", SN>[];
};
export function areGuestAccessSectionsNext(
  value: any
): value is GuestAccessSectionsNext {
  const zGuestAccessSections = makeZGuestAccessSectionsNext();
  return zValidate(value, zGuestAccessSections);
}
function makeZGuestAccessSectionsNext() {
  const feGuestAccessStoreNames = sectionNameS.arrs.db.feGuestAccessStore;
  const schemaFrame = feGuestAccessStoreNames.reduce(
    (feGuestAccessSections, sectionName) => {
      feGuestAccessSections[sectionName] = zSectionPackDbArr;
      return feGuestAccessSections;
    },
    {} as Record<SectionName<"feGuestAccessStore">, any>
  );
  return z.object(schemaFrame);
}

export type RegisterReqPayload = {
  registerFormData: RegisterFormData;
  guestAccessSections: GuestAccessSections;
};

export type NewUserData = {
  user: SchemaVarbsToDbValues<DbUserVarbs>;
  guestAccessSections: GuestAccessSections;
};
type DbUserVarbs = BaseSectionsDb["user"]["varbSchemas"];
export type GuestAccessSections = Record<
  SectionName<"feGuestAccessStore">,
  DbEntry[]
>;

export function areGuestAccessSections(
  value: any
): value is GuestAccessSections {
  const zGuestAccessSections = makeZGuestAccessSections();
  return zGuestAccessSections.safeParse(value).success;
}

function makeZGuestAccessSections() {
  const sections: Partial<Record<SectionName<"feGuestAccessStore">, any>> = {};
  for (const sectionName of sectionNameS.arrs.fe.feGuestAccessStore) {
    sections[sectionName] = zDbEntryArr;
  }
  return z.object(sections as Record<SectionName<"feGuestAccessStore">, any>);
}

export function isRegisterFormData(value: any): value is RegisterFormData {
  return zRegisterFormData.safeParse(value).success;
}

export const zRegisterFormData = z.object({
  email: zodSchema.string.email(),
  userName: z
    .string()
    .min(3, validationMessage.min(3))
    .max(50, validationMessage.max(50)),
  password: z
    .string()
    .max(
      dbLimits.password.maxLength,
      validationMessage.max(dbLimits.password.maxLength)
    ),
});

export type RegisterFormData = z.infer<typeof zRegisterFormData>;
