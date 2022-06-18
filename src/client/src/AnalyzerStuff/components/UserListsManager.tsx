import ListManager from "./ListManager";

export default function UserListsManager() {
  return (
    <div>
      <ListManager sectionName="userSingleList" />
      <ListManager sectionName="userOngoingList" />
    </div>
  );
}
