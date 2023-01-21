import {
  CompareTableBuilder,
  SortOptions,
} from "../../modules/SectionSolvers/CompareTableBuilder";
import { InEntityVarbInfo } from "../SectionsMeta/allBaseSectionVarbs/baseValues/entities";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { DbVarbs } from "../SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { GetterSection } from "../StateGetters/GetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterSection } from "./SetterSection";
import { SetterTableRow } from "./SetterTableRow";

export class SetterTable extends SetterSectionBase<"compareTable"> {
  get setter() {
    return new SetterSection(this.setterSectionProps);
  }
  get get(): GetterSection<"compareTable"> {
    return this.setter.get;
  }
  get updater(): UpdaterSection<"compareTable"> {
    return new UpdaterSection(this.setterSectionProps);
  }
  get tableBuilder() {
    return new CompareTableBuilder(this.get.getterSectionProps);
  }
  updateRows(rowPacks: SectionPack<"tableRow">[]) {
    this.tableBuilder.updateRows(rowPacks);
    this.setter.setSections();
  }
  sortRowsByDisplayName(options?: SortOptions): void {
    this.tableBuilder.sortRowsByDisplayName(options);
    this.setSections();
  }
  sortRowsByColumn(colFeId: string, options?: SortOptions) {
    this.tableBuilder.sortRowsByColumn(colFeId, options);
    this.setSections();
  }
  column(feId: string): GetterSection<"column"> {
    return this.tableBuilder.column(feId);
  }
  hasColumn(feId: string): boolean {
    return this.tableBuilder.hasColumn(feId);
  }
  row(feId: string): SetterTableRow {
    return new SetterTableRow({
      ...this.setterSectionsProps,
      feId,
    });
  }
  hasRowByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "tableRow",
      dbId,
    });
  }
  rowByDbId(dbId: string): SetterTableRow {
    const { feId } = this.get.sections.sectionByDbInfo({
      dbId,
      sectionName: "tableRow",
    });
    return this.row(feId);
  }
  get columns(): GetterSection<"column">[] {
    return this.get.children("column");
  }
  addRow({ displayName, dbId }: { displayName: string; dbId: string }): void {
    this.setter.addChild("tableRow", {
      dbId,
      dbVarbs: {
        displayName,
      },
    });
  }
  removeRow(dbId: string): void {
    const { feId } = this.rowByDbId(dbId).get;
    this.setter.removeChild({
      childName: "tableRow",
      feId,
    });
  }
  addColumn(entityInfo: InEntityVarbInfo): void {
    this.setter.addChild("column", {
      dbVarbs: entityInfo as any as DbVarbs,
    });
  }
  removeColumn(feId: string): void {
    this.setter.removeChild({
      childName: "column",
      feId,
    });
  }
}
