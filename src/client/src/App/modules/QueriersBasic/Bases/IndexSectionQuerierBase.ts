import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./ApiQuerierBase";

interface IndexSectionQuerierProps<SN extends SectionName<"hasIndexStore">>
  extends GetterSectionProps<SN>,
    ApiQuerierBaseProps {}

export class IndexSectionQuerierBase<
  SN extends SectionName<"hasIndexStore">
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
