import { Str } from "../../../../../../utils/Str";
import { NumObj, NumObjNumber } from "../../../baseSections/baseValues/NumObj";
import { updateInfo } from "../updateInfo";

export type NumberEntity = {
  offset: number;
  length: number;
  number: NumObjNumber;
};

export const equationVarbUpdate = updateInfo(
  "numberEntities",
  ({ current, roundTo, finishingTouch, numberEntities }) => {
    const { editorText } = current;
    const solvableText = getSolvableText({ editorText, numberEntities });
    const number = NumObj.solveText(solvableText, roundTo, finishingTouch);
    return current.updateCache({
      solvableText,
      number,
    });
  }
);

function getSolvableText({
  editorText,
  numberEntities,
}: {
  editorText: string;
  numberEntities: NumberEntity[];
}): string {
  let solvableText = editorText;
  for (const entity of numberEntities) {
    solvableText = Str.replaceRange(solvableText, {
      start: entity.offset,
      end: entity.offset + entity.length,
      replaceWith: `${entity.number}`,
    });
  }
  return solvableText;
}
