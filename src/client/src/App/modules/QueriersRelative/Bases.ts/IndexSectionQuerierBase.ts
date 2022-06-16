import { SectionName } from "../../../sharedWithServer/SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import {
  ApiQuerierBase,
  ApiQuerierBaseProps,
} from "../../QueriersBasic/Bases/ApiQuerierBase";

export interface IndexSectionQuerierProps<
  SN extends SectionName<"hasIndexStore">
> extends GetterSectionProps<SN>,
    ApiQuerierBaseProps {
  indexName: SectionName<"indexStore">;
}
export class IndexSectionQuerierBase<
  SN extends SectionName<"hasIndexStore">
> extends ApiQuerierBase {
  readonly getterSectionBase: GetterSectionBase<SN>;
  readonly indexName: SectionName<"indexStore">;
  constructor({
    apiQueries,
    indexName,
    ...rest
  }: IndexSectionQuerierProps<SN>) {
    super({ apiQueries });
    this.getterSectionBase = new GetterSectionBase(rest);
    this.indexName = indexName;
  }
  get indexSectionQuerierProps(): IndexSectionQuerierProps<SN> {
    return {
      ...this.getterSectionBase.getterSectionProps,
      apiQueries: this.apiQueries,
      indexName: this.indexName,
    };
  }
}
