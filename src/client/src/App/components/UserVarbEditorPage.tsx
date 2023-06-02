import { BackBtnWrapper } from "./appWide/BackBtnWrapper";
import { ShowEqualsProvider } from "./customContexts/showEquals";
import { UserVarbEditor } from "./UserVarbEditorPage/UserVarbEditor";

export function UserVarbEditorPage() {
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <ShowEqualsProvider showEqualsStatus="showPure">
        <UserVarbEditor />
      </ShowEqualsProvider>
    </BackBtnWrapper>
  );
}
