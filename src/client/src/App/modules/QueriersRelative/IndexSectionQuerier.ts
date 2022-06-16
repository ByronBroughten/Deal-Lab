import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
import {
  IndexSectionQuerierBase,
  IndexSectionQuerierProps,
} from "./Bases.ts/IndexSectionQuerierBase";

export class IndexSectionQuerier<
  SN extends SectionName<"hasIndexStore"> = SectionName<"hasIndexStore">
> extends IndexSectionQuerierBase<SN> {
  readonly query: SectionQuerier;
  private packMaker = new SectionPackMaker(this.indexSectionQuerierProps);
  constructor(props: IndexSectionQuerierProps<SN>) {
    super(props);
    this.query = new SectionQuerier({
      sectionName: this.indexName,
      apiQueries: this.apiQueries,
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
