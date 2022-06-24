import { z } from "zod";
import { sectionsMeta } from "../SectionsMeta";
import { Id } from "../SectionsMeta/baseSections/id";
import { ChildIdArrsWide } from "../SectionsMeta/relSectionTypes/ChildTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionsMeta/SectionName";
import { zodSchema } from "../utils/zod";
import { DbVarbs, RawSections, zRawSections } from "./RawSection";

export type SectionPackRaw<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
  rawSections: RawSections<SN>;
};

export type SectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST>]: SectionPackRaw<SN>[];
};

export type SectionArrPack<SN extends SectionName> = {
  sectionName: SN;
  sectionPacks: SectionPackRaw<SN>[];
};

export type ServerSectionPack<
  SN extends SectionName<"dbStoreNext"> = SectionName<"dbStoreNext">
> = SectionPackRaw<SN>;

const zRawSectionPackFrame: Record<keyof SectionPackRaw, any> = {
  sectionName: zodSchema.string,
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);
export const zRawSectionPackArr = z.array(zRawSectionPack);

export const sectionPackS = {
  is<ST extends SectionNameType = "all">(
    value: any,
    sectionType?: ST
  ): value is SectionPackRaw<SectionName<ST>> {
    if (
      zRawSectionPack.safeParse(value).success &&
      sectionNameS.is(value.sectionName, sectionType ?? "all")
    ) {
      return true;
    } else return false;
  },
  init<SN extends SectionName>({
    sectionName,
    childDbIds,
    dbVarbs,
    dbId = Id.make(),
  }: OneHeadSectionNode<SN>): SectionPackRaw<SN> {
    const sectionMeta = sectionsMeta.section(sectionName);
    return {
      sectionName,
      dbId,
      rawSections: {
        ...emptyRawSections(sectionName),
        [sectionName]: [
          {
            dbId,
            childDbIds: {
              ...sectionMeta.emptyChildIdsWide(),
              ...childDbIds,
            },
            dbVarbs: {
              ...sectionMeta.defaultDbVarbs(),
              ...dbVarbs,
            },
          },
        ],
      },
    };
  },
} as const;

function emptyRawSections<SN extends SectionName>(
  sectionName: SN
): RawSections<SN> {
  return sectionsMeta
    .selfAndDescendantNames(sectionName)
    .reduce((rawSections, name) => {
      rawSections[name] = [];
      return rawSections;
    }, {} as RawSections<SN>);
}

type OneHeadSectionNode<SN extends SectionName> = {
  sectionName: SN;
  dbId?: string;
  childDbIds?: Partial<ChildIdArrsWide<SN>>;
  dbVarbs?: Partial<DbVarbs>;
};

function _testRawSectionPack(feRaw: SectionPackRaw<"tableRow">) {
  const _test1 = feRaw.rawSections.cell;
  // @ts-expect-error
  const _test2 = feRaw.rawSections.unit;
}
