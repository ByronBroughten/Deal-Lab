import { Arr } from "../../../utils/Arr";

export const dealModes = [
  "homeBuyer",
  "buyAndHold",
  "fixAndFlip",
  "brrrr",
] as const;

const dealModeArrs = {
  all: dealModes,
  hasHolding: Arr.extractStrict(dealModes, ["fixAndFlip", "brrrr"]),
  plusMixed: [...dealModes, "mixed"],
  maybeNoRehab: Arr.extractStrict(dealModes, ["buyAndHold", "homeBuyer"]),
  hasMgmt: Arr.extractStrict(dealModes, ["buyAndHold", "brrrr"] as const),
  hasRefi: Arr.extractStrict(dealModes, ["brrrr"]),
  hasOngoing: Arr.extractStrict(dealModes, [
    "homeBuyer",
    "buyAndHold",
    "brrrr",
  ] as const),
} as const;
type DealModeArrs = typeof dealModeArrs;
export type DealModeName = keyof DealModeArrs;

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

export function doWhatPerDealMode(doWhat: (dealMode: DealMode) => void) {
  for (const dealMode of dealModes) {
    doWhat(dealMode);
  }
}
