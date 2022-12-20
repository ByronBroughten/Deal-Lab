import { z } from "zod";
import { sectionsMeta } from "../SectionsMeta";
import { ChildSectionPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { zRawSectionPackArr } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { Arr } from "../utils/Arr";

const feStoreChildNames = sectionsMeta.section("feUser").childNames;
export const guestAccessNames = Arr.extractStrict(feStoreChildNames, [
  "ongoingListMain",
  "outputListMain",
  "singleTimeListMain",
  "userVarbListMain",
] as const);
type GuestAccessName = typeof guestAccessNames[number];

export type GuestAccessSectionPackArrs = {
  [CN in GuestAccessName]: ChildSectionPack<"feUser", CN>[];
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
