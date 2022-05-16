import Analyzer from "../../../Analyzer";
import { SectionName } from "../../../SectionsMeta/SectionName";
import { FeSectionPack } from "../../FeSectionPack";
import { SectionPackRaw } from "../../SectionPackRaw";
import { internal } from "../internal";
import { AddSectionProps } from "./addSections/addSectionsTypes";

function getSectionArrAddSectionProps(
  next: Analyzer,
  sectionPackArr: SectionPackRaw<SectionName<"hasOneParent">>[]
  // this can take parentFinder
) {
  return sectionPackArr.reduce((addSectionPropsArr, rawSectionPack) => {
    const { sectionName } = rawSectionPack;
    const feSectionPack = new FeSectionPack(rawSectionPack);

    const addSectionProps = feSectionPack.makeOrderedPreSections({
      parentInfo: next.parent(sectionName).feInfo,
    });

    return addSectionPropsArr.concat(addSectionProps);
  }, [] as AddSectionProps[]);
}

export function loadRawSectionPackArr<S extends SectionName<"hasOneParent">>(
  next: Analyzer,
  sectionName: S,
  sectionPackArr: SectionPackRaw<S>[]
): Analyzer {
  next = internal.wipeSectionArr(next, sectionName);

  const addSectionArrProps = getSectionArrAddSectionProps(
    next,
    sectionPackArr as Record<keyof SectionPackRaw<S>, any>[]
  );
  return internal.addSectionsNext(next, addSectionArrProps);
}
