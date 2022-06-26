import { BaseName } from "../baseSectionTypes";
import { ChildName } from "./ChildTypes";

type UserListItemTypes = {
  [SN in BaseName<"userList">]: ChildName<SN>;
};
export type UserItemSectionName = UserListItemTypes[BaseName<"userList">];
export const userListItemTypes: UserListItemTypes = {
  userSingleList: "singleTimeItem",
  userOngoingList: "ongoingItem",
  userVarbList: "userVarbItem",
} as const;
