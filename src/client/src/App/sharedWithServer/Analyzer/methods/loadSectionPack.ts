import Analyzer from "../../Analyzer";
import { SectionName } from "../../SectionMetas/SectionName";
import { FeSectionPack, SectionPackSupplements } from "../FeSectionPack";
import { FeSelfOrDescendantNode } from "../FeSectionPacks/FeSectionNode";
import { SectionPackRaw } from "../SectionPackRaw";
import { AddSectionProps } from "./internal/addSections/addSectionsTypes";

export function loadRawSectionPack<
  SN extends SectionName,
  Props extends SectionPackSupplements<SN>
>(this: Analyzer, rawSectionPack: SectionPackRaw<SN>, props: Props): Analyzer {
  const feSectionPack = new FeSectionPack(rawSectionPack);
  const addSectionProps = feSectionPack.makeOrderedPreSections(
    props
  ) as FeSelfOrDescendantNode<SN>[];
  return this.addSectionsAndSolveNext(addSectionProps as AddSectionProps[]);
}
