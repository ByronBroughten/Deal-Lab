import { VarbListOutputs } from "./appWide/VarbLists/VarbListOutputs";
import { UserListsPageGeneric } from "./UserListPageShared/UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

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
