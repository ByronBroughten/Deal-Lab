import { VarbListOutputs } from "./appWide/VarbLists/VarbListOutputs";
import { UserListsPageGeneric } from "./UserEditorPageShared/UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbEditorPage/UserListsGeneralSection";

export function UserOutputListPage() {
  const themeName = "userOutput";
  return (
    <UserListsPageGeneric themeName={themeName} saveWhat="custom outputs">
      <UserListsGeneralSection
        themeName={themeName}
        storeName="outputListMain"
        title="Output lists"
        makeListNode={(nodeProps) => (
          <VarbListOutputs {...{ ...nodeProps, menuType: "simple" }} />
        )}
      />
    </UserListsPageGeneric>
  );
}
