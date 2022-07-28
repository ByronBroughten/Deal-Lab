import { z } from "zod";
import {
  ChildSectionPack,
  zRawSectionPackArr,
} from "../SectionPack/SectionPack";
import { sectionsMeta } from "../SectionsMeta";
import { Arr } from "../utils/Arr";
import { dbLimits } from "../utils/dbLimts";
import { validationMessage, zS } from "../utils/zod";
import { QueryRes } from "./apiQueriesSharedTypes";

export type RegisterQueryObjects = {
  req: {
    body: RegisterReqBody;
  };
  res: QueryRes<"login">;
};
export type RegisterReqBody = {
  registerFormData: RegisterFormData;
  guestAccessSections: GuestAccessSectionPackArrs;
};

const feStoreChildNames = sectionsMeta.section("feStore").childNames;
export const guestAccessNames = Arr.extractStrict(feStoreChildNames, [
  "ongoingListMain",
  "outputListMain",
  "singleTimeListMain",
  "userVarbListMain",
] as const);
type GuestAccessName = typeof guestAccessNames[number];

export type GuestAccessSectionPackArrs = {
  [CN in GuestAccessName]: ChildSectionPack<"feStore", CN>[];
};
export function areGuestAccessSections(
  value: any
): value is GuestAccessSectionPackArrs {
  const zGuestAccessSections = makeZGuestAccessSectionsNext();
  zGuestAccessSections.parse(value);
  return true;
}
function makeZGuestAccessSectionsNext() {
  const feGuestAccessStoreNames = guestAccessNames;
  const schemaFrame = feGuestAccessStoreNames.reduce(
    (feGuestAccessSections, childName) => {
      feGuestAccessSections[childName] = zRawSectionPackArr;
      return feGuestAccessSections;
    },
    {} as Record<GuestAccessName, any>
  );
  return z.object(schemaFrame);
}

export function isRegisterFormData(value: any): value is RegisterFormData {
  return zRegisterFormData.safeParse(value).success;
}

export const zRegisterFormData = z.object({
  email: zS.string.email(),
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
