import { z } from "zod";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../SectionsMeta/relSectionsDerived/FeStoreName";
import { ChildSectionPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import {
  SectionPack,
  zRawSectionPack,
} from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackByType } from "../SectionsMeta/SectionNameByType";
import { zS } from "../utils/zod";

export type UserData = {
  feUser: SectionPack<"feUser">;
};

export function validateUserData(value: any): UserData {
  const feUser = validateSectionPackByType(value.feUser, "feUser");
  return { feUser };
}

function validateMainStoreArrs(value: any): void {
  const schema = z.object(
    feStoreNameS.arrs.mainStoreName.reduce((partial, sectionName) => {
      partial[sectionName] = zS.array(zRawSectionPack);
      return partial;
    }, {} as Record<keyof MainStoreArrs, any>) as Record<
      keyof MainStoreArrs,
      any
    >
  );
  schema.parse(value);
}

export type MainStoreArrs = {
  [CN in FeStoreNameByType<"mainStoreName">]: ChildSectionPack<"feUser", CN>[];
};
