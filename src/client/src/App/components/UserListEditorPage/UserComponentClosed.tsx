import { FeRouteName } from "../../Constants/feRoutes";
import { listChildrenNames } from "../../sharedWithServer/SectionsMeta/allSectionChildren";
import { Arr } from "../../sharedWithServer/utils/Arr";
import { MainSubSectionClosed } from "../ActiveDealPage/ActiveDeal/MainSubSectionClosed";
import { useMakeGoToPage } from "../appWide/customHooks/useGoToPage";
import { ComponentClosedTitleRow } from "./ComponentsSubSectionTitleRow";

export const componentTitles = {
  repairsListMain: "Repairs",
  utilitiesListMain: "Utilities",
  holdingCostsListMain: "Holding Costs",
  capExListMain: "Capital Expenses",
  closingCostsListMain: "Closing Costs",
  outputListMain: "Outputs Collections",
  singleTimeListMain: "Custom One-time Costs",
  ongoingListMain: "Custom Ongoing Costs",
} as const;

export const userComponentNames = Arr.extractStrict(listChildrenNames, [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "closingCostsListMain",
  "singleTimeListMain",
  "ongoingListMain",
]);

type UserComponentName = typeof userComponentNames[number];
export type ListRouteName = Extract<FeRouteName, UserComponentName>;

type Props = {
  componentName: ListRouteName;
  className?: string;
};

export function UserComponentClosed({ componentName, ...rest }: Props) {
  const makeGoToPage = useMakeGoToPage();
  return (
    <MainSubSectionClosed
      {...rest}
      titleRow={
        <ComponentClosedTitleRow
          {...{
            title: componentTitles[componentName],
            editSection: makeGoToPage(componentName),
          }}
        />
      }
    />
  );
}
