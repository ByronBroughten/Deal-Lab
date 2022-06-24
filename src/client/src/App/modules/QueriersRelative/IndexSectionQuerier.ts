import { ServerSectionPack } from "../../sharedWithServer/SectionPack/SectionPack";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";
import {
  IndexSectionQuerierBase,
  IndexSectionQuerierProps,
} from "./Bases.ts/IndexSectionQuerierBase";

export class IndexSectionQuerier<
  SN extends SectionName<"hasIndexStore"> = SectionName<"hasIndexStore">
> extends IndexSectionQuerierBase<SN> {
  readonly query: SectionQuerier;
  private packMaker = new PackMakerSection(this.indexSectionQuerierProps);
  constructor(props: IndexSectionQuerierProps<SN>) {
    super(props);
    this.query = new SectionQuerier({
      sectionName: this.indexName,
      apiQueries: this.apiQueries,
    });
  }
  makeIndexSectionPack(): ServerSectionPack {
    return this.packMaker.makeSectionPack() as any as ServerSectionPack;
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
