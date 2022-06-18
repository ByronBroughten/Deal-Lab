import { SavableSectionName } from "../../App/sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { SectionName } from "../../App/sharedWithServer/SectionsMeta/SectionName";
import { SectionArrDepreciatedQuerier } from "./SectionArrDepreciatedQuerier";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { useStateQuerierBaseProps } from "./useBaseQuerierProps";

export function useSectionArrQueries(
  sectionName: SavableSectionName<"arrStore">
) {
  const baseProps = useStateQuerierBaseProps();
  const stateQuerier = new SectionArrAnalyzerQuerier({
    ...baseProps,
    sectionName,
  });
  return {
    replaceSavedSectionArr: () => stateQuerier.updateSavedSectionArr(),
  };
}

type UseSectionArrStateQuerierProps = {
  sectionName: SectionName<"arrStore">;
};
interface SectionArrStateQuerierProps
  extends StateQuerierBaseProps,
    UseSectionArrStateQuerierProps {}

//
class SectionArrAnalyzerQuerier extends StateQuerierBase {
  sectionName: SectionName<"arrStore">;
  constructor({ sectionName, ...baseProps }: SectionArrStateQuerierProps) {
    super(baseProps);
    this.sectionName = sectionName;
  }

  private get arrQuerier() {
    return new SectionArrDepreciatedQuerier({ sectionName: this.sectionName });
  }

  async updateSavedSectionArr() {
    const sectionPack = this.sections.makeRawSectionPackArr(this.sectionName);
    this.arrQuerier.replace(sectionPack);
  }
}
