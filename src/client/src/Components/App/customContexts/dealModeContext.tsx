import { makeContextUseContext } from "../../../modules/utils/react";
import { DealMode } from "../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/dealMode";

const [DealModeContext, use] = makeContextUseContext(
  "DealModeContext",
  "mixed" as DealMode<"plusMixed">
);

export const useDealModeContext = use;

interface Props {
  dealMode: DealMode<"plusMixed">;
  children: React.ReactNode;
}
export function DealModeProvider({ children, dealMode }: Props) {
  return (
    <DealModeContext.Provider value={dealMode}>
      {children}
    </DealModeContext.Provider>
  );
}
