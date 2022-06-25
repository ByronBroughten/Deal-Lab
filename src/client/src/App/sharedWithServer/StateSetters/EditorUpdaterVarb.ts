import Draft, {
  CompositeDecorator,
  ContentState,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { pick } from "lodash";
import {
  draftUtils,
  numObjToRawContent,
} from "../../modules/draftjs/draftUtils";
import { EntityMap, EntityRanges, RawEditorState } from "../../utils/DraftS";
import { InEntities } from "../SectionsMeta/baseSections/baseValues/entities";
import {
  EntitiesAndEditorText,
  NumObj,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { isEditorUpdateFnName } from "../SectionsMeta/baseSections/baseValues/StateValueTypes";
import { EditorValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbNumObj } from "../StateGetters/GetterVarbNumObj";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { Arr } from "../utils/Arr";

type ContentCreators = {
  [EN in EditorValueTypeName]: () => ContentState;
};

export type CreateEditorProps = {
  valueType: EditorValueTypeName;
  compositeDecorator?: CompositeDecorator;
};
export class EditorUpdaterVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  get updaterVarb(): UpdaterVarb<SN> {
    return new UpdaterVarb(this.getterVarbProps);
  }
  get getterVarb(): GetterVarb<SN> {
    return new GetterVarb(this.getterVarbProps);
  }
  private get numObjSolver() {
    return new GetterVarbNumObj(this.getterVarbProps);
  }

  createEditor({ valueType, compositeDecorator }: CreateEditorProps) {
    const contentCreators: ContentCreators = {
      string: () => {
        return ContentState.createFromText(this.getterVarb.value("string"));
      },
      numObj: () => {
        return Draft.convertFromRaw(
          numObjToRawContent(this.getterVarb.value("numObj"))
        );
      },
      stringArray: () => {
        return ContentState.createFromText(
          this.getterVarb.value("stringArray").join()
        );
      },
    };

    const content = contentCreators[valueType]();
    return EditorState.createWithContent(content, compositeDecorator);
  }
  update(contentState: ContentState): void {
    const nextValue = this.valueFromContentState(contentState);
    this.updaterVarb.update({
      value: nextValue,
    });
  }
  private valueFromContentState(
    contentState: ContentState
  ): string | string[] | NumObj {
    const { updateFnName } = this.getterVarb;
    if (!isEditorUpdateFnName(updateFnName)) {
      throw new Error(`${updateFnName} is not an editor updateFnName`);
    }
    if (updateFnName === "calcVarbs") {
      return this.numObjFromContent(contentState);
    } else return updateEditorByBasicType[updateFnName](contentState);
  }
  private numObjFromContent(contentState: ContentState): NumObj {
    const textAndEntities = textAndEntitiesFromContentState(contentState);
    return this.numObjFromTextAndEntities(textAndEntities);
  }
  private numObjFromTextAndEntities(
    textAndEntities: EntitiesAndEditorText
  ): NumObj {
    const solvableText =
      this.numObjSolver.solvableTextFromTextAndEntities(textAndEntities);
    const numString = this.numObjSolver.solveTextToNumString(solvableText);
    return new NumObj({ ...textAndEntities, solvableText, numString });
  }
}

const updateEditorByBasicType = {
  string(contentState: ContentState): string {
    return draftUtils.contentStateToText(contentState);
  },
  stringArray(contentState: ContentState): string[] {
    const text = this.string(contentState);
    const arr = text.split(",");
    if (arr.length > 0 && Arr.lastOrThrow(arr) === "") arr.pop();
    return arr;
  },
};

function textAndEntitiesFromContentState(
  contentState: ContentState
): EntitiesAndEditorText {
  const rawEditorState = draftUtils.contentStateToRaw(contentState);
  return textAndEntitiesFromRaw(rawEditorState);
}
function textAndEntitiesFromRaw(
  rawEditorState: RawDraftContentState
): EntitiesAndEditorText {
  const { blocks, entityMap } = rawEditorState as RawEditorState;
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
