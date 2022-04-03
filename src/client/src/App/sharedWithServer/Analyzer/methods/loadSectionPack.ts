import { SectionName } from "../SectionMetas/SectionName";
import { RawSectionPack } from "../SectionPack";
import { FeSectionPack, OrderedSectionNodeProps } from "../SectionPackFe";
import { FeSectionNode } from "../SectionPackFe/FeSectionNode";

// export function loadRawSectionPack<
//   SN extends SectionName,
//   Props extends OrderedSectionNodeProps<SN>
// >(rawSectionPack: RawSectionPack<SN, "fe">, props: Props): Analyzer {
//   const feSectionPack = new FeSectionPack(rawSectionPack);
//   const sectionNodes = feSectionPack.makeOrderedSectionNodes(
//     props
//   ) as FeSectionNode[];
// }
