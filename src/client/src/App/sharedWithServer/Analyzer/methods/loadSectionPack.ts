import Analyzer from "../../Analyzer";
import { RawSectionPack } from "../RawSectionPack";
import { SectionName } from "../SectionMetas/SectionName";
import { FeSectionPack, OrderedSectionNodeProps } from "../SectionPackFe";
import { FeSectionNode } from "../SectionPackFe/FeSectionNode";

export function loadRawSectionPack<
  SN extends SectionName,
  Props extends OrderedSectionNodeProps<SN>
>(
  this: Analyzer,
  rawSectionPack: RawSectionPack<SN, "fe">,
  props: Props
): Analyzer {
  const feSectionPack = new FeSectionPack(rawSectionPack);
  const sectionNodes = feSectionPack.makeOrderedSectionNodes(
    props
  ) as FeSectionNode[];
  return this.nextAddSectionsAndSolve(sectionNodes);
}
