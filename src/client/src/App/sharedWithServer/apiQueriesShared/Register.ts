import { z } from "zod";
import {
  SectionName,
  sectionNameS,
} from "../Analyzer/SectionMetas/SectionName";
import { SectionPackRaw, zSectionPackDbArr } from "../Analyzer/SectionPackRaw";
import { NextRes } from "../apiQueriesSharedTypes";
import { dbLimits } from "../utils/dbLimts";
import { validationMessage, zodSchema } from "../utils/zod";

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
  zGuestAccessSections.parse(value);
  return true;
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
