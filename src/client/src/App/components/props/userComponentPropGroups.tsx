import React from "react";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FaFaucet, FaHandHoldingUsd, FaMoneyCheckAlt } from "react-icons/fa";
import { MdAttachMoney, MdOutlineRoofing, MdSell } from "react-icons/md";
import { VscOutput } from "react-icons/vsc";
import { constants } from "../../Constants";
import { icons } from "../Icons";
import { StoreName } from "./../../sharedWithServer/SectionsMeta/sectionStores";

type Props = {
  title: string;
  loadWhat: string;
  makeIcon: () => React.ReactNode;
};

const props = (
  title: string,
  loadWhat: string,
  makeIcon: () => React.ReactNode
): Props => ({
  title,
  loadWhat,
  makeIcon,
});

type ComponentProps = Record<StoreName, Props>;

const iconProps = { size: 27 } as const;
export const componentProps: ComponentProps = {
  repairsListMain: props("Repairs", "repairs", () => icons.repair(iconProps)),
  utilitiesListMain: props("Utilities", "utilities", () => (
    <FaFaucet {...iconProps} />
  )),
  holdingCostsListMain: props("Holding Costs", "holding costs", () => (
    <FaHandHoldingUsd {...iconProps} />
  )),
  capExListMain: props("Capital Expenses", "Cap Ex", () => (
    <MdOutlineRoofing {...iconProps} />
  )),
  sellingListMain: props("Selling Costs", "selling costs", () => (
    <MdSell {...iconProps} />
  )),
  closingCostsListMain: props("Closing Costs", "closing costs", () => (
    <FaMoneyCheckAlt {...iconProps} />
  )),

  onetimeListMain: props("Custom Onetime", "custom onetime costs", () => (
    <MdAttachMoney {...iconProps} />
  )),
  ongoingListMain: props("Custom Ongoing", "custom ongoing costs", () => (
    <AiOutlineFieldTime {...iconProps} />
  )),

  dealMain: props(
    constants.appUnitPlural,
    constants.appUnit.toLowerCase(),
    () => ""
  ),
  propertyMain: props("Properties", "property", () => ""),
  loanMain: props("Loans", "loan", () => ""),
  mgmtMain: props("Managements", "management", () => ""),

  boolVarbListMain: props("Pass or fail variables", "variables", () => ""),
  numVarbListMain: props("Numeric variables", "variables", () => ""),
  outputListMain: props("Outputs collections", "outputs", () => (
    <VscOutput {...iconProps} />
  )),

  outputSection: props("Output sections", "output sections", () => ""),
  dealCompareMenu: props(
    `${constants.appUnit} compare cache`,
    `${constants.appUnit.toLowerCase()} compare cache`,
    () => ""
  ),
};
