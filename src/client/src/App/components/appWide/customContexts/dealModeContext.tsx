import { DealMode } from "../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { makeContextUseContext } from "../../../utils/react";

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
