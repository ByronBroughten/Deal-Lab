import { sectionMetas } from "../sharedWithServer/SectionMetas";
import { InEntityVarbInfo } from "../sharedWithServer/SectionMetas/baseSections/baseValues/entities";
import { DbInfo, FeInfo, InfoS } from "../sharedWithServer/SectionMetas/Info";
import { FeVarbInfo } from "../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../sharedWithServer/SectionMetas/SectionName";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { IndexSectionQuerier } from "./StateQueriersShared/IndexQuerier";
import { useAnalyzerContext } from "./usePropertyAnalyzer";

export function useMainSectionIndexActions(feInfo: FeInfo<"hasRowIndex">) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();

  const { sectionName, id: feId } = feInfo;
  const mainSectionIndexQuerier = new MainSectionIndexStateQuerier({
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
    sectionName,
    feId,
  });
  return {
    saveNew: () => mainSectionIndexQuerier.add(),
    update: () => mainSectionIndexQuerier.update(),
  };
}

interface UseMainSectionIndexActionsProps {
  sectionName: SectionName<"hasRowIndex">;
  feId: string;
}
interface MainSectionIndexStateQuerierProps
  extends StateQuerierBaseProps,
    UseMainSectionIndexActionsProps {}
export class MainSectionIndexStateQuerier extends StateQuerierBase {
  sectionName: SectionName<"hasRowIndex">;
  feId: string;
  constructor({
    sectionName,
    feId,
    ...rest
  }: MainSectionIndexStateQuerierProps) {
    super(rest);
    this.sectionName = sectionName;
    this.feId = feId;
  }
  private get sectionFeInfo(): FeInfo<"hasRowIndex"> {
    return InfoS.fe(this.sectionName, this.feId);
  }
  private get rowDbInfo(): DbInfo<"tableRow"> {
    const { dbId } = this.sections.section(this.sectionFeInfo);
    return InfoS.db("tableRow", dbId);
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
          parentFinder: next.section(this.rowDbInfo).feInfo,
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
