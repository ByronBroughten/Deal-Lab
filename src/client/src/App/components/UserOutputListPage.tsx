import { VarbListOutputs } from "./appWide/VarbLists/VarbListOutputs";
import { UserListsGeneral } from "./UserListsGeneral";
import { UserListMainSection } from "./UserVarbListPage/UserListMainSection";

export function UserOutputListPage() {
  const themeName = "userOutput";
  return (
    <UserListsGeneral themeName={themeName} saveWhat="custom outputs">
      <UserListMainSection
        themeName={themeName}
        storeName="outputListMain"
        title="Output lists"
        makeListNode={(nodeProps) => (
          <VarbListOutputs {...{ ...nodeProps, menuType: "simple" }} />
        )}
      />
    </UserListsGeneral>
  );
}
