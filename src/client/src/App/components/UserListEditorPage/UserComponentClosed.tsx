import { SxProps } from "@mui/material";
import { FeRouteName } from "../../Constants/feRoutes";
import { listChildrenNames } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { Arr } from "../../sharedWithServer/utils/Arr";
import { MainSubSectionClosed } from "../ActiveDealPage/ActiveDeal/MainSubSectionClosed";
import { useMakeGoToPage } from "../appWide/customHooks/useGoToPage";
import { componentProps } from "../props/userComponentPropGroups";
import { ComponentClosedTitleRow } from "./ComponentsSubSectionTitleRow";

export const userComponentNames = Arr.extractStrict(listChildrenNames, [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "sellingListMain",
  "closingCostsListMain",
  "singleTimeListMain",
  "ongoingListMain",
]);

type UserComponentName = typeof userComponentNames[number];
export type ListRouteName = Extract<FeRouteName, UserComponentName>;

type Props = {
  sx?: SxProps;
  componentName: ListRouteName;
};

export function UserComponentClosed({ componentName, ...rest }: Props) {
  const makeGoToPage = useMakeGoToPage();
  const { title, makeIcon } = componentProps[componentName];
  return (
    <MainSubSectionClosed
      {...rest}
      titleRow={
        <ComponentClosedTitleRow
          {...{
            icon: makeIcon(),
            title,
            editSection: makeGoToPage(componentName),
          }}
        />
      }
    />
  );
}
