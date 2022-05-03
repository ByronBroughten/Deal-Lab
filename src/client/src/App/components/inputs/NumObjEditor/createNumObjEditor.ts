import { convertFromRaw, EditorState } from "draft-js";
import { omit, pick } from "lodash";
import getNewRawContent, {
  numObjToRawContent,
  textToRawContent,
} from "../../../modules/draftjs/rawEditorContent";
import StateVarb from "../../../sharedWithServer/Analyzer/StateSection/StateVarb";
import {
  EntityMapData,
  InEntities,
} from "../../../sharedWithServer/SectionMetas/baseSections/baseValues/entities";
import { NumObj } from "../../../sharedWithServer/SectionMetas/baseSections/baseValues/NumObj";
import {
  DraftBlock,
  EntityMap,
  EntityRanges,
  RawEditorState,
} from "../../../utils/DraftS";

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

function valueToRawContent(value: any) {
  if (value === undefined) return getNewRawContent();
  if (typeof value === "string") return textToRawContent(value);
  if (value instanceof NumObj) return numObjToRawContent(value);
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
