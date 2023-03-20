import { BackBtnWrapper } from "./appWide/BackBtnWrapper";
import { UserVarbEditor } from "./UserVarbEditorPage/UserVarbEditor";

export function UserVarbEditorPage() {
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <UserVarbEditor />
    </BackBtnWrapper>
  );
}
