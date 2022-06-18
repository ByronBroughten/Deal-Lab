import {
  FeSectionPack,
  SectionPackSupplements,
} from "../../../../App/sharedWithServer/SectionPack/FeSectionPack";
import { FeSelfOrDescendantNode } from "../../../../App/sharedWithServer/SectionPack/FeSectionPacks/FeSectionNode";
import { SectionPackRaw } from "../../../../App/sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../../../App/sharedWithServer/SectionsMeta/SectionName";
import Analyzer from "../../Analyzer";
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
