// import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
// import { sectionMetas } from "../../sharedWithServer/SectionsMeta";
// import {
//   DbInfo,
//   FeInfo,
//   InfoS,
// } from "../../sharedWithServer/SectionsMeta/Info";
// import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
// import { IndexSectionQuerier } from "./IndexSectionQuerier";
// import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";

// interface ReplaceProps {
//   sectionFeId: string;
//   indexDbId: string;
// }
// interface HasFullIndexNameProp {
//   sectionName: SectionName<"hasFullIndex">;
// }
// interface IndexQuerierProps
//   extends StateQuerierBaseProps,
//     HasFullIndexNameProp {}
// export class FullIndexQuerier extends StateQuerierBase {
//   sectionName: SectionName<"hasFullIndex">;
//   constructor({ sectionName, ...rest }: IndexQuerierProps) {
//     super(rest);
//     this.sectionName = sectionName;
//   }
//   private sectionFeInfo(feId: string): FeInfo<"hasFullIndex"> {
//     return InfoS.fe(this.sectionName, feId);
//   }
//   private indexDbInfo(dbId: string): DbInfo<"fullIndex"> {
//     return InfoS.db(this.indexName, dbId);
//   }
//   private get indexName() {
//     return sectionMetas.section(this.sectionName).get("fullIndexName");
//   }
//   private get indexQuerier() {
//     return new IndexSectionQuerierDepreciated({
//       sectionName: this.sectionName,
//       indexName: this.indexName,
//       sections: this.nextSections,
//     });
//   }

//   private addToFeIndexStore(feId: string) {
//     const feInfo = this.sectionFeInfo(feId);
//     let next = this.sections.resetSectionAndChildDbIds(feInfo);
//     const rawFeSectionPack = next.makeRawSectionPack(feInfo);

//     const sourceSectionPack = new FeSectionPack(rawFeSectionPack);
//     const indexSectionPack = sourceSectionPack.changeType(this.indexName);
//     const indexParentInfo = next.parent(this.indexName).feInfo;
//     this.nextSections = next.loadRawSectionPack(indexSectionPack.core, {
//       parentInfo: indexParentInfo,
//     });
//     this.setNextSectionsAsState();
//   }

//   private updateIndexStore(feId: string) {
//     const feInfo = this.sectionFeInfo(feId);
//     const rawSectionPack = this.sections.makeRawSectionPack(feInfo);
//     const sourceSectionPack = new FeSectionPack(rawSectionPack);
//     const indexSectionPack = sourceSectionPack.changeType(this.indexName);
//     const indexDbInfo = this.indexDbInfo(indexSectionPack.dbId);
//     this.nextSections = this.sections.replaceSectionAndSolve(
//       indexDbInfo,
//       indexSectionPack.core
//     );
//     this.setNextSectionsAsState();
//   }

//   async add(feId: string): Promise<string> {
//     this.addToFeIndexStore(feId);
//     return this.tryAndRevertIfFail(async () => this.indexQuerier.add(feId));
//   }
//   async update(feId: string) {
//     this.updateIndexStore(feId);
//     return this.tryAndRevertIfFail(async () => this.indexQuerier.update(feId));
//   }
//   async delete(dbId: string): Promise<string> {
//     const dbInfo = this.indexDbInfo(dbId);
//     this.nextSections = this.sections.eraseSectionAndSolve(dbInfo);
//     this.setNextSectionsAsState();
//     return this.tryAndRevertIfFail(async () => this.indexQuerier.delete(dbId));
//   }
//   replaceFromIndex({ sectionFeId, indexDbId }: ReplaceProps): void {
//     const dbInfo = this.indexDbInfo(indexDbId);
//     const rawSectionPack = this.sections.makeRawSectionPack(dbInfo);
//     const indexSectionPack = new FeSectionPack(rawSectionPack);
//     const sourceSectionPack = indexSectionPack.changeType(this.sectionName);
//     const feInfo = this.sectionFeInfo(sectionFeId);
//     this.nextSections = this.sections.replaceSectionAndSolve(
//       feInfo,
//       sourceSectionPack.core
//     );
//     this.setNextSectionsAsState();
//   }
// }
