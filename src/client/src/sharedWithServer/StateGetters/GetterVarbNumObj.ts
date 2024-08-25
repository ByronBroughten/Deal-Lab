import { round } from "lodash";
import { SectionNameByType } from "../SectionNameByType";
import {
  EntitiesAndEditorText,
  NumberOrQ,
  NumObj,
  NumObjOutput,
} from "../stateSchemas/StateValue/NumObj";
import { ValueInEntity } from "../stateSchemas/StateValue/stateValuesShared/entities";
import { Arr } from "../utils/Arr";
import { arithmeticOperatorsArr, evaluate, mathS } from "../utils/math";
import { Str } from "../utils/Str";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterVarb } from "./GetterVarb";
import { InEntityGetterVarb } from "./InEntityGetterVarb";

export type EditorTextStatus = "empty" | "number" | "solvableText";

export class GetterVarbNumObj<
  SN extends SectionNameByType
> extends GetterVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbProps);
  }
  get value(): NumObj {
    return this.get.value("numObj");
  }
  removeEntity(entityId: string): NumObj {
    const entities = Arr.findAndRmClone(this.value.entities, (entity) => {
      return entity.entityId === entityId;
    });
    return { ...this.value, entities };
  }
  addEntity(entity: ValueInEntity): NumObj {
    const entities = [...this.value.entities, entity];
    return { ...this.value, entities };
  }
  get editorTextStatus(): EditorTextStatus {
    if (["", "-"].includes(this.value.mainText as any)) return "empty";
    if (Str.isRationalNumber(this.value.mainText)) return "number";
    else return "solvableText";
  }
  solvableTextFromTextAndEntities({
    mainText,
    entities,
  }: EntitiesAndEditorText): string {
    let solvableText = mainText;
    const endFirstSorted = [...entities].sort(
      (en1, en2) => en2.offset - en1.offset
    );
    for (const entity of endFirstSorted) {
      const num = this.getSolvableNumber(entity);
      solvableText = Str.replaceRange(
        solvableText,
        entity.offset,
        entity.offset + entity.length,
        `${num}`
      );
    }
    return solvableText;
  }
  private getSolvableNumber(inEntity: ValueInEntity): NumberOrQ {
    if (this.get.section.hasVarbByFocalMixed(inEntity)) {
      const varb = this.get.section.varbByFocalMixed(inEntity);
      return varb.numberOrQuestionMark;
    } else return "?";
  }
  solveTextToNumStringNext(): string {
    const { solvableText } = this.get.value("numObj");
    return this.solveTextToNumString(solvableText);
  }
  solveTextToNumString(solvableText: string): string {
    return `${this.solveText(solvableText)}`;
  }
  solveText(text: string): NumObjOutput {
    const { calcRound, valueName } = this.get.meta;
    if (!(valueName === "numObj")) {
      throw new Error("This is only for numObjs.");
    }

    // the editor should handle when someone validly types left to right
    if (text[text.length - 1] === ".")
      // if there's a dot at the end, they could be about to enter a number
      text = text.substring(0, text.length - 1);

    if (text[text.length - 1] === "-")
      // if there's a minus at the end, they might be subtracting
      // or making a negative number, which could follow another operator
      text = text.substring(0, text.length - 1);
    if (arithmeticOperatorsArr.includes(text[text.length - 1]))
      // if there's an operator before those things, it's valid
      text = text.substring(0, text.length - 1);

    try {
      let num = evaluate(text);
      if (mathS.isRationalNumber(num)) {
        const finalNum = round(num, calcRound);
        return finalNum;
      } else return "?";
    } catch (ex) {
      return "?";
    }
  }
}
