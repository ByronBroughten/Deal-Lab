import { FeInfo, InfoS } from "../../sharedWithServer/SectionsMeta/Info";
import {
  SectionFinderNext,
  SectionName,
} from "../../sharedWithServer/SectionsMeta/SectionName";
import { IndexSectionQuerier } from "../QueriersRelative/IndexQuerier";
import {
  StateQuerierBase,
  StateQuerierBaseProps,
} from "../QueriersRelative/StateQuerierBase";
import { useAnalyzerContext } from "../usePropertyAnalyzer";

export type UseRowIndexActionsProps = {
  rowDbId: string;
  indexSourceFinder: SectionFinderNext<"hasRowIndex">;
};
export function useRowIndexActions(props: UseRowIndexActionsProps) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  const rowQuerier = new IndexRowStateQuerier({
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
    ...props,
  });

  return {
    load: () => rowQuerier.load(),
    deleteRowAndSource: () => rowQuerier.deleteIndexSection(),
  };
}

interface IndexRowStateQuerierProps
  extends StateQuerierBaseProps,
    UseRowIndexActionsProps {}
export class IndexRowStateQuerier extends StateQuerierBase {
  private rowDbId: string;
  private indexSourceFeInfo: FeInfo<"hasRowIndex">;
  constructor({
    rowDbId,
    indexSourceFinder,
    ...rest
  }: IndexRowStateQuerierProps) {
    super(rest);
    this.rowDbId = rowDbId;
    this.indexSourceFeInfo = this.sections.section(indexSourceFinder)
      .feInfo as FeInfo<"hasRowIndex">;
  }
  private get indexSourceName(): SectionName<"hasRowIndex"> {
    return this.indexSourceFeInfo.sectionName;
  }
  private get indexName(): SectionName<"rowIndexNext"> {
    return this.sections.sectionMeta(this.indexSourceName).get("rowIndexName");
  }
  private get indexSectionQuerier() {
    return new IndexSectionQuerier({
      sectionName: this.indexSourceFeInfo.sectionName,
      indexName: this.indexName,
      sections: this.nextSections,
    });
  }
  private get rowDbInfo() {
    return InfoS.db("tableRow", this.rowDbId);
  }
  async load() {
    const sectionPack = await this.indexSectionQuerier.get(this.rowDbId);
    this.nextSections = this.sections.replaceSectionAndSolve(
      this.indexSourceFeInfo,
      sectionPack
    );
    this.setNextSectionsAsState();
  }
  async deleteIndexSection(): Promise<string> {
    this.nextSections = this.sections.eraseSectionAndSolve(this.rowDbInfo);
    this.setNextSectionsAsState();
    return this.tryAndRevertIfFail(() =>
      this.indexSectionQuerier.delete(this.rowDbId)
    );
  }

  async copy() {
    // const sectionPack = this.indexSectionQuerier.get(
    //   this.rowDbId(rowFeId)
    // );
    // For now I don't really need "copy", cause I have "Save New"
    throw new Error("This isn't done yet.");
  }
}
