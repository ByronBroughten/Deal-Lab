import { sectionMetas } from "../../sharedWithServer/SectionsMeta";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SetterSectionBase } from "../../sharedWithServer/StateSetters/SetterBases/SetterSectionBase";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";

class MainSectionActor<
  SN extends SectionName<"hasRowIndex">
> extends SetterSectionBase<SN> {
  get setter(): SetterSection<SN> {
    return new SetterSection(this.setterSectionProps);
  }
  get getterSections() {
    return new GetterSections(this.setterSectionsProps);
  }
  private get indexName(): SectionName<"rowIndexNext"> {
    return this.setter.meta.get("rowIndexName");
  }
  private get indexTableName(): SectionName<"tableName"> {
    return sectionMetas.section(this.indexName).get("indexTableName");
  }
  private get table(): SetterTable {
    const { main } = this.getterSections;
    return new SetterTable({
      ...this.setterSectionsProps,
      ...main.onlyChild(this.indexTableName).feInfo,
    });

    this.nextSections = next.addSectionAndSolve(
      "tableRow",
      this.indexTableName
    );
  }
  replaceWithDefault() {
    this.setter.replaceWithDefault();
  }
  async saveNew() {}
  async saveUpdates() {}
  async add(): Promise<string> {
    this.addToFeRowIndexStore();
    return this.tryAndRevertIfFail(async () =>
      this.indexQuerier.add(this.feId)
    );
  }
  private addToFeRowIndexStore() {
    const feInfo = this.sectionFeInfo;
    let next = this.sections.resetSectionAndChildDbIds(feInfo);
    this.nextSections = next.addSectionAndSolve(
      "tableRow",
      this.indexTableName
    );
    this.initRowCells();
    this.setNextSectionsAsState();
  }
  private initRowCells() {
    let next = this.nextSections;
    const columns = next.childSections(this.indexTableName, "column");
    for (const column of columns) {
      const varbInfo = column.varbInfoValues();
      const varbFinder = this.getVarbFinder(varbInfo);
      const varb = next.findVarb(varbFinder);
      const value = varb ? varb.value("numObj") : "Not Found";
      next = next.addSectionsAndSolveNext([
        {
          sectionName: "cell",
          parentInfo: next.section(this.rowDbInfo).feInfo,
          dbVarbs: {
            ...varbInfo,
            value,
          },
        },
      ]);
    }
    this.nextSections = next;
  }
  private getVarbFinder(
    varbInfo: InEntityVarbInfo
  ): FeVarbInfo<SectionName<"hasRowIndex">> | InEntityVarbInfo {
    if (varbInfo.sectionName === this.indexName) {
      return InfoS.feVarb(varbInfo.varbName, this.sectionFeInfo);
    } else return varbInfo;
  }

  async update(): Promise<string> {
    this.updateFeRowIndexStore();
    return this.tryAndRevertIfFail(async () =>
      this.indexQuerier.update(this.feId)
    );
  }
  private updateFeRowIndexStore() {
    this.nextSections = this.sections.eraseChildren(this.rowDbInfo, "cell");
    this.initRowCells();
    this.setNextSectionsAsState();
  }
}
