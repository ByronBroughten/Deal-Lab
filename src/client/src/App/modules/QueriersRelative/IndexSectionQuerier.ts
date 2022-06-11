import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { ApiQuerierProps } from "../QueriersBasic/ApiQuerierNext";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";

export interface IndexSectionQuerierProps<
  SN extends SectionName<"hasIndexStore">
> extends GetterSectionProps<SN>,
    ApiQuerierProps {
  indexName: SectionName<"indexStore">;
}

export class IndexSectionQuerier<
  SN extends SectionName<"hasIndexStore"> = SectionName<"hasIndexStore">
> extends GetterSectionBase<SN> {
  readonly indexName: SectionName<"indexStore">;
  private query: SectionQuerier;
  private packMaker = new SectionPackMaker(this.getterSectionProps);
  constructor({
    indexName,
    apiQueries,
    ...rest
  }: IndexSectionQuerierProps<SN>) {
    super(rest);
    this.indexName = indexName;
    this.query = new SectionQuerier({
      sectionName: indexName,
      apiQueries,
    });
  }
  makeIndexSectionPack(): ServerSectionPack {
    const sourceSectionPack = this.packMaker.makeSectionPack();
    return (
      FeSectionPack.rawFeToServer as (...props: any[]) => ServerSectionPack
    )(sourceSectionPack, this.indexName);
  }
  async saveNewToIndex(): Promise<void> {
    await this.query.add(this.makeIndexSectionPack());
  }
  async updateIndex(): Promise<void> {
    await this.query.update(this.makeIndexSectionPack());
  }
}

// Doesn't require source, nor state:
// - save with sectionPack
// - update with sectionPack
// - get (sectionPack)
// - delete
// the table will have access to these, particularly delete

// Requires source and state:
// - save
// - update
// - load
// the section menu will have access to these
// load may require more info than the other two
