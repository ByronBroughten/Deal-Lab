import Analyzer from "../../Analyzer";
import { FeInfo, InfoS } from "../../SectionMetas/Info";
import { FeSectionPack } from "../FeSectionPack";

export function saveNewSectionToFullIndexStore(
  this: Analyzer,
  feInfo: FeInfo<"hasAnyIndexStore">
): Analyzer {
  let next = this.resetSectionAndChildDbIds(feInfo);
  const rawFeSectionPack = next.makeRawSectionPack(feInfo);

  const sourceSectionPack = new FeSectionPack(rawFeSectionPack);
  const indexStoreName = next.section(feInfo).meta.get("indexStoreName");
  const indexSectionPack = sourceSectionPack.changeType(indexStoreName);

  const indexParentInfo = next.parent(indexStoreName).feInfo;
  return next.loadRawSectionPack(indexSectionPack.core, {
    parentFinder: indexParentInfo,
  });
}

export function updateFullIndexStoreSection(
  this: Analyzer,
  feInfo: FeInfo<"hasAnyIndexStore">
): Analyzer {
  const rawFeSectionPack = this.makeRawSectionPack(feInfo);
  const sourceSectionPack = new FeSectionPack(rawFeSectionPack);
  const indexStoreName = this.section(feInfo).meta.get("indexStoreName");
  const indexSectionPack = sourceSectionPack.changeType(indexStoreName);

  const storeDbInfo = InfoS.db(indexStoreName, indexSectionPack.dbId);
  return this.replaceSectionAndSolve(storeDbInfo, indexSectionPack.core);
}
