import { SxProps } from "@mui/material";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FaFaucet, FaHandHoldingUsd, FaMoneyCheckAlt } from "react-icons/fa";
import {
  MdAttachMoney,
  MdOutlineHomeRepairService,
  MdOutlineRoofing,
} from "react-icons/md";
import { VscOutput } from "react-icons/vsc";
import { FeRouteName } from "../../Constants/feRoutes";
import { listChildrenNames } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { Arr } from "../../sharedWithServer/utils/Arr";
import { MainSubSectionClosed } from "../ActiveDealPage/ActiveDeal/MainSubSectionClosed";
import { useMakeGoToPage } from "../appWide/customHooks/useGoToPage";
import { ComponentClosedTitleRow } from "./ComponentsSubSectionTitleRow";

const iconProps = { size: 27 } as const;
const componentProps = {
  repairsListMain: [
    "Repairs",
    () => <MdOutlineHomeRepairService {...iconProps} />,
  ],
  utilitiesListMain: ["Utilities", () => <FaFaucet {...iconProps} />],
  holdingCostsListMain: [
    "Holding Costs",
    () => <FaHandHoldingUsd {...iconProps} />,
  ],
  capExListMain: [
    "Capital Expenses",
    () => <MdOutlineRoofing {...iconProps} />,
  ],
  closingCostsListMain: [
    "Closing Costs",
    () => <FaMoneyCheckAlt {...iconProps} />,
  ],
  outputListMain: ["Outputs Collections", () => <VscOutput {...iconProps} />],
  singleTimeListMain: [
    "Custom One-time Costs",
    () => <MdAttachMoney {...iconProps} />,
  ],
  ongoingListMain: [
    "Custom Ongoing Costs",
    () => <AiOutlineFieldTime {...iconProps} />,
  ],
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
  sx?: SxProps;
  componentName: ListRouteName;
};

export function UserComponentClosed({ componentName, ...rest }: Props) {
  const makeGoToPage = useMakeGoToPage();
  const [title, makeIcon] = componentProps[componentName];
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
