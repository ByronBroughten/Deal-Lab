import { NavContainerPage } from "./general/NavContainerPage";
import { UserVarbEditor } from "./UserVarbEditorPage/UserVarbEditor";

export function UserVarbEditorPage() {
  return (
    <NavContainerPage activeBtnName="variables">
      <UserVarbEditor />
    </NavContainerPage>
  );
}
