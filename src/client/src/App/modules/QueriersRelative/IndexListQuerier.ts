import {
  SectionPackRaw,
  ServerSectionPack,
} from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import {
  GetterListBase,
  GetterListProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterListBase";
import { ApiQuerierBaseProps } from "../QueriersBasic/Bases/ApiQuerierBase";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";

interface IndexListQuerierProps<SN extends SectionName<"hasIndexStore">>
  extends GetterListProps<SN>,
    ApiQuerierBaseProps {
  indexName: SectionName<"indexStore">;
}

export class IndexListQuerier<
  SN extends SectionName<"hasIndexStore"> = SectionName<"hasIndexStore">
> extends GetterListBase<SN> {
  readonly indexName: SectionName<"indexStore">;
  readonly query: SectionQuerier;
  constructor({ indexName, apiQueries, ...rest }: IndexListQuerierProps<SN>) {
    super(rest);
    this.indexName = indexName;
    this.query = new SectionQuerier({
      sectionName: indexName,
      apiQueries,
    });
  }
  private indexToSourceSectionPack(
    indexSectionPack: ServerSectionPack
  ): SectionPackRaw<SN> {
    return {
      sectionName: this.sectionName,
      dbId: indexSectionPack.dbId,
      rawSections: {
        ...indexSectionPack.rawSections,
        [this.sectionName]: indexSectionPack.rawSections[
          this.indexName as SectionName<"dbStoreNext">
        ] as any,
      } as any,
    };
  }
  async retriveFromIndex(dbId: string): Promise<SectionPackRaw<SN>> {
    const serverSectionPack = await this.query.get(dbId);
    return this.indexToSourceSectionPack(serverSectionPack);
  }
  async deleteFromIndex(dbId: string): Promise<void> {
    this.query.delete(dbId);
  }
}
