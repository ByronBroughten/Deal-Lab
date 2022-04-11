import Analyzer from "../../Analyzer";
import { FeSectionPack, OrderedSectionNodeProps } from "../FeSectionPack";
import { FeSelfOrDescendantNode } from "../FeSectionPacks/FeSectionNode";
import { SectionName } from "../SectionMetas/SectionName";
import { SectionPackRaw } from "../SectionPackRaw";
import { AddSectionProps } from "./internal/addSections/addSectionsTypes";

export function loadRawSectionPack<
  SN extends SectionName,
  Props extends OrderedSectionNodeProps<SN>
>(
  this: Analyzer,
  rawSectionPack: SectionPackRaw<"fe", SN>,
  props: Props
): Analyzer {
  const feSectionPack = new FeSectionPack(rawSectionPack);
  const sectionNodes = feSectionPack.makeOrderedSectionNodes(
    props
  ) as FeSelfOrDescendantNode<SN>[];
  return this.addSectionsAndSolveNext(sectionNodes as AddSectionProps[]);
}
