import { FeSectionPack } from "../sharedWithServer/Analyzer/FeSectionPack";
import { sectionMetas } from "../sharedWithServer/SectionMetas";
import { Inf } from "../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../sharedWithServer/SectionMetas/SectionName";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { IndexSectionQuerier } from "./StateQueriersShared/IndexQuerier";

interface HasIndexNameProp {
  sectionName: SectionName<"hasFullIndex">;
}
interface IndexQuerierProps extends StateQuerierBaseProps, HasIndexNameProp {}
class FullIndexQuerier extends StateQuerierBase {
  sectionName: SectionName<"hasFullIndex">;
  constructor({ sectionName, ...rest }: IndexQuerierProps) {
    super(rest);
    this.sectionName = sectionName;
  }
  private get indexName() {
    return sectionMetas.section(this.sectionName).get("fullIndexName");
  }
  private get indexQuerier() {
    return new IndexSectionQuerier({
      sectionName: this.sectionName,
      indexName: this.indexName,
      sections: this.nextSections,
    });
  }
  saveNewSectionToFullIndexStore(feId: string) {
    

    let next = internal.resetSectionAndChildDbIds(this, feInfo);

    this.nextSections = this.sections.
    const rawFeSectionPack = next.makeRawSectionPack(feInfo);
  
    const sourceSectionPack = new FeSectionPack(rawFeSectionPack);
    const indexSectionPack = sourceSectionPack.changeType(this.indexName);
    const indexParentInfo = next.parent(indexStoreName).feInfo;
    return next.loadRawSectionPack(indexSectionPack.core, {
      parentFinder: indexParentInfo,
    });
  }

  add(feId: string) {
    const feInfo = Inf.fe(this.sectionName, feId);
    this.sections.saveNewSectionToFullIndexStore(feInfo)

  }
  update() {}
  get(dbId: string) {
    // Inf.db(this.sectionName)
    // just gets from the frontEnd
  }
  delete() {}
}

class RowIndexQuerier extends StateQuerierBase {
  add() {}
  update() {}
  get() {}
  delete() {}
}

// here I have two choices.
// unite fullFeIndexStore with rowFeIndexStore

// make one for feIndexStore and one for rowIndexStore
// the last parts of their functions will be the same.
// 1. Create a sectionPack
// 2. Send it to the dbIndexStore

// It's the front parts of the functions that are different.

async function saveNewFullIndexSection(feInfo: FeInfo<"hasAnyIndexStore">) {
  // handleSet won't work here because in next, the section to post has
  // altered dbIds
  const next = analyzer.saveNewSectionToFullIndexStore(feInfo);
  setAnalyzer(() => next);
  queryAndRevertSetIfFail("saveNewIndexSection", feInfo, next);
}
async function updateFullIndexSection(feInfo: FeInfo<"hasAnyIndexStore">) {
  const next = analyzer.updateFullIndexStoreSection(feInfo);
  setAnalyzer(() => next);
  queryAndRevertSetIfFail("updateIndexSection", feInfo, next);
}
// delete
async function deleteIndexEntry(
  sectionName: SectionName<"hasAnyIndexStore">,
  dbId: string
) {
  handleSet("eraseIndexAndSolve", sectionName, dbId);
  queryAndRevertSetIfFail("deleteIndexEntry", sectionName, dbId);
}
