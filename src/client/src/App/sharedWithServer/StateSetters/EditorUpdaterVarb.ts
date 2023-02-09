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
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { isEditorUpdateFnName } from "../SectionsMeta/updateSectionVarbs/updateVarb/UpdateFnName";
import { EditorValueName } from "../SectionsMeta/values/EditorValue";
import {
  EntitiesAndEditorText,
  NumObj,
} from "../SectionsMeta/values/StateValue/NumObj";
import { StringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { ValueInEntity } from "../SectionsMeta/values/StateValue/valuesShared/entities";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbNumObj } from "../StateGetters/GetterVarbNumObj";
import { InEntityGetterVarb } from "../StateGetters/InEntityGetterVarb";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { Arr } from "../utils/Arr";

type ContentCreators = {
  [EN in EditorValueName]: () => ContentState;
};
export type CreateEditorProps = {
  valueType: EditorValueName;
  compositeDecorator?: CompositeDecorator;
};
export class EditorUpdaterVarb<
  SN extends SectionNameByType<"hasVarb">
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
      const textAndEntities = textAndEntitiesFromContentState(contentState);
      const solvableText =
        this.numObjSolver.solvableTextFromTextAndEntities(textAndEntities);
      return { ...textAndEntities, solvableText };
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
        entitySource: "editor",
      } as ValueInEntity,
    ]);
  }, [] as ValueInEntity[]);
  // the entities must be updated from right to left.
  // otherwise their offsets can become inaccurate in the middle of updating
  return inEntities.sort((a, b) => b.offset - a.offset);
}
