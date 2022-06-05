import { SavableSectionName } from "../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { SectionArrQuerier } from "../QueriersBasic/SectionArrQuerier";
import { useStateQuerierBaseProps } from "../useQueryActions/useBaseQuerierProps";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";

export function useSectionArrQueries(
  sectionName: SavableSectionName<"arrStore">
) {
  const baseProps = useStateQuerierBaseProps();
  const stateQuerier = new SectionArrStateQuerier({
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

class SectionArrStateQuerier extends StateQuerierBase {
  sectionName: SectionName<"arrStore">;
  constructor({ sectionName, ...baseProps }: SectionArrStateQuerierProps) {
    super(baseProps);
    this.sectionName = sectionName;
  }

  private get arrQuerier() {
    return new SectionArrQuerier(this.sectionName);
  }

  async updateSavedSectionArr() {
    const sectionPack = this.sections.makeRawSectionPackArr(this.sectionName);
    this.arrQuerier.replace(sectionPack);
  }
}
