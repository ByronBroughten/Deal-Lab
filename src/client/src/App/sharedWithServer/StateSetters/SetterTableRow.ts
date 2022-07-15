import { InEntityValueInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/InEntityVarbInfoValue";
import { StrictOmit } from "../utils/types";
import {
  SetterSectionBase,
  SetterSectionProps,
} from "./SetterBases/SetterSectionBase";
import { SetterSection } from "./SetterSection";

interface SetterTableRowProps
  extends StrictOmit<SetterSectionProps<"tableRow">, "sectionName"> {}

export class SetterTableRow extends SetterSectionBase<"tableRow"> {
  constructor(props: SetterTableRowProps) {
    super({
      ...props,
      sectionName: "tableRow",
    });
  }
  private setter = new SetterSection(this.setterSectionProps);
  get = this.setter.get;
  get dbId(): string {
    return this.get.dbId;
  }
  get title(): string {
    return this.get.value("title", "string");
  }
  clearCells(): void {
    this.setter.removeChildren("cell");
  }
  addCell(cellValueInfo: InEntityValueInfo, colDbId: string): void {
    const value =
      this.get.sections.numObjOrNotFoundByMixedAssertOne(cellValueInfo);
    this.setter.addChild("cell", {
      dbId: colDbId,
      dbVarbs: {
        varbInfo: cellValueInfo,
        value,
      },
    });
  }
}
