import {
  SectionPackRaw,
  ServerSectionPack,
} from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import {
  GetterListBase,
  GetterListProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterListBase";
import { SectionQuerier } from "../QueriersBasic/SectionQuerier";

interface IndexListQuerierProps<SN extends SectionName<"hasIndexStore">>
  extends GetterListProps<SN> {
  indexName: SectionName<"indexStore">;
}

export class IndexListQuerier<
  SN extends SectionName<"hasIndexStore"> = SectionName<"hasIndexStore">
> extends GetterListBase<SN> {
  indexName: SectionName<"indexStore">;
  constructor({ indexName, ...rest }: IndexListQuerierProps<SN>) {
    super(rest);
    this.indexName = indexName;
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
  private get query() {
    return new SectionQuerier(this.indexName);
  }
  async retriveFromIndex(dbId: string): Promise<SectionPackRaw<SN>> {
    const serverSectionPack = await this.query.get(dbId);
    return this.indexToSourceSectionPack(serverSectionPack);
  }
}
