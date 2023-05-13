import { Arr } from "../../../utils/Arr";

export const dealModes = [
  "homeBuyer",
  "buyAndHold",
  "fixAndFlip",
  // brrrr
] as const;

const dealModeArrs = {
  all: dealModes,
  plusMixed: [...dealModes, "mixed"],
  hasMgmt: Arr.extractStrict(dealModes, ["buyAndHold"] as const),
  hasOngoing: Arr.extractStrict(dealModes, [
    "buyAndHold",
    "homeBuyer",
  ] as const),
} as const;
type DealModeArrs = typeof dealModeArrs;
type DealModeName = keyof DealModeArrs;

export type DealMode<DN extends DealModeName = "all"> =
  DealModeArrs[DN][number];

export function getDealModes<DN extends DealModeName = "all">(
  dn?: DN
): DealMode<DN>[] {
  return dealModeArrs[dn ?? "all"] as DealMode<DN>[];
}

export function isDealMode<DN extends DealModeName = "all">(
  value: any,
  dealModeName?: DN
): value is DealMode<DN> {
  const modes = getDealModes(dealModeName);
  return modes.includes(value);
}
