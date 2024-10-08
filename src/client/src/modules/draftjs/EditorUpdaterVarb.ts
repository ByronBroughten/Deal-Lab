import Draft, {
  CompositeDecorator,
  ContentState,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { pick } from "lodash";
import { GetterVarbBase } from "../../sharedWithServer/StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { GetterVarbNumObj } from "../../sharedWithServer/StateGetters/GetterVarbNumObj";
import { InEntityGetterVarb } from "../../sharedWithServer/StateGetters/InEntityGetterVarb";
import { UpdaterVarb } from "../../sharedWithServer/StateOperators/Updaters/UpdaterVarb";
import { SectionName } from "../../sharedWithServer/stateSchemas/schema2SectionNames";
import { EditorValueName } from "../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/EditorValue";
import {
  EntitiesAndEditorText,
  NumObj,
} from "../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/NumObj";
import { ValueInEntity } from "../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/stateValuesShared/entities";
import { StringObj } from "../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/StringObj";
import { isEditorUpdateFnName } from "../../sharedWithServer/stateSchemas/schema5VariablesLogic/updateVarb/UpdateFnName";
import { Arr } from "../../sharedWithServer/utils/Arr";
import { EntityMap, EntityRanges, RawEditorState } from "../utils/DraftS";
import { draftUtils, numObjToRawContent } from "./draftUtils";

const editorEntitySource = "editor";

type ContentCreators = {
  [EN in EditorValueName]: () => ContentState;
};
export type CreateEditorProps = {
  valueType: EditorValueName;
  compositeDecorator?: CompositeDecorator;
};
export class EditorUpdaterVarb<
  SN extends SectionName = SectionName
> extends GetterVarbBase<SN> {
  get updaterVarb(): UpdaterVarb<SN> {
    return new UpdaterVarb(this.getterVarbProps);
  }
  get inEntity(): InEntityGetterVarb<SN> {
    return new InEntityGetterVarb(this.getterVarbProps);
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
      stringObj: () => {
        return ContentState.createFromText(
          this.getterVarb.value("stringObj").mainText
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
  valueFromContentState(
    contentState: ContentState
  ): string | string[] | NumObj | StringObj {
    const { updateFnName } = this.inEntity;
    if (!isEditorUpdateFnName(updateFnName)) {
      throw new Error(`"${updateFnName}" is not an editor updateFnName.`);
    }
    const { valueName } = this.getterVarb;
    if (valueName in this.valueFromEditorFns) {
      return this.valueFromEditorFns[
        valueName as keyof typeof this.valueFromEditorFns
      ](contentState);
    } else
      throw new Error(`value of type "${valueName}" cannot update via editor.`);
  }
  valueFromEditorFns = {
    numObj: (contentState: ContentState): NumObj => {
      const textAndEntities = this.applyContentTextAndEntities(contentState);
      const solvableText =
        this.numObjSolver.solvableTextFromTextAndEntities(textAndEntities);
      return {
        ...textAndEntities,
        solvableText,
      };
    },
    stringObj: (contentState: ContentState): StringObj => {
      return {
        ...this.getterVarb.value("stringObj"),
        mainText: draftUtils.contentStateText(contentState),
      };
    },
    string(contentState: ContentState): string {
      return draftUtils.contentStateText(contentState);
    },
    stringArray(contentState: ContentState): string[] {
      const text = this.string(contentState);
      const arr = text.split(",");
      if (arr.length > 0 && Arr.lastOrThrow(arr) === "") arr.pop();
      return arr;
    },
  };
  private applyContentTextAndEntities(contentState: ContentState) {
    let { mainText, entities } = textAndEntitiesFromContentState(contentState);
    const prevValue = this.getterVarb.multiValue("numObj", "stringObj");
    const nonEditorEntities = prevValue.entities.filter(
      (entity) => entity.entitySource !== editorEntitySource
    );
    return {
      mainText,
      entities: [...entities, ...nonEditorEntities],
    };
  }
}

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
  const { text: mainText, entityRanges } = blocks[0];
  return {
    mainText,
    entities: entitiesFromMapAndRanges(entityMap, entityRanges),
  };
}
function entitiesFromMapAndRanges(
  entityMap: EntityMap,
  entityRanges: EntityRanges
): ValueInEntity[] {
  const inEntities = entityRanges.reduce((inEntities, entityRange) => {
    const { data } = entityMap[entityRange.key];
    return inEntities.concat([
      {
        ...data,
        ...pick(entityRange, ["offset", "length"]),
        entitySource: editorEntitySource,
      } as ValueInEntity,
    ]);
  }, [] as ValueInEntity[]);
  // the entities must be updated from right to left.
  // otherwise their offsets can become inaccurate in the middle of updating
  return inEntities.sort((a, b) => b.offset - a.offset);
}
