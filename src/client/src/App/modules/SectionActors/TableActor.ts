import { sectionsMeta } from "../../sharedWithServer/SectionsMeta";
import { DbStoreNameByType } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { VarbInfoMixedFocal } from "../../sharedWithServer/SectionsMeta/SectionInfo/MixedSectionInfo";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSection } from "../../sharedWithServer/StateSetters/SetterSection";
import { SetterTable } from "../../sharedWithServer/StateSetters/SetterTable";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import {
  CompareTableBuilder,
  SortOptions,
} from "../SectionSolvers/CompareTableBuilder";
import { SectionActorBase, SectionActorBaseProps } from "./SectionActorBase";

class GetterColumn extends GetterSection<"column"> {
  get displayNameOrNotFound(): string {
    const varbInfo = this.valueNext("varbInfo");
    if (!varbInfo) throw new Error("varbInfo can't be null here");
    switch (varbInfo.infoType) {
      case "pathName":
      case "pathNameDbId": {
        const { displayName } = this.varbByFocalMixed(varbInfo);
        return displayName;
      }
      case "globalSection": {
        const { displayName } = sectionsMeta.varb(varbInfo);
        if (typeof displayName === "string") {
          return displayName;
        } else {
          throw new Error("displayName must be a hardcoded string here.");
        }
      }
      case "dbId": {
        const userVarbInfo = {
          ...varbInfo,
          sectionName: "userVarbItem",
          varbName: "value",
        } as const;
        if (this.sections.hasSectionMixed(userVarbInfo)) {
          const varb = this.sections.varbByMixed(userVarbInfo);
          return varb.displayName;
        } else return "Variable not found";
      }
      case "varbPathName": {
        if (this.hasVarbByFocalMixed(varbInfo)) {
          const varb = this.varbByFocalMixed(varbInfo);
          return varb.displayName;
        } else {
          throw new Error(
            `Varb not found with varbPathName ${varbInfo.varbPathName}`
          );
        }
      }
      default: {
        throw new Error(`varbInfo of type ${varbInfo.infoType} not handled`);
      }
    }
  }
}

interface TableActorProps
  extends StrictOmit<SectionActorBaseProps<"compareTable">, "sectionName"> {
  rowSourceName: DbStoreNameByType<"mainIndex">;
}
export class TableActor extends SectionActorBase<"compareTable"> {
  readonly rowSourceName: DbStoreNameByType<"mainIndex">;
  constructor({ rowSourceName, ...props }: TableActorProps) {
    super({
      ...props,
      sectionName: "compareTable",
    });
    this.rowSourceName = rowSourceName;
  }
  get tableBuilder() {
    return new CompareTableBuilder(this.get.getterSectionProps);
  }
  get tableSetter(): SetterTable {
    return new SetterTable(this.sectionActorBaseProps);
  }
  get get(): GetterSection<"compareTable"> {
    return new GetterSection(this.sectionActorBaseProps);
  }
  get setter() {
    return new SetterSection(this.sectionActorBaseProps);
  }
  get packMaker() {
    return new PackMakerSection(this.sectionActorBaseProps);
  }
  get rows(): GetterSection<"tableRow">[] {
    return this.get.children("tableRow");
  }
  get compareRowProxies(): GetterSection<"proxyStoreItem">[] {
    const compareRows = this.get.children("compareRow");
    return compareRows.filter((row) =>
      this.tableBuilder.hasRowByDbId(row.valueNext("dbId"))
    );
  }
  get columns(): GetterColumn[] {
    return this.get.children("column").map((col) => {
      return new GetterColumn(col.getterSectionProps);
    });
  }
  get filteredRows() {
    const titleFilter = this.get.value("titleFilter", "string");
    return this.rows.filter((row) => {
      return row.value("displayName", "string").includes(titleFilter);
    });
  }
  get filteredMinusComparedRows() {
    return this.filteredRows.filter((row) => {
      return !this.get.hasChildByValue({
        childName: "compareRow",
        varbName: "dbId",
        value: row.dbId,
      });
    });
  }
  async sortRowsByDisplayName(options?: SortOptions): Promise<void> {
    this.tableSetter.sortRowsByDisplayName(options);
    // this.sendTable();
  }
  async sortRowsByColumn(
    colFeId: string,
    options?: SortOptions
  ): Promise<void> {
    this.tableSetter.sortRowsByColumn(colFeId, options);
    // this.sendTable();
  }
  async removeColumn(columnFeId: string) {
    this.tableSetter.removeColumn(columnFeId);
  }
  async addColumn(varbInfo: VarbInfoMixedFocal) {
    const { setter } = this;
    // this is to initialize the setter's "initialSections"

    this.tableSetter.addColumn(varbInfo);
    setter.tryAndRevertIfFail(
      () => false
      // sendColumns
      // on the server, create and send back the new cells
      // add the cells to the existing rows
    );
  }
}
