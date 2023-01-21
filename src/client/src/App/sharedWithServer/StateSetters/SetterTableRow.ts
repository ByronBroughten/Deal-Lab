import { ValueIdInEntityInfo } from "../SectionsMeta/allBaseSectionVarbs/baseValues/InEntityIdInfoValue";
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
  private get setter() {
    return new SetterSection(this.setterSectionProps);
  }
  get get() {
    return this.setter.get;
  }
  get dbId(): string {
    return this.get.dbId;
  }
  get displayName(): string {
    return this.get.value("displayName", "string");
  }
  clearCells(): void {
    this.setter.removeChildren("cell");
  }
  addCell(cellValueInfo: ValueIdInEntityInfo, colDbId: string): void {
    const displayVarb =
      this.get.numObjOrNotFoundByMixedAssertOne(cellValueInfo);
    this.setter.addChild("cell", {
      dbId: colDbId,
      dbVarbs: {
        valueEntityInfo: cellValueInfo,
        displayVarb,
      },
    });
  }
}
