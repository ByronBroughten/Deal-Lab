import { RelSections } from "../relSections";
import { SectionContext } from "../relSections/baseSections";
import { BaseName } from "../relSections/baseSectionTypes";

type PreUserLists = {
  [Prop in BaseName<
    "userList",
    SectionContext
  >]: RelSections[SectionContext][Prop];
};
type UserListItemTypes = {
  [Prop in BaseName<"userList">]: PreUserLists[Prop]["childSectionNames"][number];
};
export type UserItemSectionName = UserListItemTypes[BaseName<"userList">];
export const userListItemTypes: UserListItemTypes = {
  userSingleList: "singleTimeItem",
  userOngoingList: "ongoingItem",
  userVarbList: "userVarbItem",
} as const;
