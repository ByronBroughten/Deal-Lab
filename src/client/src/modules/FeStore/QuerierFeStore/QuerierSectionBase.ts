import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";
import { SectionNameByType } from "../../../sharedWithServer/stateSchemas/schema6SectionChildren/SectionNameByType";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./ApiQuerierBase";

export interface QuerierSectionBaseProps<SN extends SectionNameByType>
  extends ApiQuerierBaseProps,
    GetterSectionProps<SN> {}

export class QuerierSectionBase<SN extends SectionName> extends ApiQuerierBase {
  readonly getterSectionBase: GetterSectionBase<SN>;
  get get() {
    return new GetterSection(this.sectionActorBaseProps);
  }
  constructor(props: QuerierSectionBaseProps<SN>) {
    super(props);
    this.getterSectionBase = new GetterSectionBase(props);
  }
  get sectionActorBaseProps(): QuerierSectionBaseProps<SN> {
    return {
      ...this.getterSectionBase.getterSectionProps,
      apiQueries: this.apiQueries,
    };
  }
}
