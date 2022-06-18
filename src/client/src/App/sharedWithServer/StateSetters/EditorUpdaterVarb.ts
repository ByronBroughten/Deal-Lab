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
import { isEditorUpdateFnName } from "../FeSections/FeSection/FeVarb/feValue";
import {
  InEntities,
  InEntity,
} from "../SectionsMeta/baseSections/baseValues/entities";
import {
  DbNumObj,
  EntitiesAndEditorText,
  NumObj,
  NumObjNumber,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../SectionsMeta/baseSections/baseValues/updateFnNames";
import { EditorValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { solveText } from "../StateSolvers/SolveValueVarb/solveText";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { Arr } from "../utils/Arr";
import { Str } from "../utils/Str";

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
  private updaterVarb = new UpdaterVarb(this.getterVarbProps);
  private getterVarb = new GetterVarb(this.getterVarbProps);
  private getterSections = new GetterSections(this.getterSectionsProps);
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
    return this.numObjFromDbNumObj(textAndEntities);
  }
  private numObjFromDbNumObj(dbNumObj: DbNumObj): NumObj {
    // this should probably be somewhere else, or numObj ought
    // to be simplifid
    const solvableText = this.solvableTextFromEditorTextAndEntities(dbNumObj);
    const number = this.solvableTextToNumber(solvableText);
    return new NumObj(dbNumObj, { solvableText, number });
  }
  private solvableTextFromEditorTextAndEntities({
    editorText,
    entities,
  }: DbNumObj): string {
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
  private getSolvableNumber(inEntity: InEntity): NumObjNumber {
    if (this.getterSections.hasSectionMixed(inEntity)) {
      const varb = this.getterSections.varbByMixed(inEntity);
      return varb.value("numObj").number;
    } else return "?";
  }
  private solvableTextToNumber(solvableText: string): NumObjNumber {
    const { updateFnName } = this.getterVarb;
    if (isNumObjUpdateFnName(updateFnName)) {
      const { unit } = this.getterVarb.meta;
      return solveText(solvableText, unit, updateFnName);
    } else {
      throw new Error("For now, this is only for numObjs.");
    }
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
