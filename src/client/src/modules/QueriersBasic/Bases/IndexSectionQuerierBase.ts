import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { SectionNameByType } from "../../../sharedWithServer/stateSchemas/SectionNameByType";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./ApiQuerierBase";

interface IndexSectionQuerierProps<
  SN extends SectionNameByType<"hasIndexStore">
> extends GetterSectionProps<SN>,
    ApiQuerierBaseProps {}

export class IndexSectionQuerierBase<
  SN extends SectionNameByType<"hasIndexStore">
> extends ApiQuerierBase {
  readonly getterSectionBase: GetterSectionBase<SN>;
  constructor({ apiQueries, ...rest }: IndexSectionQuerierProps<SN>) {
    super({ apiQueries });
    this.getterSectionBase = new GetterSectionBase(rest);
  }
  get indexSectionQuerierProps(): IndexSectionQuerierProps<SN> {
    return {
      ...this.getterSectionBase.getterSectionProps,
      apiQueries: this.apiQueries,
    };
  }
}
