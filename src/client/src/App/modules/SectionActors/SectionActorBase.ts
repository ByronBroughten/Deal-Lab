import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { SectionsAndSetSections } from "../../sharedWithServer/stateClassHooks/useSections";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import {
  SetterSectionBase,
  SetterSectionProps,
} from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import {
  ApiQuerierBase,
  ApiQuerierBaseProps,
} from "../QueriersBasic/Bases/ApiQuerierBase";

export interface SectionActorBaseProps<SN extends SectionNameByType>
  extends ApiQuerierBaseProps,
    SetterSectionProps<SN> {}

export class SectionActorBase<
  SN extends SectionNameByType
> extends ApiQuerierBase {
  readonly setterSectionBase: SetterSectionBase<SN>;
  get get() {
    return new GetterSection(this.sectionActorBaseProps);
  }
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
