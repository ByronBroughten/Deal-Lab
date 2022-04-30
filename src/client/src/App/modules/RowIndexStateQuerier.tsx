import { sectionMetas } from "../sharedWithServer/SectionMetas";
import { DbInfo, FeInfo, InfoS } from "../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../sharedWithServer/SectionMetas/SectionName";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { IndexSectionQuerier } from "./StateQueriersShared/IndexQuerier";

interface HasRowIndexNameProp {
  sectionName: SectionName<"hasRowIndex">;
}
interface RowIndexStateQuerierProps
  extends StateQuerierBaseProps,
    HasRowIndexNameProp {}
export class RowIndexStateQuerier extends StateQuerierBase {
  sectionName: SectionName<"hasRowIndex">;
  constructor({ sectionName, ...rest }: RowIndexStateQuerierProps) {
    super(rest);
    this.sectionName = sectionName;
  }

  private sectionFeInfo(feId: string): FeInfo<"hasRowIndex"> {
    return InfoS.fe(this.sectionName, feId);
  }

  private indexDbInfo(dbId: string): DbInfo<"rowIndexNext"> {
    return InfoS.db(this.indexName, dbId);
  }
  private get indexQuerier() {
    return new IndexSectionQuerier({
      sectionName: this.sectionName,
      indexName: this.indexName,
      sections: this.nextSections,
    });
  }

  private get indexName(): SectionName<"rowIndexNext"> {
    return sectionMetas.section(this.sectionName).get("rowIndexName");
  }
  private get indexTableName(): SectionName<"tableNext"> {
    return sectionMetas.section(this.indexName).get("indexTableName");
  }
  private rowDbInfo(dbId: string) {
    return InfoS.db("tableRow", dbId);
  }

  resetRowCells(dbId: string) {
    // when this fully works with property, mgmt, and loan columns,
    // it will need to change somewhat.
    const rowInfo = this.rowDbInfo(dbId);
    let next = this.sections.eraseChildren(rowInfo, "cell");

    const columns = next.childSections(this.indexTableName, "column");

    for (const column of columns) {
      const varbInfo = column.varbInfoValues();
      const varb = next.findVarb(varbInfo);
      const value = varb ? varb.value("numObj") : "Not Found";

      // I just need to be able to add the cell with the value
      // next = next.addSectionsAndSolveNext([
      //   {
      //     sectionName: "cell",
      //     parentFinder: rowInfo,
      //     dbVarbs: {
      //       ...varbInfo,
      //       value,
      //     },
      //   },
      // ]);
    }
    this.nextSections = next;
  }

  addToFeRowIndexStore(feId: string) {
    const feInfo = this.sectionFeInfo(feId);
    let next = this.sections.resetSectionAndChildDbIds(feInfo);

    // Add a new empty row
    // loop through the table columns and get the values
    // as necessary.

    // I'll do the other ones, first.
    throw new Error("this isn't done yet");
    // this.setNextSectionsAsState();
  }

  // updateFeRow(dbId: string): Promise<string> {}
  private deleteFeRowIndex(dbId: string) {
    const dbInfo = InfoS.db("tableRow", dbId);
    this.nextSections = this.sections.eraseSectionAndSolve(dbInfo);
    this.setNextSectionsAsState();
  }

  async add(feId: string): Promise<string> {
    this.addToFeRowIndexStore(feId);
    return this.tryAndRevertIfFail(async () => this.indexQuerier.add(feId));
  }
  // update(feId: string): Promise<string> {}
  async replaceFromIndex(dbId: string) {
    const sectionPack = await this.indexQuerier.get(dbId);
  }
  async delete(dbId: string): Promise<string> {
    this.deleteFeRowIndex(dbId);
    return this.tryAndRevertIfFail(async () => this.indexQuerier.delete(dbId));
  }
}
