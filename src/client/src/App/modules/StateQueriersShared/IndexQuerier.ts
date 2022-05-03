import Analyzer from "../../sharedWithServer/Analyzer";
import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import {
  SectionPackRaw,
  ServerSectionPack,
} from "../../sharedWithServer/Analyzer/SectionPackRaw";
import { FeInfo, InfoS } from "../../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/SectionMetas/SectionName";
import { SectionQuerier } from "./Queriers";

interface IndexSectionQuerierProps {
  sectionName: SectionName<"hasIndexStore">;
  indexName: SectionName<"indexStore">;
  sections: Analyzer;
}

export class IndexSectionQuerier {
  sectionName: SectionName<"hasIndexStore">;
  indexName: SectionName<"indexStore">;
  sections: Analyzer;
  constructor({ sectionName, indexName, sections }: IndexSectionQuerierProps) {
    this.sections = sections;
    this.sectionName = sectionName;
    this.indexName = indexName;
  }
  private feInfo(feId: string): FeInfo<"hasIndexStore"> {
    return InfoS.fe(this.sectionName, feId);
  }
  indexSectionPack(feId: string): ServerSectionPack {
    const feInfo = this.feInfo(feId);
    const feSectionPack = this.sections.makeRawSectionPack(
      feInfo
    ) as SectionPackRaw<typeof feInfo.sectionName>;
    return (
      FeSectionPack.rawFeToServer as (...props: any[]) => ServerSectionPack
    )(feSectionPack, this.indexName);
  }
  private indexToSourceSectionPack(
    indexSectionPack: ServerSectionPack
  ): SectionPackRaw<SectionName<"hasIndexStore">> {
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
  private get sectionQuery() {
    return new SectionQuerier(this.indexName);
  }

  async add(feId: string): Promise<string> {
    return await this.sectionQuery.add(this.indexSectionPack(feId));
  }
  async update(feId: string): Promise<string> {
    return await this.sectionQuery.update(this.indexSectionPack(feId));
  }
  async get(
    dbId: string
  ): Promise<SectionPackRaw<SectionName<"hasIndexStore">>> {
    const serverSectionPack = await this.sectionQuery.get(dbId);
    return this.indexToSourceSectionPack(serverSectionPack);
  }
  async delete(dbId: string): Promise<string> {
    return await this.sectionQuery.delete(dbId);
  }
}
