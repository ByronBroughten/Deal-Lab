import { EditorState } from "draft-js";
import { pick } from "lodash";
import {
  editorStateToText,
  getRawContentFromEditorState,
} from "../../../App/modules/draftjs/draftUtils";
import { InEntities } from "../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import {
  EntitiesAndEditorText,
  NumObj,
} from "../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/NumObj";
import { FeVarbInfo } from "../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { Arr } from "../../../App/sharedWithServer/utils/Arr";
import {
  EntityMap,
  EntityRanges,
  RawEditorState,
} from "../../../App/utils/DraftS";
import Analyzer from "../Analyzer";
import { internal } from "../Analyzer/methods/internal";
import { isEditorUpdateFnName } from "../Analyzer/StateSection/StateVarb/stateValue";

const updateEditorByBasicType = {
  string(editorState: EditorState): string {
    return editorStateToText(editorState);
  },
  stringArray(editorState: EditorState): string[] {
    const text = editorStateToText(editorState);
    const arr = text.split(",");
    if (arr.length > 0 && Arr.lastOrThrow(arr) === "") arr.pop();
    return arr;
  },
};

export function updateFromEditorAndSolve(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  editorState: EditorState
): Analyzer {
  let next = updateValueFromEditor(analyzer, feVarbInfo, editorState);
  const varbInfosToSolve = next.outVarbInfos(feVarbInfo);
  // solving the varb that was updated messes with the editor cursor
  // due to manualUpdateEditorToggle
  return next.solveVarbs(varbInfosToSolve);
}

function updateValueFromEditor(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  editorState: EditorState
): Analyzer {
  let next = analyzer;

  const nextValue = valueFromEditor(next, feVarbInfo, editorState);
  return internal.updateValue(next, feVarbInfo, nextValue, true);
}

function valueFromEditor(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  editorState: EditorState
): string | string[] | NumObj {
  const updateFnName = analyzer.updateFnName(feVarbInfo);
  if (!isEditorUpdateFnName(updateFnName)) {
    throw new Error(`${updateFnName} is not an editor updateFnName`);
  }
  if (updateFnName === "calcVarbs")
    return numObjFromEditor(analyzer, feVarbInfo, editorState);
  else return updateEditorByBasicType[updateFnName](editorState);
}
function numObjFromEditor(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  editorState: EditorState
): NumObj {
  const textAndEntities = textAndEntitiesFromEditorState(editorState);
  const solvableText =
    analyzer.solvableTextFromEditorTextAndEntities(textAndEntities);
  const number = analyzer.solvableTextToNumber(feVarbInfo, solvableText);
  return new NumObj(textAndEntities, { solvableText, number });
}
function textAndEntitiesFromEditorState(
  editorState: EditorState
): EntitiesAndEditorText {
  const rawEditorState = getRawContentFromEditorState(editorState);
  return textAndEntitiesFromRaw(rawEditorState);
}
function textAndEntitiesFromRaw(
  rawEditorState: RawEditorState
): EntitiesAndEditorText {
  const { blocks, entityMap } = rawEditorState;
  const { text: editorText, entityRanges } = blocks[0];
  return {
    editorText,
    entities: entitiesFromMapAndRanges(entityMap, entityRanges),
  };
}
function entitiesFromMapAndRanges(
  entityMap: EntityMap,
  entityRanges: EntityRanges
): InEntities {
  const inEntities = entityRanges.reduce((inEntities, entityRange) => {
    const { data } = entityMap[entityRange.key];
    return inEntities.concat([
      {
        ...data,
        ...pick(entityRange, ["offset", "length"]),
      },
    ]);
  }, [] as InEntities);
  // the entities must be updated from right to left.
  // otherwise their offsets can become inaccurate in the middle of updating
  return inEntities.sort((a, b) => b.offset - a.offset);
}
