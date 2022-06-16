import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { SectionsAndSetSections } from "../../sharedWithServer/stateClassHooks/useSections";
import {
  SetterSectionBase,
  SetterSectionProps,
} from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import {
  ApiQuerierBase,
  ApiQuerierBaseProps,
} from "../QueriersBasic/Bases/ApiQuerierBase";

export interface SectionActorBaseProps<SN extends SectionName>
  extends SetterSectionProps<SN>,
    ApiQuerierBaseProps {}

export class SectionActorBase<SN extends SectionName> extends ApiQuerierBase {
  readonly setterSectionBase: SetterSectionBase<SN>;
  constructor(props: SectionActorBaseProps<SN>) {
    super(props);
    this.setterSectionBase = new SetterSectionBase(props);
  }
  get sectionActorBaseProps(): SectionActorBaseProps<SN> {
    return {
      ...this.setterSectionBase.setterSectionProps,
      apiQueries: this.apiQueries,
    };
  }
  updateSetterProps(props: SectionsAndSetSections): void {
    this.setterSectionBase.updateSetterProps(props);
  }
}
