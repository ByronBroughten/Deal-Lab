import { z } from "zod";
import { ChildName } from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionName";
import { zodSchema } from "../utils/zod";
import { RawSections, zRawSections } from "./RawSection";

export type SectionPack<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
  rawSections: RawSections<SN>;
};
export type ChildSectionPack<
  SN extends SectionName,
  CN extends ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = SectionPack<CT>;

export type SectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST>]: SectionPack<SN>[];
};

export type SectionArrPack<SN extends SectionName> = {
  sectionName: SN;
  sectionPacks: SectionPack<SN>[];
};
export type ChildArrPack<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPacks: SectionPack<CT>[];
};

export type ServerSectionPack<
  SN extends SectionName<"dbStoreNext"> = SectionName<"dbStoreNext">
> = SectionPack<SN>;

const zRawSectionPackFrame: Record<keyof SectionPack, any> = {
  sectionName: zodSchema.string,
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);
export const zRawSectionPackArr = z.array(zRawSectionPack);

export function isSectionPack<ST extends SectionNameType = "all">(
  value: any,
  sectionType?: ST
): value is SectionPack<SectionName<ST>> {
  if (
    zRawSectionPack.safeParse(value).success &&
    sectionNameS.is(value.sectionName, sectionType ?? "all")
  ) {
    return true;
  } else return false;
}
