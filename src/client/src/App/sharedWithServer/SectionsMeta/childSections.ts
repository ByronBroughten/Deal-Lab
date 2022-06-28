import { GeneralRelChild, relChildren } from "./relSections/rel/relChild";
import { relOmniParentChildren } from "./relSections/relOmniParent";

const childSections = {
  root: relChildren({
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,
  main: relChildren({
    user: ["user"],
    serverOnlyUser: ["serverOnlyUser"],
    login: ["login"],
    register: ["register"],
    deal: ["deal"],
    propertyTableStore: ["propertyTableStore"],
    loanTableStore: ["loanTableStore"],
    mgmtTableStore: ["mgmtTableStore"],
    dealTableStore: ["dealTableStore"],
    userVarbList: ["userVarbList"],
    userOutputList: ["outputList"],
    userSingleList: ["singleTimeList"],
    userOngoingList: ["ongoingList"],
    singleTimeList: ["singleTimeList"],
    ongoingList: ["ongoingList"],
    outputList: ["outputList"],
  }),
} as const;

type ChildSections = typeof childSections;
export type SectionChildProps<PN extends keyof GeneralRelChild> = {
  [SN in keyof ChildSections]: {
    [CN in keyof ChildSections[SN]]: ChildSections[SN][CN][PN &
      keyof ChildSections[SN][CN]];
  };
};
type Test = SectionChildProps<"sectionName">["main"]["deal"];
