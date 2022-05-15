import { ContextName } from "../baseSections";
import { BaseName } from "../baseSectionTypes";
import { RelSections } from "../relSections";

type PreUserLists = {
  [Prop in BaseName<"userList", ContextName>]: RelSections[ContextName][Prop];
};
type UserListItemTypes = {
  [Prop in BaseName<"userList">]: PreUserLists[Prop]["childNames"][number];
};
export type UserItemSectionName = UserListItemTypes[BaseName<"userList">];
export const userListItemTypes: UserListItemTypes = {
  userSingleList: "singleTimeItem",
  userOngoingList: "ongoingItem",
  userVarbList: "userVarbItem",
} as const;
