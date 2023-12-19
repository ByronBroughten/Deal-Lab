import { Id } from "../../../../../sharedWithServer/Ids/IdS";
import { ValueInEntityInfo } from "../../../../../sharedWithServer/SectionInfo/ValueInEntityInfo";
import { EntityMapData } from "../../../../../sharedWithServer/sectionVarbsConfig/StateValue/stateValuesShared/entities";
import { SetEditorState } from "../../../../modules/draftjs/draftUtils";
import { insertEntity } from "../../../../modules/draftjs/insert";

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
    entityId: Id.make(),
  };
  setEditorState((editorState) =>
    insertEntity(editorState, displayName, entityData)
  );
}
