import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { SectionsAndSetSections } from "../../sharedWithServer/stateClassHooks/useSections";
import {
  SetterSectionBase,
  SetterSectionProps,
} from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { ApiQuerierProps } from "../QueriersBasic/ApiQuerierNext";
import { ApiQueries } from "../useQueryActions/apiQueriesClient";

export interface SectionActorBaseProps<SN extends SectionName>
  extends SetterSectionProps<SN>,
    ApiQuerierProps {}

export class SectionActorBase<SN extends SectionName> {
  readonly setterSectionBase: SetterSectionBase<SN>;
  readonly apiQueries: ApiQueries;
  constructor({ apiQueries, ...props }: SectionActorBaseProps<SN>) {
    this.setterSectionBase = new SetterSectionBase(props);
    this.apiQueries = apiQueries;
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
