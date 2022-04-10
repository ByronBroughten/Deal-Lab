import Analyzer from "../../../Analyzer";
import { FeSectionPack } from "../../FeSectionPack";
import { RawSectionPack } from "../../RawSectionPack";
import { SectionName } from "../../SectionMetas/SectionName";
import { internal } from "../internal";
import { AddSectionProps } from "./addSections/addSectionsTypes";

function getSectionArrAddSectionProps(
  next: Analyzer,
  sectionPackArr: RawSectionPack<"fe", SectionName<"hasOneParent">>[]
) {
  return sectionPackArr.reduce((addSectionPropsArr, rawSectionPack) => {
    const { sectionName } = rawSectionPack;
    const feSectionPack = new FeSectionPack(rawSectionPack);

    const addSectionProps = feSectionPack.makeOrderedSectionNodes({
      parentFinder: next.parent(sectionName).feInfo,
    });

    return addSectionPropsArr.concat(addSectionProps);
  }, [] as AddSectionProps[]);
}

export function loadRawSectionPackArr<S extends SectionName<"hasOneParent">>(
  next: Analyzer,
  sectionName: S,
  sectionPackArr: RawSectionPack<"fe", S>[]
): Analyzer {
  next = internal.wipeSectionArr(next, sectionName);
  const addSectionArrProps = getSectionArrAddSectionProps(
    next,
    sectionPackArr as Record<keyof RawSectionPack<"fe", S>, any>[]
  );
  return internal.addSections(next, addSectionArrProps);
}
