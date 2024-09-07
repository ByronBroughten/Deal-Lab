import { SetEditorState } from "../../../../../modules/draftjs/draftUtils";
import { insertEntity } from "../../../../../modules/draftjs/insert";
import { ValueInEntityInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { EntityMapData } from "../../../../../sharedWithServer/stateSchemas/StateValue/stateValuesShared/entities";
import { IdS } from "../../../../../sharedWithServer/utils/IdS";

type Props = {
  setEditorState: SetEditorState;
  varbInfo: ValueInEntityInfo;
  displayName: string;
};

export function insertVarbEntity({
  setEditorState,
  varbInfo,
  displayName,
}: Props) {
  const entityData: EntityMapData = {
    ...varbInfo,
    entityId: IdS.make(),
  };
  setEditorState((editorState) =>
    insertEntity(editorState, displayName, entityData)
  );
}
