import { round } from "lodash";
import { evaluate } from "mathjs";
import { InEntity } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import {
  EntitiesAndEditorText,
  NumberOrQ,
  NumObj,
} from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../SectionsMeta/baseSectionsUtils/baseValues/updateFnNames";
import { SectionName } from "../SectionsMeta/SectionName";
import { Arr } from "../utils/Arr";
import { arithmeticOperatorsArr, mathS } from "../utils/math";
import { Str } from "../utils/Str";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterVarb } from "./GetterVarb";

export class GetterVarbNumObj<
  SN extends SectionName
> extends GetterVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
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
  addEntity(entity: InEntity): NumObj {
    const entities = [...this.value.entities, entity];
    return { ...this.value, entities };
  }
  get editorTextStatus() {
    if (["", "-"].includes(this.value.editorText as any)) return "empty";
    if (Str.isRationalNumber(this.value.editorText)) return "number";
    else return "solvableText";
  }
  solvableTextFromTextAndEntities({
    editorText,
    entities,
  }: EntitiesAndEditorText): string {
    let solvableText = editorText;
    for (const entity of entities) {
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
  private getSolvableNumber(inEntity: InEntity): NumberOrQ {
    if (this.get.sections.hasSectionMixed(inEntity)) {
      const varb = this.get.sections.varbByMixed(inEntity);
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
  solveText(text: string): NumberOrQ {
    const { updateFnName } = this.get;
    const { calcRound } = this.get.meta;
    if (!isNumObjUpdateFnName(updateFnName)) {
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
