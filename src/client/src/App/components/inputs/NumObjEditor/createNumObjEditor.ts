import { convertFromRaw, EditorState } from "draft-js";
import getNewRawContent, {
  textToRawContent,
} from "../../../modules/draftjs/rawEditorContent";
import {
  DraftBlock,
  EntityMap,
  EntityRanges,
  RawEditorState,
} from "../../../utils/Draf";
import { omit, pick } from "lodash";
import StateVarb from "../../../sharedWithServer/Analyzer/StateSection/StateVarb";
import { NumObj } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj";
import {
  EntityMapData,
  InEntities,
} from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";

export interface CreateEditorProps {
  varb: StateVarb;
  compositeDecorator?: any | undefined;
}

function entitiesToDraftEntities(entities: InEntities) {
  const entityRanges: EntityRanges = [];
  const entityMap: EntityMap = {};
  for (const [key, entity] of Object.entries(entities)) {
    entityRanges.push({
      key: parseInt(key),
      ...pick(entity, ["length", "offset"]),
    });
    entityMap[key] = {
      data: omit(entity, ["length", "offset"]) as EntityMapData,
      mutability: "IMMUTABLE",
      type: "TOKEN",
    };
  }
  return { entityRanges, entityMap };
}

type RestoreProps = { editorText: string; entities: InEntities };
function restoreRawEditorState({
  editorText,
  entities,
}: RestoreProps): RawEditorState {
  const { entityRanges, entityMap } = entitiesToDraftEntities(entities);
  const block: DraftBlock = {
    text: editorText,
    entityRanges,
    key: "8rpc7",
    type: "unstyled",
    depth: 0,
    data: {},
    inlineStyleRanges: [],
  };

  return {
    blocks: [block],
    entityMap,
  };
}

function textFromNumObj({ editorText, number }: NumObj): string {
  if (editorText) return editorText;
  else if (typeof number === "number") return `${number}`;
  else return "";
}
function valueToRawContent(value: any) {
  if (value === undefined) return getNewRawContent();
  if (typeof value === "string") return textToRawContent(value);
  if (value instanceof NumObj) return textToRawContent(textFromNumObj(value));
  if ("entities" in value) return restoreRawEditorState(value);
  throw new Error(`This value didn't work for creating an editor: ${value}`);
}

export default function createNumObjEditor({
  varb,
  compositeDecorator,
}: CreateEditorProps): EditorState {
  const rawContent = valueToRawContent(varb.value("numObj"));
  return EditorState.createWithContent(
    convertFromRaw(rawContent),
    compositeDecorator
  );
}
