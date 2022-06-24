import { z } from "zod";
import { SectionPackRaw, zRawSectionPackArr } from "../SectionPack/SectionPack";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { dbLimits } from "../utils/dbLimts";
import { validationMessage, zodSchema } from "../utils/zod";
import { NextRes } from "./apiQueriesSharedTypes";

export type RegisterQueryObjects = {
  req: {
    body: RegisterReqBody;
  };
  res: NextRes<"login">;
};
export type RegisterReqBody = {
  registerFormData: RegisterFormData;
  guestAccessSections: GuestAccessSectionPackArrs;
};

export type GuestAccessSectionPackArrs = {
  [SN in SectionName<"feGuestAccess">]: SectionPackRaw<SN>[];
};
export function areGuestAccessSectionsNext(
  value: any
): value is GuestAccessSectionPackArrs {
  const zGuestAccessSections = makeZGuestAccessSectionsNext();
  zGuestAccessSections.parse(value);
  return true;
}
function makeZGuestAccessSectionsNext() {
  const feGuestAccessStoreNames = sectionNameS.arrs.feGuestAccess;
  const schemaFrame = feGuestAccessStoreNames.reduce(
    (feGuestAccessSections, sectionName) => {
      feGuestAccessSections[sectionName] = zRawSectionPackArr;
      return feGuestAccessSections;
    },
    {} as Record<SectionName<"feGuestAccess">, any>
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
