import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SectionPackByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSectionProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { UpdaterSectionBase } from "../../sharedWithServer/StateUpdaters/bases/updaterSectionBase";
import { StrictOmit } from "../../sharedWithServer/utils/types";

type CompareTableProps = StrictOmit<
  GetterSectionProps<"compareTable">,
  "sectionName"
>;
export class CompareTableBuilder extends UpdaterSectionBase<"compareTable"> {
  constructor(props: CompareTableProps) {
    super({
      ...props,
      sectionName: "compareTable",
    });
  }
  get builder(): PackBuilderSection<"compareTable"> {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get get(): GetterSection<"compareTable"> {
    return new GetterSection(this.getterSectionProps);
  }
  updateColumns(columnPacks: SectionPack<"column">[]): void {
    this.builder.replaceChildren({
      childName: "column",
      sectionPacks: columnPacks,
    });
  }
  updateRows(rowPacks: SectionPack<"tableRow">[]): void {
    this.builder.replaceChildren({
      childName: "tableRow",
      sectionPacks: rowPacks,
    });
    this.removeUnusedCompareRows();
  }

  private removeUnusedCompareRows() {
    const compareRows = this.builder.children("compareRow");
    for (const row of compareRows) {
      if (!this.hasRowByDbId(row.get.valueNext("dbId"))) {
        this.builder.removeChild({
          childName: "compareRow",
          feId: row.feId,
        });
      }
    }
  }
  hasRowByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "tableRow",
      dbId,
    });
  }
  createRow(sourcePack: SectionPackByType<"hasIndexStore">): void {
    const source = PackBuilderSection.loadAsOmniChild(sourcePack).get;
    const displayName = source.valueNext("displayName").mainText;
    const row = this.builder.addAndGetChild("tableRow", {
      dbId: source.dbId,
      dbVarbs: { displayName },
    });
    for (const column of this.get.children("column")) {
      const varbInfo = column.valueInEntityInfo();
      let displayVarb = "N/A";
      if (source.sections.hasVarbMixed(varbInfo)) {
        const varb = source.varbByFocalMixed(column.valueInEntityInfo());
        displayVarb = varb.displayVarb();
      }
      row.addChild("cell", {
        dbVarbs: {
          columnFeId: column.feId,
          valueEntityInfo: varbInfo,
          displayVarb,
        },
      });
    }
  }
  get columnPacks(): SectionPack<"column">[] {
    return this.builder.makeChildPackArr("column");
  }
  get rowPacks(): SectionPack<"tableRow">[] {
    return this.builder.makeChildPackArr("tableRow");
  }
  static initAsOmniChild(): CompareTableBuilder {
    const compareTable = PackBuilderSection.initAsOmniChild("compareTable");
    return new CompareTableBuilder(compareTable.getterSectionProps);
  }
}
