import { SetEditorState } from "../../../../modules/draftjs/draftUtils";
import { insertEntity } from "../../../../modules/draftjs/insert";
import {
  EntityMapData,
  ValueInEntityInfo,
} from "../../../../sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";

import { Id } from "../../../../sharedWithServer/SectionsMeta/Id";

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
